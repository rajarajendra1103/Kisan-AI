
import React from 'react';
import { MessageCircle, Camera, ClipboardList, FileText } from 'lucide-react';
import { FeatureKey, FeatureComponentProps } from '../../types';

export const QuickActions: React.FC<FeatureComponentProps> = ({ setActiveFeature }) => {
  const actions = [
    {
      key: 'AI_CROP_ADVISOR' as FeatureKey,
      name: "AI Assistant",
      icon: MessageCircle,
      color: "from-blue-500 to-blue-600",
      description: "Get instant advice"
    },
    {
      key: 'DISEASE_DIAGNOSIS' as FeatureKey,
      name: "Disease Check",
      icon: Camera,
      color: "from-red-500 to-pink-600",
      description: "Diagnose crop issues"
    },
    {
      key: 'CHART_BOT' as FeatureKey,
      name: "Knowledge Bot",
      icon: ClipboardList,
      color: "from-yellow-500 to-orange-600",
      description: "Structured AI info"
    },
    {
      key: 'GOVERNMENT_SCHEMES' as FeatureKey,
      name: "Schemes",
      icon: FileText,
      color: "from-purple-500 to-indigo-600",
      description: "Government benefits"
    },
  ];

  const handleActionClick = (key: FeatureKey) => {
    if (setActiveFeature) {
      setActiveFeature(key);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-3">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action) => (
          <button
            key={action.key}
            onClick={() => handleActionClick(action.key)}
            className="group text-left bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl hover:scale-105 transition-all duration-300 h-full"
          >
            <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
              <action.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">{action.name}</h3>
            <p className="text-xs text-gray-500">{action.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};