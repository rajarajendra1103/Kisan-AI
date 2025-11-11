import React, { useState, useEffect, useMemo } from 'react';
import { BarChart3, Bot, Loader2, TrendingUp, TrendingDown, Minus, Search, Bell, BellOff } from 'lucide-react';
import { generateContent } from '../services/geminiService';
import { FeatureComponentProps, FEATURES, MarketPrice } from '../types';

const mockMarketPrices: MarketPrice[] = [
    { id: 'price_1', crop_name: 'Wheat', market_location: 'Khanna Mandi', state: 'Punjab', price_per_quintal: 2250, trend: 'up', date: new Date(Date.now() - 86400000).toISOString() },
    { id: 'price_2', crop_name: 'Rice', market_location: 'Karnal Mandi', state: 'Haryana', price_per_quintal: 3500, trend: 'stable', date: new Date().toISOString() },
    { id: 'price_3', crop_name: 'Cotton', market_location: 'Adilabad Mandi', state: 'Telangana', price_per_quintal: 7100, trend: 'down', date: new Date().toISOString() },
    { id: 'price_4', crop_name: 'Soybean', market_location: 'Indore Mandi', state: 'Madhya Pradesh', price_per_quintal: 4500, trend: 'up', date: new Date().toISOString() },
];

const cropsForInsights = ['Wheat', 'Rice', 'Cotton', 'Sugarcane', 'Soybean'];
const regionsForInsights = ['Punjab', 'Haryana', 'Uttar Pradesh', 'Maharashtra', 'Madhya Pradesh'];

const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => <div className={`bg-white rounded-lg shadow-sm border ${className}`}>{children}</div>;
const CardContent: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => <div className={`p-6 ${className}`}>{children}</div>;
const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string, size?: string }> = (props) => {
    const { variant, size, ...rest } = props;
    const baseClasses = "font-semibold rounded-md transition-colors flex items-center justify-center gap-1";
    const sizeClasses = size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-4 py-2';
    let variantClasses = "bg-brand-green text-white hover:bg-emerald-700";
    if (variant === 'outline') variantClasses = "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50";
    return <button {...rest} className={`${baseClasses} ${sizeClasses} ${variantClasses} ${props.className}`}>{props.children}</button>;
};

