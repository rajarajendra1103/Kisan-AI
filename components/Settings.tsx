
import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import { FEATURES, FeatureComponentProps } from '../types';

export const Settings: React.FC<FeatureComponentProps> = ({}) => {
  const featureInfo = FEATURES.SETTINGS;

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg">
      <div className="flex items-center gap-4 mb-4">
        <SettingsIcon className="w-8 h-8 text-brand-green" />
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{featureInfo.title}</h2>
          <p className="text-gray-500">{featureInfo.description}</p>
        </div>
      </div>
      <div className="mt-6 text-center text-gray-600 border-2 border-dashed border-gray-300 rounded-lg p-12">
        <p>This feature is coming soon.</p>
        <p>Manage your account settings, notification preferences, and more.</p>
      </div>
    </div>
  );
};
