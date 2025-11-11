import React from "react";
import { FeatureComponentProps, FeatureKey } from '../types';
import {
  Upload,
  Package,
  MapPin,
  Video,
  FileText,
  BookOpen,
  Plus,
  Sprout
} from "lucide-react";

// Local UI components to match project style
const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => <div className={`bg-white rounded-lg shadow-md border ${className}`}>{children}</div>;
const CardHeader: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => <div className={`p-4 border-b ${className}`}>{children}</div>;
const CardTitle: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => <h3 className={`font-bold text-lg ${className}`}>{children}</h3>;
const CardContent: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => <div className={`p-4 ${className}`}>{children}</div>;
const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = (props) => <button {...props} className={`px-4 py-2 font-semibold rounded-md transition-colors ${props.className}`}>{props.children}</button>;

export const UploadCenter: React.FC<FeatureComponentProps> = ({ setActiveFeature }) => {
  const uploadOptions = [
    {
      title: "📦 Products",
      description: "List seeds, fertilizers, equipment, or produce",
      icon: Package,
      key: "ADD_PRODUCT" as FeatureKey,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "🌾 Land for Lease",
      description: "List your agricultural land for leasing",
      icon: MapPin,
      key: "ADD_LAND_LISTING" as FeatureKey,
      color: "from-red-500 to-pink-600",
      bgColor: "bg-red-50"
    },
    {
      title: "📹 Videos & Posts",
      description: "Share farming videos or create community posts",
      icon: Video,
      key: "CREATE_POST_PAGE" as FeatureKey,
      color: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "📝 Blog Corner",
      description: "Write success stories, tips, or tutorials",
      icon: BookOpen,
      key: "CREATE_BLOG" as FeatureKey,
      color: "from-orange-500 to-amber-600",
      bgColor: "bg-orange-50"
    },
  ];

  const quickStats = [
    { label: "Products Listed", value: "0", icon: Package, color: "text-purple-600" },
    { label: "Land Listings", value: "1", icon: MapPin, color: "text-red-600" },
    { label: "Posts Created", value: "2", icon: FileText, color: "text-blue-600" },
    { label: "Blogs Written", value: "0", icon: BookOpen, color: "text-orange-600" },
  ];
  
  const handleNavigation = (key: FeatureKey) => {
    if (setActiveFeature) {
        setActiveFeature(key);
    }
  };

  return (
    <div className="p-4 md:p-6 bg-white rounded-2xl shadow-lg">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-gradient-to-br from-brand-green to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Upload className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Upload Center</h1>
            <p className="text-gray-600">Share products, land, blogs, and more</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {quickStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4 text-center">
              <stat.icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upload Options */}
      <div className="grid md:grid-cols-2 gap-6">
        {uploadOptions.map((option, index) => (
          <button key={index} onClick={() => handleNavigation(option.key)} className="text-left h-full">
            <Card className="hover:shadow-2xl hover:scale-105 transition-all duration-300 h-full group flex flex-col">
              <CardHeader className={`${option.bgColor} border-b border-gray-100`}>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{option.title}</CardTitle>
                  <div className={`w-12 h-12 bg-gradient-to-br ${option.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <option.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="bg-white rounded-b-lg flex-1 flex flex-col justify-between">
                <p className="text-gray-600 my-4">{option.description}</p>
                <Button className={`w-full bg-gradient-to-r ${option.color} text-white hover:opacity-90 mt-auto`}>
                  <Plus className="w-5 h-5 mr-2" />
                  Start Upload
                </Button>
              </CardContent>
            </Card>
          </button>
        ))}
      </div>

      {/* Tips Section */}
      <Card className="mt-8 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-900">
            <Sprout className="w-6 h-6" />
            Upload Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="bg-white rounded-b-lg">
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold mt-1">✓</span>
              <span className="text-gray-700"><strong>Products:</strong> Add clear photos, accurate pricing, and contact details</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold mt-1">✓</span>
              <span className="text-gray-700"><strong>Land Listings:</strong> Include soil type, water availability, and GPS location</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold mt-1">✓</span>
              <span className="text-gray-700"><strong>Blogs:</strong> Use tags for easy discovery, share practical experiences</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold mt-1">✓</span>
              <span className="text-gray-700"><strong>Videos/Posts:</strong> Share success stories to motivate the community</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