export const MarketPrices: React.FC<FeatureComponentProps> = ({ currentUser, setCurrentUser }) => {
  const featureInfo = FEATURES.MARKET_PRICES;
  const [activeTab, setActiveTab] = useState<'prices' | 'insights'>('prices');
  
  // State for Live Prices Tab
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingPrices, setIsLoadingPrices] = useState(true);
  const [trackedCrops, setTrackedCrops] = useState<string[]>([]);
  
  // State for AI Insights Tab
  const [crop, setCrop] = useState('');
  const [region, setRegion] = useState('');
  const [insights, setInsights] = useState('');
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [errorInsights, setErrorInsights] = useState('');

  useEffect(() => {
    setIsLoadingPrices(true);
    if (currentUser) {
      setTrackedCrops(currentUser.tracked_crops || []);
    }
    // Simulate API call for prices
    setTimeout(() => {
      setPrices(mockMarketPrices);
      setIsLoadingPrices(false);
    }, 500);
  }, [currentUser]);

  const toggleTracking = async (cropName: string) => {
    if (!currentUser || !setCurrentUser) return;
    const newTrackedCrops = trackedCrops.includes(cropName)
      ? trackedCrops.filter(c => c !== cropName)
      : [...trackedCrops, cropName];
    
    setTrackedCrops(newTrackedCrops);
    // This would be a real API call in a full app
    setCurrentUser({ ...currentUser, tracked_crops: newTrackedCrops }); 
  };

  const filteredPrices = useMemo(() => prices.filter(
    (price) =>
      price.crop_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      price.market_location?.toLowerCase().includes(searchQuery.toLowerCase())
  ), [prices, searchQuery]);

  const handleGenerateInsights = async () => {
    if (!crop || !region) {
      setErrorInsights('Please select both a crop and a region.');
      return;
    }
    setErrorInsights('');
    setIsLoadingInsights(true);
    setInsights('');

    try {
      const prompt = `Provide a detailed market analysis report for ${crop} in the ${region} region of India. Include sections on: Current Price Trends, Demand & Supply, 3-Month Forecast, Key Market Drivers, Potential Risks, and Recommendations. Do not use any markdown formatting like asterisks.`;
      const systemInstruction = "You are a senior market analyst specializing in Indian agricultural commodities. You must respond in plain text without markdown formatting.";
      const response = await generateContent(prompt, undefined, undefined, systemInstruction);
      let result = response.text.replace(/\*\*/g, ""); // A failsafe to remove bold markdown
      setInsights(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred.';
      setErrorInsights(`Failed to generate insights: ${message}`);
    } finally {
      setIsLoadingInsights(false);
    }
  };

  const getTrendIcon = (trend: MarketPrice['trend']) => ({ up: <TrendingUp className="w-4 h-4 text-green-600" />, down: <TrendingDown className="w-4 h-4 text-red-600" />, stable: <Minus className="w-4 h-4 text-gray-600" /> }[trend]);
  const getTrendColor = (trend: MarketPrice['trend']) => ({ up: "text-green-600 bg-green-100", down: "text-red-600 bg-red-100", stable: "text-gray-600 bg-gray-100" }[trend]);
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });

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

      <div className="mb-6 flex justify-center">
          <div className="flex items-center bg-gray-100 rounded-full p-1">
              <button onClick={() => setActiveTab('prices')} className={`px-4 py-1.5 text-sm font-semibold rounded-full ${activeTab === 'prices' ? 'bg-white text-brand-green shadow' : 'text-gray-600'}`}>Live Prices</button>
              <button onClick={() => setActiveTab('insights')} className={`px-4 py-1.5 text-sm font-semibold rounded-full ${activeTab === 'insights' ? 'bg-white text-brand-green shadow' : 'text-gray-600'}`}>AI Insights</button>
          </div>
      </div>
      
      {activeTab === 'prices' && (
        <div>
          <div className="mb-6 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input placeholder="Search by crop or market..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:ring-brand-green focus:border-brand-green"/>
          </div>
          {isLoadingPrices ? <div className="text-center p-10"><Loader2 className="w-8 h-8 mx-auto animate-spin text-brand-green"/></div> :
          <div className="space-y-4">
            {filteredPrices.map((price) => (
              <Card key={price.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{price.crop_name}</h3>
                      <p className="text-sm text-gray-500">📍 {price.market_location}, {price.state}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getTrendColor(price.trend)}`}>{getTrendIcon(price.trend)}{price.trend}</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-2xl font-bold text-brand-green">₹{price.price_per_quintal}</p>
                      <p className="text-xs text-gray-500">per quintal</p>
                    </div>
                    <div className="flex items-center gap-2">
                       <p className="text-xs text-gray-500">{formatDate(price.date)}</p>
                       <Button size="sm" variant={trackedCrops.includes(price.crop_name) ? undefined : "outline"} onClick={() => toggleTracking(price.crop_name)} className={trackedCrops.includes(price.crop_name) ? "bg-brand-green" : ""}>
                          {trackedCrops.includes(price.crop_name) ? <><Bell className="w-3 h-3"/> Tracking</> : <><BellOff className="w-3 h-3"/> Track</>}
                       </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          }
        </div>
      )}
      
      {activeTab === 'insights' && (
        <div>
          <div className="bg-gray-50 rounded-lg p-4 mb-6 border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select value={crop} onChange={(e) => setCrop(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-green focus:border-brand-green">
                <option value="">Select Crop</option>
                {cropsForInsights.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={region} onChange={(e) => setRegion(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-green focus:border-brand-green">
                <option value="">Select Region</option>
                {regionsForInsights.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <button onClick={handleGenerateInsights} disabled={isLoadingInsights} className="w-full bg-brand-green text-white font-semibold py-2 px-4 rounded-md hover:bg-emerald-700 disabled:bg-gray-400 flex items-center justify-center">
                {isLoadingInsights ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Generating...</> : 'Generate Report'}
              </button>
            </div>
            {errorInsights && <p className="text-red-500 text-sm mt-2">{errorInsights}</p>}
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4 text-gray-800 flex items-center gap-2"><Bot className="w-6 h-6 text-brand-green"/>AI Market Report</h3>
            {isLoadingInsights ? <div className="text-center p-10"><Loader2 className="w-8 h-8 mx-auto animate-spin text-brand-green"/></div>
             : insights ? <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap bg-gray-50 rounded-lg p-4 border">{insights}</div>
             : <p className="text-gray-500 text-center py-10 border-2 border-dashed rounded-lg">Select a crop and region to generate your personalized market insights report.</p>}
          </div>
        </div>
      )}
    </div>
  );
};