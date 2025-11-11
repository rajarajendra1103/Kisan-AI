import React from "react";
import {
  User,
  Upload,
  Settings,
  BookOpen,
  Package,
  MapPin,
  BadgeCheck,
  X,
  FileText
} from "lucide-react";
import { FeatureKey, MockUser } from "../types";

interface ProfileDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUser: MockUser | null;
  setActiveFeature?: (feature: FeatureKey) => void;
}

export const ProfileDrawer: React.FC<ProfileDrawerProps> = ({ open, onOpenChange, currentUser, setActiveFeature }) => {
  const drawerItems = [
    {
      icon: User,
      label: "View Profile",
      key: 'PROFILE' as FeatureKey,
      color: "text-blue-600 bg-blue-50"
    },
    {
      icon: Upload,
      label: "Upload Center",
      key: 'UPLOAD_CENTER' as FeatureKey,
      color: "text-green-600 bg-green-50"
    },
    {
      icon: Package,
      label: "My Products",
      key: 'MY_PRODUCTS' as FeatureKey,
      color: "text-purple-600 bg-purple-50"
    },
    {
      icon: BookOpen,
      label: "Blog Corner",
      key: 'BLOG_CORNER' as FeatureKey,
      color: "text-orange-600 bg-orange-50"
    },
    {
      icon: MapPin,
      label: "My Land Listings",
      key: 'MY_LAND_LISTINGS' as FeatureKey,
      color: "text-red-600 bg-red-50"
    },
    {
      icon: FileText,
      label: "My Quote Requests",
      key: 'MY_QUOTE_REQUESTS' as FeatureKey,
      color: "text-cyan-600 bg-cyan-50"
    },
    {
      icon: Settings,
      label: "Settings",
      key: 'SETTINGS' as FeatureKey,
      color: "text-gray-600 bg-gray-50"
    },
  ];
  
  const handleNavigation = (key: FeatureKey) => {
    if (setActiveFeature) {
      setActiveFeature(key);
    }
    onOpenChange(false);
  }

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => onOpenChange(false)}
      />
      {/* Drawer Content */}
      <div 
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
               <h2 className="font-bold text-lg">Profile</h2>
               <button onClick={() => onOpenChange(false)} className="p-2 rounded-full hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative w-16 h-16">
                <img src={currentUser?.profile_image} alt={currentUser?.full_name} className="w-16 h-16 rounded-full border-2 border-brand-green object-cover" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white flex items-center justify-center">
                  <div className="w-5 h-5 bg-brand-green rounded-full text-white flex items-center justify-center text-xs font-bold">
                    {currentUser?.initials}
                  </div>
                </div>
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-lg text-gray-900">
                    {currentUser?.full_name}
                  </h3>
                  {currentUser?.is_verified && (
                    <BadgeCheck className="w-5 h-5 text-blue-600" />
                  )}
                </div>
                <p className="text-sm text-gray-600 capitalize">
                  {currentUser?.user_type || "Farmer"}
                </p>
              </div>
            </div>
          </div>

          {/* Nav Items */}
          <div className="flex-1 py-4 space-y-1 overflow-y-auto">
            {drawerItems.map((item) => (
              <button
                key={item.key}
                onClick={() => handleNavigation(item.key)}
                className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-gray-50 transition-all duration-200 group text-left"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <span className="font-medium text-gray-900">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="border-t border-gray-200 p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                <p className="text-2xl font-bold text-brand-green">
                  {currentUser?.followers?.length || 0}
                </p>
                <p className="text-sm text-gray-600">Followers</p>
              </div>
              <div className="text-center bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                <p className="text-2xl font-bold text-brand-green">
                  {currentUser?.following?.length || 0}
                </p>
                <p className="text-sm text-gray-600">Following</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}