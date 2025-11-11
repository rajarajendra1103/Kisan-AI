import React, { useState } from 'react';
import { BarChart3, Bot, Loader2 } from 'lucide-react';
import { generateContent } from '../services/geminiService';
import { FEATURES } from '../types';

const crops = ['Wheat', 'Rice', 'Cotton', 'Sugarcane', 'Soybean'];
const regions = ['Punjab', 'Haryana', 'Uttar Pradesh', 'Maharashtra', 'Madhya Pradesh'];

export const MarketInsights: React.FC = () => {
  // FIX: Property 'MARKET_INSIGHTS' does not exist on type 'Record<FeatureKey, Feature>'. Corrected to 'MARKET_PRICES'.
  const featureInfo = FEATURES.MARKET_PRICES;
  const [crop, setCrop] = useState('');
  const [region, setRegion] = useState('');
  const [insights, setInsights] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!crop || !region) {
      setError('Please select both a crop and a region.');
      return;
    }
    setError('');
    setIsLoading(true);
    setInsights('');

    try {
      const prompt = `Provide a detailed market analysis report for ${crop} in the ${region} region of India. Include the following sections:
      1.  **Current Price Trends:** Analyze the current market price and recent fluctuations.
      2.  **Demand & Supply Analysis:** Assess the current demand and supply dynamics.
      3.  **3-Month Forecast:** Provide a sales and price forecast for the next three months.
      4.  **Key Market Drivers:** Identify the main factors influencing the market.
      5.  **Potential Risks:** Highlight potential risks for farmers.
      6.  **Recommendations:** Offer actionable advice for farmers based on this analysis.`;
      
      const systemInstruction = "You are a senior market analyst specializing in Indian agricultural commodities. Your reports are data-driven, insightful, and easy for farmers to understand.";

      const result = await generateContent(prompt, undefined, undefined, systemInstruction);
      // FIX: The `generateContent` function returns a `GenerateContentResponse` object. The text content is accessed via the `.text` property.
      setInsights(result.text);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to generate insights: ${message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 bg-white rounded-2xl shadow-lg">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-brand-green to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
          <BarChart3 className="w-7 h-7 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{featureInfo.title}</h2>
          <p className="text-gray-500">{featureInfo.description}</p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-6 border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-green focus:border-brand-green"
          >
            <option value="">Select Crop</option>
            {crops.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-green focus:border-brand-green"
          >
            <option value="">Select Region</option>
            {regions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full bg-brand-green text-white font-semibold py-2 px-4 rounded-md hover:bg-emerald-700 disabled:bg-gray-400 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Report'
            )}
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
      
      <div>
        <h3 className="font-bold text-lg mb-4 text-gray-800 flex items-center gap-2">
          <Bot className="w-6 h-6 text-brand-green"/>
          AI Market Report
        </h3>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-48">
            <Loader2 className="w-8 h-8 text-brand-green animate-spin" />
            <p className="mt-2 text-gray-600">Fetching latest market data...</p>
          </div>
        ) : insights ? (
          <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap bg-gray-50 rounded-lg p-4 border">{insights}</div>
        ) : (
          <p className="text-gray-500 text-center py-10 border-2 border-dashed rounded-lg">Select a crop and region to generate your personalized market insights report.</p>
        )}
      </div>
    </div>
  );
};