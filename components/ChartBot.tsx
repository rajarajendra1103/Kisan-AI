import React, { useState } from 'react';
import { Sprout, Beef, Search, Loader2 } from 'lucide-react';
// FIX: Import MockUser to use for type casting.
import { FeatureComponentProps, FEATURES, MockUser } from '../types';
import { generateContent } from '../services/geminiService';

const responseSchema = {
  type: 'OBJECT',
  properties: {
    name: { type: 'STRING' },
    info_table: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          category: { type: 'STRING' },
          details: { type: 'STRING' },
        },
      },
    },
    sustainable_practices: {
      type: 'ARRAY',
      items: { type: 'STRING' },
    },
    additional_tips: { type: 'STRING' },
  },
};

interface TableData {
  name: string;
  info_table: { category: string; details: string; }[];
  sustainable_practices: string[];
  additional_tips: string;
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

export const ChartBot: React.FC<FeatureComponentProps> = ({ currentUser }) => {
  const [activeMode, setActiveMode] = useState("crop");
  const [query, setQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState<TableData | null>(null);
  const [queryResponse, setQueryResponse] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [language, setLanguage] = useState(currentUser?.preferred_language || 'english');

  const popularCrops = ["🌾 Wheat", "🌾 Rice", "🌽 Corn", "🥔 Potato", "🍅 Tomato", "🥕 Carrot", "🥬 Cabbage", "🌶️ Chili"];
  const popularAnimals = ["🐄 Cow (Dairy)", "🐃 Buffalo", "🐐 Goat", "🐑 Sheep", "🐔 Poultry", "🐷 Pig", "🐟 Fish", "🐝 Bee"];

  const handleInfoRequest = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setTableData(null);
    setQueryResponse(null);
    setError('');

    try {
      const prompt = activeMode === "crop"
        ? `Provide detailed agricultural information about ${query} crop in ${language}. Generate a structured table with emoji labels covering: Seeds, Soil, Water, Season, Fertilizer, and Sustainable Practices. Make it practical for Indian farmers.`
        : `Provide comprehensive information about ${query} farming/rearing in ${language}. Generate a structured table with emoji labels covering: Animal Type & Breed, Housing, Feed, Water, Healthcare, Breeding, Special Care, and Economics. Make it practical for Indian farmers.`;

      const response = await generateContent(prompt, undefined, undefined, undefined, responseSchema);
      const result = JSON.parse(response.text);
      setTableData(result);
    } catch (err) {
      console.error("Error fetching info:", err);
      setError('Failed to fetch information. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuery = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setQueryResponse(null);
    setTableData(null);
    setError('');

    try {
      const prompt = `Answer this ${activeMode} farming query: "${searchQuery}" in detail. Provide a practical response in ${language} with emoji labels for Indian farmers.`;
      const response = await generateContent(prompt);
      setQueryResponse(response.text);
    } catch (err) {
      console.error("Error processing query:", err);
      setError('Failed to process your query. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const TabButton: React.FC<{label: string, value: string, icon: React.ElementType, active: boolean, onClick: () => void}> = ({ label, value, icon: Icon, active, onClick }) => (
    <button onClick={onClick} className={`flex-1 flex items-center justify-center gap-2 p-3 text-sm font-semibold transition-colors ${active ? 'text-brand-green border-b-2 border-brand-green bg-green-50' : 'text-gray-500 hover:bg-gray-100'}`}>
        <Icon className="w-5 h-5"/>
        {label}
    </button>
  );
  
  const Card: React.FC<{ children: React.ReactNode, title: string, className?: string }> = ({ children, title, className }) => (
    <div className={`bg-white rounded-xl shadow-md border border-gray-100 ${className}`}>
      <div className="p-4 border-b"><h3 className="font-bold text-gray-800">{title}</h3></div>
      <div className="p-4">{children}</div>
    </div>
  );

  return (
    <div className="p-4 md:p-6 bg-gray-50 rounded-2xl shadow-lg">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            {FEATURES.CHART_BOT.title}
          </h1>
          <p className="text-gray-600">{FEATURES.CHART_BOT.description}</p>
        </div>
        <div className="relative">
            <select
              value={language}
              // FIX: Cast the language value from the select onChange event to the correct type to resolve the TypeScript error.
              onChange={(e) => setLanguage(e.target.value as NonNullable<MockUser['preferred_language']>)}
              className="bg-white border border-gray-300 rounded-md text-sm py-2 pl-3 pr-8 appearance-none focus:ring-brand-green focus:border-brand-green"
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

      <div className="flex border-b bg-white rounded-t-lg">
          <TabButton label="🌾 Crop Info" value="crop" icon={Sprout} active={activeMode === 'crop'} onClick={() => setActiveMode('crop')} />
          <TabButton label="🐄 Cattle/Animal Info" value="cattle" icon={Beef} active={activeMode === 'cattle'} onClick={() => setActiveMode('cattle')} />
      </div>

      <div className="space-y-6 p-4 bg-white rounded-b-lg">
        {activeMode === 'crop' ? (
          <div className="space-y-4">
            <Card title="🌱 Popular Crops">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {popularCrops.map((crop) => (
                  <button key={crop} onClick={() => setQuery(crop.split(" ")[1])} className="p-2 border rounded-md hover:bg-gray-100 text-sm text-left">{crop}</button>
                ))}
              </div>
            </Card>
            <Card title="📋 Get Crop Information">
              <div className="flex gap-2">
                <input placeholder="Enter crop name (e.g., Wheat)..." value={query} onChange={(e) => setQuery(e.target.value)} onKeyPress={(e) => e.key === "Enter" && handleInfoRequest()} className="flex-1 w-full border rounded-md py-2 px-3 focus:ring-2 focus:ring-brand-green"/>
                <button onClick={handleInfoRequest} disabled={isLoading || !query.trim()} className="p-2 bg-brand-green text-white rounded-md disabled:bg-gray-300"><Search className="w-5 h-5" /></button>
              </div>
            </Card>
            <Card title="❓ Ask a Question">
              <div className="flex gap-2">
                <input placeholder="e.g., How to increase rice yield?" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyPress={(e) => e.key === "Enter" && handleQuery()} className="flex-1 w-full border rounded-md py-2 px-3 focus:ring-2 focus:ring-brand-green"/>
                <button onClick={handleQuery} disabled={isLoading || !searchQuery.trim()} className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-300">Ask</button>
              </div>
            </Card>
          </div>
        ) : (
          <div className="space-y-4">
            <Card title="🐄 Popular Animals">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {popularAnimals.map((animal) => (
                  <button key={animal} onClick={() => setQuery(animal.split(" ").slice(1).join(" "))} className="p-2 border rounded-md hover:bg-gray-100 text-sm text-left">{animal}</button>
                ))}
              </div>
            </Card>
            <Card title="📋 Get Animal/Cattle Information">
               <div className="flex gap-2">
                <input placeholder="Enter animal name (e.g., Dairy Cow)..." value={query} onChange={(e) => setQuery(e.target.value)} onKeyPress={(e) => e.key === "Enter" && handleInfoRequest()} className="flex-1 w-full border rounded-md py-2 px-3 focus:ring-2 focus:ring-brand-green"/>
                <button onClick={handleInfoRequest} disabled={isLoading || !query.trim()} className="p-2 bg-brand-green text-white rounded-md disabled:bg-gray-300"><Search className="w-5 h-5" /></button>
              </div>
            </Card>
             <Card title="❓ Ask a Question">
               <div className="flex gap-2">
                <input placeholder="e.g., Best feed for dairy cows?" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyPress={(e) => e.key === "Enter" && handleQuery()} className="flex-1 w-full border rounded-md py-2 px-3 focus:ring-2 focus:ring-brand-green"/>
                <button onClick={handleQuery} disabled={isLoading || !searchQuery.trim()} className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-300">Ask</button>
              </div>
            </Card>
          </div>
        )}
      </div>

      <div className="mt-6">
        {isLoading && <div className="flex items-center gap-3 p-4 bg-blue-50 border-blue-200 rounded-lg"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /><p className="font-semibold text-blue-900">🤖 Fetching information from AI...</p></div>}
        {error && <div className="p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>}
        
        {tableData && (
          <div className="bg-white rounded-xl shadow-lg border mt-4">
            <div className="p-4 bg-gray-50 rounded-t-xl"><h2 className="text-xl font-bold">📊 {tableData.name} - Detailed Information</h2></div>
            <div className="p-4 space-y-6">
              <div className="overflow-x-auto"><table className="w-full text-sm">
                <thead className="bg-gray-100"><tr className="text-left"><th className="p-2 font-semibold">Category</th><th className="p-2 font-semibold">Details</th></tr></thead>
                <tbody>{tableData.info_table?.map((row, index) => (<tr key={index} className="border-b"><td className="p-2 font-semibold text-green-700 align-top">{row.category}</td><td className="p-2 whitespace-pre-wrap">{row.details}</td></tr>))}</tbody>
              </table></div>
              {tableData.sustainable_practices?.length > 0 && <div className="bg-green-50 border border-green-200 rounded-lg p-4"><h4 className="font-bold text-green-900 mb-2">🌱 Sustainable Practices</h4><ul className="list-disc list-inside space-y-1">{tableData.sustainable_practices.map((p, i) => <li key={i}>{p}</li>)}</ul></div>}
              {tableData.additional_tips && <div className="bg-blue-50 border border-blue-200 rounded-lg p-4"><h4 className="font-bold text-blue-900 mb-2">💡 Additional Tips</h4><p className="whitespace-pre-wrap">{tableData.additional_tips}</p></div>}
            </div>
          </div>
        )}

        {queryResponse && (
           <div className="bg-white rounded-xl shadow-lg border mt-4">
            <div className="p-4 bg-gray-50 rounded-t-xl"><h2 className="text-xl font-bold">🤖 AI Response</h2></div>
            <div className="p-4 prose prose-sm max-w-none whitespace-pre-wrap">{queryResponse}</div>
          </div>
        )}
      </div>
    </div>
  );
};