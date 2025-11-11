import React from 'react';
import { Home, BrainCircuit, ShoppingCart, MessageSquare } from 'lucide-react';
import { FeatureKey } from '../types';

interface BottomNavProps {
  activeFeature: FeatureKey;
  setActiveFeature: (feature: FeatureKey) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeFeature, setActiveFeature }) => {
  const navItems: { key: FeatureKey; label: string; icon: React.ElementType }[] = [
    { key: 'HOME', label: 'Home', icon: Home },
    { key: 'AI_CROP_ADVISOR', label: 'Advisor', icon: BrainCircuit },
    { key: 'PRODUCTS_MARKETPLACE', label: 'Market', icon: ShoppingCart },
    { key: 'CHAT', label: 'Chat', icon: MessageSquare },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-1px_3px_rgba(0,0,0,0.05)] z-40">
      <div className="flex justify-around">
        {navItems.map(({ key, label, icon: Icon }) => {
          const isActive = activeFeature === key;
          return (
            <button
              key={key}
              onClick={() => setActiveFeature(key)}
              className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${
                isActive ? 'text-brand-green' : 'text-gray-500 hover:text-brand-green'
              }`}
            >
              <Icon className="w-6 h-6 mb-0.5" />
              <span className={`text-xs font-medium ${isActive ? 'font-bold' : ''}`}>{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};