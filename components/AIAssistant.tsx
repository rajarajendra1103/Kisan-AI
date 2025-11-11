import React, { useState, useEffect, useRef } from "react";
import { Send, Bot, Loader2, Mic, User, LineChart, BrainCircuit, Activity, BarChart, CheckCircle } from "lucide-react";
import { generateContent } from '../services/geminiService';
import { ChatMessage, MockUser, FeatureComponentProps, YieldPredictionResult } from '../types';

const ChatAssistant: React.FC<{ currentUser: MockUser | null }> = ({ currentUser }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', text: inputMessage };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage("");
    setIsLoading(true);

    try {
      const systemInstruction = `You are an expert agricultural advisor helping farmers.
User's location: ${currentUser?.location || "India"}, ${currentUser?.state || ""}
User's crops: ${currentUser?.crops_grown?.join(", ") || "various crops"}
Provide helpful, practical advice in a friendly tone.`;

      const response = await generateContent(currentInput, undefined, undefined, systemInstruction);
      const botMessage: ChatMessage = { role: 'model', text: response.text };
      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      const errorBotMessage: ChatMessage = { role: 'model', text: `Sorry, I encountered an error: ${errorMessage}` };
      setMessages(prev => [...prev, errorBotMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && !isLoading && (
          <div className="text-center py-12 px-4">
            <Bot className="w-16 h-16 mx-auto text-brand-green mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Welcome to your AI Farm Assistant!
            </h2>
            <p className="text-gray-600">
              Ask me anything about farming, crops, weather, diseases, or best practices.
            </p>
          </div>
        )}

        {messages.map((msg, index) => (
          <div key={index} className={`flex gap-3 items-end ${msg.role === 'user' ? "justify-end" : "justify-start"}`}>
            {msg.role === 'model' && (
              <div className="w-10 h-10 rounded-full bg-brand-green flex items-center justify-center text-white flex-shrink-0">
                <Bot size={22} />
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${ msg.role === 'user' ? "bg-gradient-to-br from-brand-green to-emerald-600 text-white shadow-lg rounded-br-none" : "bg-gray-100 text-gray-800 shadow-sm border border-gray-200 rounded-bl-none" }`}>
              <p className="whitespace-pre-wrap text-sm">{msg.text}</p>
            </div>
            {msg.role === 'user' && (
               <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 flex-shrink-0">
                <User size={22} />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3">
             <div className="w-10 h-10 rounded-full bg-brand-green flex items-center justify-center text-white flex-shrink-0">
                <Bot size={22} />
              </div>
            <div className="bg-gray-100 rounded-2xl px-4 py-3 shadow-sm border border-gray-200 rounded-bl-none">
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-brand-green rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-2 h-2 bg-brand-green rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-2 h-2 bg-brand-green rounded-full animate-bounce"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4 bg-white rounded-b-2xl">
        <div className="flex gap-2 items-center">
          <button className="p-3 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
            <Mic className="w-5 h-5" />
          </button>
          <input
            placeholder="Type your farming question..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            disabled={isLoading}
            className="flex-1 w-full border rounded-full py-3 px-4 focus:ring-2 focus:ring-brand-green focus:outline-none resize-none"
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className="p-3 bg-brand-green text-white rounded-full disabled:bg-gray-300 hover:bg-emerald-700 transition-all"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </>
  );
};

const YieldPredictor: React.FC<{ currentUser: MockUser | null }> = ({ currentUser }) => {
  const [formData, setFormData] = useState({
    crop: '',
    farmSize: currentUser?.farm_size_acres?.toString() || '',
    soilType: 'loam',
    region: currentUser?.state || '',
    sowingDate: '',
  });
  const [prediction, setPrediction] = useState<YieldPredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePredict = async () => {
    if (!formData.crop || !formData.farmSize || !formData.region || !formData.sowingDate) {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');
    setIsLoading(true);
    setPrediction(null);

    try {
      const prompt = `
        As an expert agronomist, predict the yield for the following farm scenario in India.
        
        Farm Data:
        - Crop: ${formData.crop}
        - Farm Size: ${formData.farmSize} acres
        - Soil Type: ${formData.soilType}
        - Region: ${formData.region}, India
        - Sowing Date: ${formData.sowingDate}

        Based on this data and typical conditions for this region (weather, irrigation, etc.), provide a yield prediction.
        The response should be a JSON object.
      `;

      const responseSchema = {
        type: "OBJECT",
        properties: {
          predicted_yield: { type: "STRING", description: "The predicted yield range, e.g., '4.5 - 5.2'" },
          yield_unit: { type: "STRING", description: "The unit of the yield, e.g., 'Tonnes / Acre'" },
          key_factors: { 
            type: "ARRAY", 
            items: { type: "STRING" },
            description: "A list of key factors influencing this prediction."
          },
          recommendations: {
            type: "ARRAY",
            items: { type: "STRING" },
            description: "A list of actionable recommendations to improve or secure the yield."
          },
        }
      };

      const response = await generateContent(prompt, undefined, undefined, undefined, responseSchema);
      const result = JSON.parse(response.text);
      setPrediction(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unknown error occurred";
      setError(`Prediction failed: ${message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="bg-gray-50 border rounded-lg p-4">
          <h3 className="font-bold text-lg mb-4">Enter Farm Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Crop *</label>
              <input type="text" name="crop" value={formData.crop} onChange={handleInputChange} placeholder="e.g., Wheat" className="w-full p-2 border rounded-md"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Farm Size (Acres) *</label>
              <input type="number" name="farmSize" value={formData.farmSize} onChange={handleInputChange} placeholder="e.g., 25" className="w-full p-2 border rounded-md"/>
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Soil Type *</label>
              <select name="soilType" value={formData.soilType} onChange={handleInputChange} className="w-full p-2 border rounded-md bg-white">
                <option value="loam">Loam</option>
                <option value="sandy">Sandy</option>
                <option value="clay">Clay</option>
                <option value="silt">Silt</option>
                <option value="red">Red</option>
                <option value="black">Black</option>
                <option value="alluvial">Alluvial</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State/Region *</label>
              <input type="text" name="region" value={formData.region} onChange={handleInputChange} placeholder="e.g., Punjab" className="w-full p-2 border rounded-md"/>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Sowing Date *</label>
              <input type="date" name="sowingDate" value={formData.sowingDate} onChange={handleInputChange} className="w-full p-2 border rounded-md"/>
            </div>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
        
        {isLoading && (
          <div className="text-center p-6">
            <Loader2 className="w-8 h-8 mx-auto text-brand-green animate-spin" />
            <p className="mt-2 text-gray-600">Calculating yield forecast...</p>
          </div>
        )}

        {prediction && (
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 space-y-4 animate-fade-in">
            <div className="text-center">
              <p className="text-sm text-green-700">Predicted Yield</p>
              <p className="text-4xl font-bold text-green-900">{prediction.predicted_yield}</p>
              <p className="text-lg text-green-800">{prediction.yield_unit}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2"><Activity size={18}/> Key Factors Influencing Yield</h4>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                {prediction.key_factors.map((factor, i) => <li key={i}>{factor}</li>)}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2"><CheckCircle size={18}/> Recommendations to Improve Yield</h4>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                {prediction.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
              </ul>
            </div>
          </div>
        )}
      </div>
      <div className="border-t p-4">
        <button
          onClick={handlePredict}
          disabled={isLoading}
          className="w-full bg-brand-green text-white font-semibold py-3 px-4 rounded-lg hover:bg-emerald-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <BarChart className="w-5 h-5" />}
          {isLoading ? 'Predicting...' : 'Predict Yield'}
        </button>
      </div>
    </>
  );
};


export const AIAssistant: React.FC<FeatureComponentProps> = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState<'assistant' | 'yield'>('assistant');

  return (
    <div className="flex flex-col h-[calc(100vh-130px)] lg:h-[calc(100vh-4rem)] bg-white rounded-2xl shadow-lg">
      {/* Header */}
      <div className="bg-white rounded-t-2xl border-b border-gray-200 p-4 shadow-sm">
        <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 bg-gradient-to-br from-brand-green to-emerald-600 rounded-full flex items-center justify-center shadow-lg`}>
                {activeTab === 'assistant' ? <Bot className="w-7 h-7 text-white" /> : <LineChart className="w-7 h-7 text-white" />}
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {activeTab === 'assistant' ? 'AI Farm Assistant' : 'AI Yield Predictor'}
                </h1>
                <p className="text-sm text-gray-500">
                  {activeTab === 'assistant' ? 'Your personal farming advisor' : 'Forecast your crop yield'}
                </p>
              </div>
            </div>
            <div className="flex items-center bg-gray-100 rounded-full p-1">
                <button
                    onClick={() => setActiveTab('assistant')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-full flex items-center gap-1 ${activeTab === 'assistant' ? 'bg-white text-brand-green shadow' : 'text-gray-600'}`}
                >
                   <BrainCircuit size={14}/> Assistant
                </button>
                 <button
                    onClick={() => setActiveTab('yield')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-full flex items-center gap-1 ${activeTab === 'yield' ? 'bg-white text-brand-green shadow' : 'text-gray-600'}`}
                >
                    <LineChart size={14}/> Predictor
                </button>
            </div>
        </div>
      </div>
      
      {activeTab === 'assistant' ? (
        <ChatAssistant currentUser={currentUser} />
      ) : (
        <YieldPredictor currentUser={currentUser} />
      )}
    </div>
  );
}