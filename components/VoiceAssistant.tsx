import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Mic, Waves } from 'lucide-react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob as GenAIBlob } from '@google/genai';

// Audio decoding and encoding functions
function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function encode(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

interface VoiceAssistantProps {
  onClose: () => void;
}

export const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ onClose }) => {
  const [status, setStatus] = useState<'idle' | 'initializing' | 'listening' | 'processing' | 'speaking' | 'error'>('initializing');
  const [userTranscript, setUserTranscript] = useState('');
  const [modelTranscript, setModelTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  const nextStartTimeRef = useRef(0);
  const audioSourcesRef = useRef(new Set<AudioBufferSourceNode>());

  const connectToGemini = useCallback(async () => {
    setStatus('initializing');
    setError(null);
    try {
      if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set.");
      }
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

      sessionPromiseRef.current = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {},
          outputAudioTranscription: {},
        },
        callbacks: {
          onopen: () => {
            if (!inputAudioContextRef.current || !streamRef.current) return;
            const source = inputAudioContextRef.current.createMediaStreamSource(streamRef.current);
            mediaStreamSourceRef.current = source;
            const scriptProcessor = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);
            scriptProcessorRef.current = scriptProcessor;
            scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
              const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
              const pcmBlob: GenAIBlob = {
                data: encode(new Uint8Array(new Int16Array(inputData.map(v => v * 32768)).buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              if (sessionPromiseRef.current) {
                sessionPromiseRef.current.then((session) => {
                  session.sendRealtimeInput({ media: pcmBlob });
                });
              }
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContextRef.current.destination);
            setStatus('listening');
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.inputTranscription) {
              setUserTranscript(prev => prev + message.serverContent.inputTranscription.text);
            }
            if (message.serverContent?.outputTranscription) {
              setModelTranscript(prev => prev + message.serverContent.outputTranscription.text);
            }
             if (message.serverContent?.modelTurn?.parts[0]?.inlineData?.data) {
              setStatus('speaking');
              const base64Audio = message.serverContent.modelTurn.parts[0].inlineData.data;
              const outputCtx = outputAudioContextRef.current;
              if (outputCtx) {
                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
                const audioBuffer = await decodeAudioData(decode(base64Audio), outputCtx, 24000, 1);
                const source = outputCtx.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(outputCtx.destination);
                source.addEventListener('ended', () => {
                  audioSourcesRef.current.delete(source);
                  if (audioSourcesRef.current.size === 0) {
                    setStatus('listening');
                  }
                });
                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += audioBuffer.duration;
                audioSourcesRef.current.add(source);
              }
            }
            if (message.serverContent?.turnComplete) {
              setUserTranscript('');
              setModelTranscript('');
            }
          },
          onerror: (e: ErrorEvent) => {
            setError(`Connection error: ${e.message}`);
            setStatus('error');
          },
          onclose: () => {
            // connection closed
          },
        },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unknown error occurred during initialization.";
      setError(message);
      setStatus('error');
    }
  }, []);
  
  const disconnect = useCallback(() => {
    streamRef.current?.getTracks().forEach(track => track.stop());
    scriptProcessorRef.current?.disconnect();
    mediaStreamSourceRef.current?.disconnect();
    inputAudioContextRef.current?.close();
    outputAudioContextRef.current?.close();

    if (sessionPromiseRef.current) {
        sessionPromiseRef.current.then(session => session.close());
    }

    streamRef.current = null;
    scriptProcessorRef.current = null;
    mediaStreamSourceRef.current = null;
    inputAudioContextRef.current = null;
    outputAudioContextRef.current = null;
    sessionPromiseRef.current = null;
  }, []);

  useEffect(() => {
    connectToGemini();
    return () => {
      disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const handleClose = () => {
    disconnect();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md m-4 flex flex-col h-[70vh]">
        <header className="flex items-center justify-between p-4 border-b">
          <h3 className="font-bold text-lg">Voice Assistant</h3>
          <button onClick={handleClose} className="p-2 rounded-full hover:bg-gray-100"><X size={20} /></button>
        </header>

        <main className="flex-1 p-6 flex flex-col items-center justify-center text-center">
            <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-colors duration-300 ${status === 'listening' ? 'bg-green-100' : 'bg-blue-100'}`}>
                {status === 'speaking' ? 
                  <Waves className="w-16 h-16 text-blue-500 animate-pulse"/> : 
                  <Mic className={`w-16 h-16 transition-colors duration-300 ${status === 'listening' ? 'text-green-500' : 'text-gray-400'}`} />
                }
            </div>
            <p className="mt-4 font-semibold text-gray-700 capitalize">{status}</p>
            {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
        </main>

        <footer className="p-4 border-t h-32 overflow-y-auto">
          <p className="text-gray-500 text-sm"><span className="font-bold">You:</span> {userTranscript}</p>
          <p className="text-brand-green text-sm mt-2"><span className="font-bold">Kisan AI:</span> {modelTranscript}</p>
        </footer>
      </div>
    </div>
  );
};