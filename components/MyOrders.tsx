import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { FEATURES } from '../types';

export const MyOrders: React.FC = () => {
  const featureInfo = FEATURES.MY_ORDERS;
  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg">
      <div className="flex items-center gap-4 mb-4">
        <ShoppingCart className="w-8 h-8 text-brand-green" />
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{featureInfo.title}</h2>
          <p className="text-gray-500">{featureInfo.description}</p>
        </div>
      </div>
      <div className="mt-6 text-center text-gray-600 border-2 border-dashed border-gray-300 rounded-lg p-12">
        <p>This feature is coming soon.</p>
        <p>Here you will be able to track all your past and current orders.</p>
      </div>
    </div>
  );
};
