import React from 'react';
import { BrainCircuit, Leaf, LineChart, Sun, ShoppingCart, Users, Sprout, Home, BarChart3, FileText, User, Settings, Package, MessageSquare, ClipboardList, MapPin } from 'lucide-react';
import { FeatureKey, FEATURES } from '../types';

interface SidebarProps {
  activeFeature: FeatureKey;
  setActiveFeature: (feature: FeatureKey) => void;
}

const featureIcons: Record<FeatureKey, React.ElementType | null> = {
  HOME: Home,
  CHAT: MessageSquare,
  AI_CROP_ADVISOR: BrainCircuit,
  DISEASE_DIAGNOSIS: Leaf,
  YIELD_PREDICTION: LineChart,
  WEATHER_ALERTS: Sun,
  MARKET_PRICES: BarChart3,
  PRODUCTS_MARKETPLACE: ShoppingCart,
  GOVERNMENT_SCHEMES: FileText,
  PROFILE: User,
  UPLOAD_CENTER: null,
  MY_PRODUCTS: Package,
  BLOG_CORNER: null,
  LAND_LISTINGS: MapPin,
  MY_LAND_LISTINGS: null,
  SETTINGS: Settings,
  CHART_BOT: ClipboardList,
  ADD_LAND_LISTING: null,
  ADD_PRODUCT: null,
  CREATE_POST_PAGE: null,
  CREATE_BLOG: null,
  MY_ORDERS: null,
  REQUEST_QUOTE: null,
  MY_QUOTE_REQUESTS: null,
  QUOTE_REQUESTS: FileText,
};

const mainFeatures: FeatureKey[] = [
  'HOME',
  'CHAT',
  'AI_CROP_ADVISOR',
  'DISEASE_DIAGNOSIS',
  'PRODUCTS_MARKETPLACE',
  'MARKET_PRICES',
  'GOVERNMENT_SCHEMES',
  'LAND_LISTINGS',
  'CHART_BOT',
];

const userFeatures: FeatureKey[] = [
  'PROFILE',
  'MY_PRODUCTS',
  'QUOTE_REQUESTS',
  'SETTINGS',
];

export const Sidebar: React.FC<SidebarProps> = ({ activeFeature, setActiveFeature }) => {
  const renderButton = (key: FeatureKey) => {
    const feature = FEATURES[key];
    const Icon = featureIcons[key];
    if (!Icon) return null;
    const isActive = activeFeature === key;

    return (
      <button
        key={key}
        onClick={() => setActiveFeature(key)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
          isActive
            ? 'bg-brand-green text-white shadow-md shadow-green-600/30'
            : 'text-gray-700 hover:bg-green-50'
        }`}
      >
        <Icon className="w-5 h-5" />
        <span className="font-medium">{feature.title}</span>
      </button>
    );
  };
  
  return (
    <aside className="h-screen sticky top-0 bg-white border-r border-gray-200 flex flex-col shadow-lg">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-brand-green to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Sprout className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Kisan AI</h1>
            <p className="text-sm text-gray-500">Farming Companion</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {mainFeatures.map(renderButton)}
        <div className="pt-2">
            <hr className="my-2 border-gray-200" />
        </div>
        {userFeatures.map(renderButton)}
      </nav>
      <div className="p-4 border-t border-gray-200">
        <p className="text-xs text-center text-gray-500">
          Kisan AI © {new Date().getFullYear()}
        </p>
      </div>
    </aside>
  );
};