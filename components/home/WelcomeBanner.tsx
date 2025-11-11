import React from 'react';
import { Sun, Cloud, Edit, Sprout } from 'lucide-react';
import { MockUser } from '../../types';

interface WelcomeBannerProps {
  user: MockUser | null;
  onEditProfile: () => void;
  onOpenProfileDrawer: () => void;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ user, onEditProfile, onOpenProfileDrawer }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const Avatar: React.FC<{ user: MockUser | null }> = ({ user }) => (
    <div 
      className="w-16 h-16 rounded-full border-2 border-white/50 shadow-lg cursor-pointer transition-transform hover:scale-110"
      onClick={onOpenProfileDrawer}
    >
      {user?.profile_image ? (
        <img src={user.profile_image} alt={user.full_name} className="w-full h-full rounded-full object-cover" />
      ) : (
        <div className="w-full h-full rounded-full bg-brand-green flex items-center justify-center text-white text-2xl font-bold">
          {user?.initials}
        </div>
      )}
    </div>
  );

  return (
    <div className="relative bg-gradient-to-br from-brand-green via-green-600 to-emerald-600 text-white overflow-hidden transition-all duration-300 hover:shadow-2xl">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-white rounded-full blur-3xl transition-all duration-500 hover:scale-110" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white rounded-full blur-3xl transition-all duration-500 hover:scale-110" />
      </div>
      
      <div className="relative p-6 md:p-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Avatar user={user} />
            <div className="transition-transform duration-300 hover:translate-x-1">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl md:text-3xl font-bold mb-1">
                  {getGreeting()}, {user?.full_name?.split(" ")[0] || "Farmer"}!
                </h2>
                <button onClick={onEditProfile} className="text-white/70 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10">
                  <Edit size={16} />
                </button>
              </div>
              <p className="text-green-100">
                {user?.location && user?.state ? `📍 ${user.location}, ${user.state}` : user?.location ? `📍 ${user.location}` : "Welcome to Kisan AI"}
              </p>
            </div>
          </div>
          <Sprout className="w-12 h-12 text-white/80 transition-all duration-300 hover:rotate-12 hover:scale-110 hover:text-white" />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 transition-all duration-300 hover:bg-white/20 hover:scale-105 hover:shadow-lg cursor-pointer">
            <Sun className="w-6 h-6 mb-2 text-yellow-300 transition-transform duration-300 hover:rotate-90" />
            <p className="text-sm text-green-100">Today's Weather</p>
            <p className="text-xl font-bold">28°C ☀️</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 transition-all duration-300 hover:bg-white/20 hover:scale-105 hover:shadow-lg cursor-pointer">
            <Cloud className="w-6 h-6 mb-2 text-blue-300 transition-transform duration-300 hover:scale-110" />
            <p className="text-sm text-green-100">Forecast</p>
            <p className="text-xl font-bold">Clear Sky</p>
          </div>
        </div>
      </div>
    </div>
  );
};