import React from 'react';

export type FeatureKey =
  | 'HOME'
  | 'AI_CROP_ADVISOR'
  | 'DISEASE_DIAGNOSIS'
  | 'YIELD_PREDICTION'
  | 'WEATHER_ALERTS'
  | 'MARKET_PRICES'
  | 'PRODUCTS_MARKETPLACE'
  | 'GOVERNMENT_SCHEMES'
  | 'CHAT'
  | 'PROFILE'
  | 'UPLOAD_CENTER'
  | 'MY_PRODUCTS'
  | 'BLOG_CORNER'
  | 'LAND_LISTINGS'
  | 'MY_LAND_LISTINGS'
  | 'SETTINGS'
  | 'CHART_BOT'
  | 'ADD_LAND_LISTING'
  | 'ADD_PRODUCT'
  | 'CREATE_POST_PAGE'
  | 'CREATE_BLOG'
  | 'MY_ORDERS'
  | 'REQUEST_QUOTE'
  | 'MY_QUOTE_REQUESTS'
  | 'QUOTE_REQUESTS';


export interface Feature {
  title: string;
  description: string;
}

export const FEATURES: Record<FeatureKey, Feature> = {
  HOME: {
    title: 'Home',
    description: 'Dashboard and community feed.'
  },
  CHAT: {
    title: 'Chat & Community',
    description: 'Connect with farmers and experts.',
  },
  AI_CROP_ADVISOR: {
    title: 'AI Crop Advisor',
    description: 'Get expert advice on crop management.',
  },
  DISEASE_DIAGNOSIS: {
    title: 'Crop Health & Analysis',
    description: 'Upload a photo to diagnose crop diseases.',
  },
  YIELD_PREDICTION: {
    title: 'Yield Prediction',
    description: 'Forecast your crop yield.',
  },
  WEATHER_ALERTS: {
    title: 'Weather Alerts',
    description: 'Get timely weather alerts for your farm.',
  },
  MARKET_PRICES: {
    title: 'Market Prices',
    description: 'Track local and national market prices.',
  },
  PRODUCTS_MARKETPLACE: {
    title: 'Products Marketplace',
    description: 'Buy and sell agricultural products.',
  },
  GOVERNMENT_SCHEMES: {
    title: 'Government Schemes',
    description: 'Browse agricultural subsidies, loans, and support programs.',
  },
  PROFILE: {
    title: 'My Profile',
    description: 'View and manage your public profile.',
  },
  UPLOAD_CENTER: {
    title: 'Upload Center',
    description: 'Manage your uploaded images and documents.',
  },
  MY_PRODUCTS: {
    title: 'My Products',
    description: 'Manage your product listings.',
  },
  BLOG_CORNER: {
    title: 'Blog Corner',
    description: 'Read and write articles about farming.',
  },
  LAND_LISTINGS: {
    title: 'Land for Lease',
    description: 'Browse or list agricultural land.',
  },
  MY_LAND_LISTINGS: {
    title: 'My Land Listings',
    description: 'Manage your land lease listings.',
  },
  SETTINGS: {
    title: 'Settings',
    description: 'Configure your account and preferences.',
  },
  CHART_BOT: {
    title: 'Knowledge Bot',
    description: 'Get structured information about crops and cattle.',
  },
  ADD_LAND_LISTING: {
    title: 'List Your Land',
    description: 'Add a new land listing for lease.',
  },
  ADD_PRODUCT: {
    title: 'Add Product',
    description: 'List a new product for sale.',
  },
  CREATE_POST_PAGE: {
    title: 'Create Post',
    description: 'Create a new community post.',
  },
  CREATE_BLOG: {
    title: 'Create Blog Post',
    description: 'Write a new blog article.',
  },
  MY_ORDERS: {
    title: 'My Orders',
    description: 'Track your product orders.',
  },
  REQUEST_QUOTE: {
    title: 'Request a Quote',
    description: 'Get a price quote for specific products.',
  },
  MY_QUOTE_REQUESTS: {
    title: 'My Quote Requests',
    description: 'Track the quote requests you have submitted.',
  },
  QUOTE_REQUESTS: {
    title: 'Incoming Quote Requests',
    description: 'View and respond to quote requests from farmers.',
  },
};

