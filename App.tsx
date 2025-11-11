import React, { useState } from 'react';
import { Menu, X, Sprout, Mic } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { FeatureKey, FeatureComponentProps, MockUser, FEATURES } from './types';
import { Home } from './components/Home';
import { AIAssistant } from './components/AIAssistant';
import { DiseaseDiagnosis } from './components/DiseaseDiagnosis';
import { YieldPrediction } from './components/YieldPrediction';
import { MarketPrices } from './components/MarketPrices';
import { WeatherAlerts } from './components/WeatherAlerts';
import { VoiceAssistant } from './components/VoiceAssistant';
import { Schemes } from './components/Schemes';
import { Chat } from './components/Chat';
import { Profile } from './components/Profile';
import { UploadCenter } from './components/UploadCenter';
import { MyProducts } from './components/MyProducts';
import { BlogCorner } from './components/BlogCorner';
import { Settings } from './components/Settings';
import { NotificationBell } from './components/NotificationBell';
import { ChartBot } from './components/ChartBot';
import { AddLand } from './components/AddLand';
import { LandForLease } from './components/LandForLease';
import { MyLandListings } from './components/MyLandListings';
import { AddProduct } from './components/AddProduct';
import { CreatePostPage } from './components/CreatePostPage';
import { CreateBlog } from './components/CreateBlog';
import { Products } from './components/Products';
import { MyOrders } from './components/MyOrders';
import { RequestQuote } from './components/RequestQuote';
import { MyQuoteRequests } from './components/MyQuoteRequests';
import { QuoteRequests } from './components/QuoteRequests';


const featureComponents: Record<FeatureKey, React.ComponentType<FeatureComponentProps>> = {
  HOME: Home,
  CHAT: Chat,
  AI_CROP_ADVISOR: AIAssistant,
  DISEASE_DIAGNOSIS: DiseaseDiagnosis,
  YIELD_PREDICTION: YieldPrediction,
  WEATHER_ALERTS: WeatherAlerts,
  MARKET_PRICES: MarketPrices,
  PRODUCTS_MARKETPLACE: Products,
  GOVERNMENT_SCHEMES: Schemes,
  PROFILE: Profile,
  UPLOAD_CENTER: UploadCenter,
  MY_PRODUCTS: MyProducts,
  BLOG_CORNER: BlogCorner,
  LAND_LISTINGS: LandForLease,
  MY_LAND_LISTINGS: MyLandListings,
  SETTINGS: Settings,
  CHART_BOT: ChartBot,
  ADD_LAND_LISTING: AddLand,
  ADD_PRODUCT: AddProduct,
  CREATE_POST_PAGE: CreatePostPage,
  CREATE_BLOG: CreateBlog,
  MY_ORDERS: MyOrders,
  REQUEST_QUOTE: RequestQuote,
  MY_QUOTE_REQUESTS: MyQuoteRequests,
  QUOTE_REQUESTS: QuoteRequests,
};

const mockCurrentUser: MockUser = {
  id: 'user_123',
  full_name: 'Sanjay Kumar',
  initials: 'SK',
  profile_image: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=2069&auto=format&fit=crop',
  is_verified: true,
  followers: Array(42),
  following: Array(18),
  location: 'Ludhiana',
  state: 'Punjab',
  crops_grown: ['Wheat', 'Rice'],
  user_type: 'farmer',
  phone_number: '+91 9876543210',
  farm_size_acres: 25,
  preferred_language: 'punjabi',
  tracked_crops: ['Wheat'],
};

const App: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState<FeatureKey>('HOME');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<MockUser | null>(mockCurrentUser);

  const ActiveComponent = featureComponents[activeFeature];
  const featureInfo = FEATURES[activeFeature];

  return (
    <div className="min-h-screen bg-brand-beige text-gray-800 font-sans">
      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block lg:w-64 xl:w-72">
          <Sidebar activeFeature={activeFeature} setActiveFeature={setActiveFeature} />
        </div>

        {/* Mobile Sidebar (Sheet) */}
        {isSidebarOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)}>
            <div className="fixed left-0 top-0 h-full w-72 bg-white shadow-xl z-50" onClick={(e) => e.stopPropagation()}>
              <Sidebar activeFeature={activeFeature} setActiveFeature={(feature) => {
                setActiveFeature(feature);
                setIsSidebarOpen(false);
              }} />
            </div>
          </div>
        )}

        <main className="flex-1 min-w-0">
          {/* Main Header (Desktop) */}
          <header className="hidden lg:flex sticky top-0 bg-white/80 backdrop-blur-sm border-b border-gray-200 z-30 items-center justify-between p-4 px-8">
            <h1 className="text-2xl font-bold text-gray-900">{featureInfo.title}</h1>
            <div className="flex items-center gap-2">
              <NotificationBell currentUser={currentUser} setActiveFeature={setActiveFeature} />
            </div>
          </header>

          {/* Mobile Header */}
          <header className="lg:hidden sticky top-0 bg-white/80 backdrop-blur-sm border-b border-gray-200 z-30 flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <Sprout className="w-8 h-8 text-brand-green" />
              <h1 className="text-xl font-bold text-gray-900">Kisan AI</h1>
            </div>
            <div className="flex items-center gap-2">
              <NotificationBell currentUser={currentUser} setActiveFeature={setActiveFeature} />
              <button onClick={() => setIsSidebarOpen(true)} className="p-2">
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </header>

          <div className="p-0 lg:p-8 lg:pt-4">
            <ActiveComponent 
              setActiveFeature={setActiveFeature} 
              currentUser={currentUser} 
              setCurrentUser={setCurrentUser} 
            />
          </div>
        </main>
      </div>

      {/* Voice Assistant FAB */}
      <button
        onClick={() => setIsVoiceAssistantOpen(true)}
        className="fixed bottom-20 right-5 lg:bottom-8 lg:right-8 bg-brand-green hover:bg-emerald-700 text-white rounded-full p-4 shadow-lg transform transition-transform hover:scale-110 z-30"
        aria-label="Open Voice Assistant"
      >
        <Mic className="w-6 h-6" />
      </button>

      {isVoiceAssistantOpen && <VoiceAssistant onClose={() => setIsVoiceAssistantOpen(false)} />}
      
      {/* Mobile Bottom Navigation */}
      <BottomNav activeFeature={activeFeature} setActiveFeature={setActiveFeature} />
    </div>
  );
};

export default App;