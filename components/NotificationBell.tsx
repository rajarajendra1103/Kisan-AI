import React, { useState, useEffect, useRef } from 'react';
import { Bell, ShoppingCart, FileText, TrendingUp, BookOpen, Users, Check } from 'lucide-react';
import { MockUser, Notification, FeatureKey } from '../types';

// Mock Data
const mockNotifications: Notification[] = [
  {
    id: '1',
    user_id: 'user_123',
    is_read: false,
    type: 'price_alert',
    title: 'Wheat Price Alert',
    message: 'The market price for wheat in Punjab has increased by 5%.',
    action_url: 'MARKET_PRICES',
    created_date: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
  },
  {
    id: '3',
    user_id: 'user_123',
    is_read: true,
    type: 'blog',
    title: 'New Blog Post Published',
    message: 'Check out the new article on "Advanced Irrigation Techniques".',
    action_url: 'BLOG_CORNER',
    created_date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
];

// Simple date formatter to avoid adding a new library
const formatDistanceToNow = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return `just now`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
};

interface NotificationBellProps {
  currentUser: MockUser | null;
  setActiveFeature?: (feature: FeatureKey) => void;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ currentUser, setActiveFeature }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const loadNotifications = () => {
    if (currentUser) {
      const userNotifications = mockNotifications.filter(n => n.user_id === currentUser.id);
      setNotifications(userNotifications);
      setUnreadCount(userNotifications.filter(n => !n.is_read).length);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [currentUser]);
  
  const markAsRead = (notificationId: string) => {
    const notification = notifications.find(n => n.id === notificationId);
    if (notification && !notification.is_read) {
        setNotifications(prev =>
            prev.map(n => (n.id === notificationId ? { ...n, is_read: true } : n))
        );
        setUnreadCount(prev => (prev > 0 ? prev - 1 : 0));
    }
  };
  
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    setUnreadCount(0);
  };
  
  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.action_url && setActiveFeature) {
      setActiveFeature(notification.action_url);
    }
    setIsOpen(false);
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'price_alert': return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'blog': return <BookOpen className="w-5 h-5 text-orange-600" />;
      default: return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="relative" ref={popoverRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
        <Bell className="w-5 h-5 text-gray-700" />
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-red-600 text-white text-xs rounded-full font-bold">
            {unreadCount > 9 ? "9+" : unreadCount}
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-2xl border z-50">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-bold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-brand-green hover:underline font-semibold flex items-center gap-1"
              >
                <Check className="w-3 h-3" />
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto scrollbar-hide">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 text-sm">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`w-full p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors text-left ${
                    !notification.is_read ? "bg-blue-50/50" : ""
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="mt-1 flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm text-gray-900 mb-1 ${!notification.is_read ? "font-bold" : "font-semibold"}`}>
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(notification.created_date))}
                      </p>
                    </div>
                    {!notification.is_read && (
                      <div className="w-2.5 h-2.5 bg-blue-600 rounded-full mt-1.5 ml-2 flex-shrink-0" />
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};