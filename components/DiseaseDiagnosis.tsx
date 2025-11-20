import React, { useState, useCallback, useRef } from 'react';
import { Leaf, UploadCloud, Loader2, Bot, Globe } from 'lucide-react';
import { generateContent } from '../services/geminiService';
import { fileToBase64 } from '../utils/fileUtils';
import { FeatureComponentProps, FEATURES, MockUser } from '../types';

interface GroundingReference {
  uri: string;
  title: string;
}

const languages = [
  { value: 'english', label: '🇬🇧 English' },
  { value: 'hindi', label: '🇮🇳 हिन्दी' },
  { value: 'punjabi', label: '🇮🇳 ਪੰਜਾਬੀ' },
  { value: 'tamil', label: '🇮🇳 தமிழ்' },
  { value: 'telugu', label: '🇮🇳 తెలుగు' },
  { value: 'kannada', label: '🇮🇳 ಕನ್ನಡ' },
  { value: 'marathi', label: '🇮🇳 मराठी' },
];

export const DiseaseDiagnosis: React.FC<FeatureComponentProps> = ({ currentUser }) => {
  const [image, setImage] = useState<string | null>(null);
  const [diagnosisReport, setDiagnosisReport] = useState<string>('');
  const [visualReferences, setVisualReferences] = useState<GroundingReference[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [language, setLanguage] = useState(currentUser?.preferred_language || 'english');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = useCallback(async (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file.');
      return;
    }
    setError('');
    setIsLoading(true);
    setDiagnosisReport('');
    setVisualReferences([]);

    try {
      const { base64, type } = await fileToBase64(file);
      setImage(`data:${type};base64,${base64}`);

      const prompt = `Analyze this image of a plant leaf. Identify any diseases and provide a detailed report for a farmer in ${language}. The report should include the disease name, symptoms, and treatment suggestions using simple language and emojis (e.g., ախ Disease,  sintomi Symptoms, 💊 Treatment). It MUST NOT contain markdown formatting like asterisks (**).`;
      
      const systemInstruction = "You are an expert plant pathologist. Your response should be a clear, easy-to-understand report for a farmer.";
      
      const configOverrides = {
        tools: [{googleSearch: {}}]
      };

      const response = await generateContent(prompt, base64, type, systemInstruction, undefined, configOverrides);

      const report = response.text.replace(/\*\*/g, '');
      setDiagnosisReport(report);

      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const references: GroundingReference[] = groundingChunks
        .filter((chunk: any) => chunk.web && chunk.web.uri)
        .map((chunk: any) => ({
          uri: chunk.web.uri,
          title: chunk.web.title || new URL(chunk.web.uri).hostname,
        }));
      setVisualReferences(references);

    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to analyze image: ${message}`);
    } finally {
      setIsLoading(false);
    }
  }, [language]);

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleImageUpload(files[0]);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleImageUpload(files[0]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const featureInfo = FEATURES.DISEASE_DIAGNOSIS;

  return (
    <div className="p-4 md:p-6 bg-white rounded-2xl shadow-lg">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-brand-green to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
            <Leaf className="w-7 h-7 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{featureInfo.title}</h2>
          <p className="text-gray-500">{featureInfo.description}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Uploader */}
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center flex flex-col justify-center items-center cursor-pointer hover:border-brand-green transition-colors"
          onDragOver={onDragOver}
          onDrop={onDrop}
          onClick={triggerFileSelect}
        >
          <input type="file" accept="image/*" ref={fileInputRef} onChange={onFileChange} className="hidden" />
          {image ? (
            <img src={image} alt="Uploaded plant" className="max-h-64 w-auto rounded-lg object-contain" />
          ) : (
            <>
              <UploadCloud className="w-12 h-12 text-gray-400 mb-2" />
              <p className="font-semibold text-gray-700">Click to upload or drag & drop</p>
              <p className="text-sm text-gray-500">PNG, JPG, or WEBP</p>
            </>
          )}
        </div>

        {/* Analysis */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
              <Bot className="w-6 h-6 text-brand-green"/>
              AI Diagnosis
            </h3>
            <div className="relative">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as NonNullable<MockUser['preferred_language']>)}
                className="bg-white border border-gray-300 rounded-md text-sm py-1.5 pl-3 pr-8 appearance-none focus:ring-brand-green focus:border-brand-green"
              >
                {languages.map(lang => (
                  <option key={lang.value} value={lang.value}>{lang.label}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <Loader2 className="w-8 h-8 text-brand-green animate-spin" />
              <p className="mt-2 text-gray-600">Analyzing image...</p>
            </div>
          ) : error ? (
            <div className="text-red-600 bg-red-50 p-3 rounded-lg">{error}</div>
          ) : diagnosisReport ? (
            <div className="space-y-4">
              <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">{diagnosisReport}</div>
              {visualReferences.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2 mt-4 border-t pt-4 flex items-center gap-2">
                    <Globe className="w-4 h-4" /> Visual References from the Web
                  </h4>
                  <div className="space-y-2">
                    {visualReferences.map((ref, index) => (
                      <a 
                        href={ref.uri} 
                        key={index} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="group block p-3 bg-gray-100 hover:bg-green-50 rounded-lg text-sm border border-gray-200 hover:border-green-300 transition-all"
                      >
                        <p className="font-semibold text-brand-green truncate group-hover:underline">{ref.title}</p>
                        <p className="text-gray-500 truncate text-xs">{ref.uri}</p>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500">Upload an image of a plant leaf to get an AI-powered disease diagnosis and treatment plan.</p>
          )}
        </div>
      </div>
    </div>
  );
};