export interface FeatureComponentProps {
  setActiveFeature?: (feature: FeatureKey) => void;
  currentUser?: MockUser | null;
  setCurrentUser?: React.Dispatch<React.SetStateAction<MockUser | null>>;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface MockUser {
  id: string;
  full_name: string;
  initials: string;
  profile_image?: string;
  is_verified?: boolean;
  followers?: string[];
  following?: string[];
  location?: string; // City/Village
  state?: string;
  crops_grown?: string[];
  user_type?: 'farmer' | 'guide' | 'shop_owner' | 'customer' | 'expert';
  phone_number?: string;
  farm_size_acres?: number;
  // FIX: Added 'punjabi' to the list of preferred languages to resolve the type error.
  preferred_language?: 'english' | 'hindi' | 'tamil' | 'telugu' | 'kannada' | 'marathi' | 'punjabi';
  tracked_crops?: string[];
}

export interface MockPost {
  id: number;
  user: MockUser;
  content: string;
  image?: string;
  likes_count: number;
  comments_count: number;
  timestamp: string;
}

export interface Post {
  id: string;
  author_id: string;
  content: string;
  likes_count: number;
  comments_count: number;
  created_date: string;
}

export type NotificationType = 'order' | 'quote' | 'price_alert' | 'blog' | 'community' | 'general' | 'message';

export interface Notification {
  id: string;
  user_id: string;
  is_read: boolean;
  type: NotificationType;
  title: string;
  message: string;
  action_url?: FeatureKey;
  created_date: string; // ISO string
  related_id?: string;
}

export interface DirectMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  message_type: 'text' | 'audio' | 'image';
  is_read: boolean;
  created_date: string; // ISO String
}

export interface ChatRoom {
  id: string;
  name: string;
  description: string;
  room_type: 'public' | 'private';
  members: string[]; // array of user ids
  topic?: string;
  language?: string;
  region?: string;
  created_date: string; // ISO String
}

export interface LandLease {
  id: string;
  owner_id: string;
  owner_name: string;
  land_size_acres: number;
  lease_cost_per_acre: number;
  location: string;
  village: string;
  district: string;
  state: string;
  soil_type: 'sandy' | 'clay' | 'loam' | 'silt' | 'red' | 'black' | 'alluvial';
  soil_ph?: number;
  irrigation_available: boolean;
  irrigation_type?: string;
  images?: string[];
  gps_coordinates?: string;
  contact_number: string;
  available: boolean;
  created_date: string; // ISO String
}

export interface YieldPredictionResult {
  predicted_yield: string;
  yield_unit: string;
  key_factors: string[];
  recommendations: string[];
}

export interface Blog {
  id: string;
  author_id?: string;
  title: string;
  content: string;
  author_name: string;
  author_type: MockUser['user_type'];
  author_avatar_fallback: string;
  blog_type: 'success_story' | 'tip' | 'tutorial' | 'experience';
  media_type: 'text' | 'image' | 'video';
  media_url?: string;
  tags?: string[];
  language?: string;
  views_count: number;
  likes_count: number;
  created_date: string; // ISO String
}

export interface Product {
    id: string;
    product_name: string;
    description: string;
    category: 'seeds' | 'fertilizer' | 'pesticide' | 'equipment' | 'produce' | 'consultation' | 'other';
    price: number;
    unit: string;
    seller_id: string;
    seller_name: string;
    seller_type: MockUser['user_type'];
    in_stock: boolean;
    stock_quantity?: number;
    images?: string[];
    location: string;
    contact_number: string;
    orders_count?: number;
    views_count?: number;
    promotion_active?: boolean;
    promotion_discount?: number; // As a percentage, e.g., 10 for 10%
    promotion_ends?: string;
    consultation_duration?: number; // in minutes
    created_date: string; // ISO String
}

export interface Order {
    id: string;
    product_id: string;
    product_name: string;
    buyer_id: string;
    buyer_name: string;
    seller_id: string;
    seller_name: string;
    quantity: number;
    total_price: number;
    delivery_address: string;
    buyer_contact: string;
    notes?: string;
    order_date: string; // YYYY-MM-DD
    status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
    created_date: string; // ISO String
}

export interface QuoteRequest {
    id: string;
    farmer_id: string;
    farmer_name: string;
    product_category: 'seeds' | 'fertilizer' | 'pesticide' | 'equipment' | 'other';
    product_description: string;
    quantity_needed: string;
    budget_range?: string;
    location: string;
    contact_number: string;
    needed_by_date?: string;
    status: 'open' | 'closed';
    quotes_received: number;
    created_date: string; // ISO String
}

export interface MarketPrice {
  id: string;
  crop_name: string;
  market_location: string;
  state: string;
  price_per_quintal: number;
  trend: 'up' | 'down' | 'stable';
  date: string; // ISO String
}