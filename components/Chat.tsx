import React, { useState, useEffect, useMemo, useRef } from "react";
import { FeatureComponentProps, MockUser, ChatRoom, DirectMessage } from '../types';
import { Search, MessageCircle, Users, Send, Mic, Volume2, WifiOff, CheckCheck, X } from "lucide-react";

// --- MOCK DATA ---
const mockUsers: MockUser[] = [
    { id: 'user_2', full_name: 'Aarav Sharma', initials: 'AS', profile_image: 'https://i.pravatar.cc/150?u=user2', user_type: 'farmer', location: 'Jaipur', state: 'Rajasthan', preferred_language: 'hindi' },
    { id: 'user_3', full_name: 'Priya Patel', initials: 'PP', profile_image: 'https://i.pravatar.cc/150?u=user3', user_type: 'guide', location: 'Ahmedabad', state: 'Gujarat', preferred_language: 'english' },
    { id: 'user_4', full_name: 'Rohan Gupta', initials: 'RG', profile_image: 'https://i.pravatar.cc/150?u=user4', user_type: 'shop_owner', location: 'Mumbai', state: 'Maharashtra', preferred_language: 'marathi' },
    { id: 'user_5', full_name: 'Sneha Reddy', initials: 'SR', profile_image: 'https://i.pravatar.cc/150?u=user5', user_type: 'farmer', location: 'Hyderabad', state: 'Telangana', preferred_language: 'telugu' },
];

const mockChatRooms: ChatRoom[] = [
    { id: 'room_1', name: 'Wheat Growers of Punjab', description: 'Discussing wheat cultivation techniques.', room_type: 'public', members: ['user_123', 'user_2'], topic: 'Wheat', language: 'punjabi', region: 'Punjab', created_date: new Date().toISOString() },
    { id: 'room_2', name: 'Organic Farming India', description: 'A community for organic farming enthusiasts.', room_type: 'public', members: ['user_123', 'user_3', 'user_5'], topic: 'Organic', language: 'english', region: 'All India', created_date: new Date().toISOString() },
];

let mockMessages: DirectMessage[] = [
    { id: 'msg_1', sender_id: 'user_2', receiver_id: 'user_123', message: 'Hello Sanjay! I saw your post about fertilizers. Can you share some advice?', message_type: 'text', is_read: false, created_date: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
    { id: 'msg_2', sender_id: 'user_123', receiver_id: 'user_2', message: 'Hi Aarav, of course! Which crop are you asking about?', message_type: 'text', is_read: true, created_date: new Date(Date.now() - 1000 * 60 * 4).toISOString() },
];

const formatDistanceToNow = (isoDate: string): string => {
    const date = new Date(isoDate);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return `just now`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
};

// --- CHAT COMPONENT ---
export const Chat: React.FC<FeatureComponentProps> = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState('recent');
  const [searchQuery, setSearchQuery] = useState("");
  const [userTypeFilter, setUserTypeFilter] = useState("all");
  const [languageFilter, setLanguageFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("");
  const [allUsers, setAllUsers] = useState<MockUser[]>([]);
  const [recentChats, setRecentChats] = useState<MockUser[]>([]);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [selectedChat, setSelectedChat] = useState<MockUser | null>(null);
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load initial data
    if(currentUser) {
        setAllUsers(mockUsers);
        setChatRooms(mockChatRooms);
        
        // Determine recent chats from messages
        const userMessages = mockMessages.filter(m => m.sender_id === currentUser.id || m.receiver_id === currentUser.id);
        const recentUserIds = [...new Set(userMessages.map(m => m.sender_id === currentUser.id ? m.receiver_id : m.sender_id))];
        const recentUsers = mockUsers.filter(u => recentUserIds.includes(u.id));
        setRecentChats(recentUsers);
    }
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [currentUser]);

  const filteredUsers = useMemo(() => allUsers.filter(user => {
    const matchesSearch = user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || user.location?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = userTypeFilter === "all" || user.user_type === userTypeFilter;
    const matchesLanguage = languageFilter === "all" || user.preferred_language === languageFilter;
    const matchesRegion = !regionFilter || user.state?.toLowerCase().includes(regionFilter.toLowerCase());
    return matchesSearch && matchesType && matchesLanguage && matchesRegion;
  }), [allUsers, searchQuery, userTypeFilter, languageFilter, regionFilter]);

  const openChat = (user: MockUser) => {
    setSelectedChat(user);
    const chatMessages = mockMessages.filter(m => (m.sender_id === currentUser?.id && m.receiver_id === user.id) || (m.sender_id === user.id && m.receiver_id === currentUser?.id))
        .sort((a, b) => new Date(a.created_date).getTime() - new Date(b.created_date).getTime());
    setMessages(chatMessages);
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedChat || !currentUser) return;

    const msg: DirectMessage = {
        id: `msg_${Date.now()}`,
        sender_id: currentUser.id,
        receiver_id: selectedChat.id,
        message: newMessage,
        message_type: "text",
        is_read: false,
        created_date: new Date().toISOString(),
    };

    mockMessages.push(msg);
    setMessages(prev => [...prev, msg]);
    setNewMessage("");

    console.log(`Notification created for ${selectedChat.full_name}: New message from ${currentUser.full_name}`);
  };

  const speakMessage = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = currentUser?.preferred_language === 'hindi' ? 'hi-IN' : 'en-IN';
      window.speechSynthesis.speak(utterance);
    }
  };

  const TabButton: React.FC<{label: string, value: string, icon: React.ElementType}> = ({ label, value, icon: Icon }) => (
    <button onClick={() => setActiveTab(value)} className={`flex-1 flex items-center justify-center gap-2 p-3 text-sm font-semibold transition-colors ${activeTab === value ? 'text-brand-green border-b-2 border-brand-green' : 'text-gray-500 hover:bg-gray-100'}`}>
        <Icon className="w-5 h-5"/>
        {label}
    </button>
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg">
        {/* Header with Search and Filters */}
        <div className="p-4 border-b">
            <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input placeholder="Search users by name or location..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:ring-brand-green focus:border-brand-green" />
                {isOffline && <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full flex items-center gap-1"><WifiOff className="w-3 h-3" /> Offline</span>}
            </div>
            <div className="flex flex-wrap gap-2">
                <select value={userTypeFilter} onChange={e => setUserTypeFilter(e.target.value)} className="p-2 border border-gray-300 rounded-md text-sm">
                    <option value="all">All Users</option>
                    <option value="farmer">👨‍🌾 Farmers</option>
                    <option value="guide">👨‍🏫 Guides</option>
                    <option value="shop_owner">🏪 Shop Owners</option>
                </select>
                <select value={languageFilter} onChange={e => setLanguageFilter(e.target.value)} className="p-2 border border-gray-300 rounded-md text-sm">
                    <option value="all">All Languages</option>
                    <option value="english">English</option>
                    <option value="hindi">Hindi</option>
                    <option value="punjabi">Punjabi</option>
                    <option value="tamil">Tamil</option>
                    <option value="telugu">Telugu</option>
                    <option value="kannada">Kannada</option>
                    <option value="marathi">Marathi</option>
                </select>
                <input placeholder="Region/State..." value={regionFilter} onChange={e => setRegionFilter(e.target.value)} className="p-2 border border-gray-300 rounded-md text-sm"/>
            </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
            <TabButton label="Recent" value="recent" icon={MessageCircle} />
            <TabButton label="Communities" value="rooms" icon={Users} />
            <TabButton label="Find Users" value="find" icon={Search} />
        </div>
        
        {/* Content */}
        <div className="p-4 min-h-[60vh]">
            {activeTab === 'recent' && (
                <div className="space-y-3">
                    {recentChats.map(user => (
                        <div key={user.id} onClick={() => openChat(user)} className="p-3 bg-white rounded-lg shadow-sm border flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow">
                            <img src={user.profile_image} alt={user.full_name} className="w-12 h-12 rounded-full border-2 border-brand-green"/>
                            <div className="flex-1"><h3 className="font-semibold">{user.full_name}</h3><p className="text-sm text-gray-500 capitalize">{user.user_type}</p></div>
                        </div>
                    ))}
                </div>
            )}
            {activeTab === 'rooms' && (
                <div className="grid md:grid-cols-2 gap-4">
                    {chatRooms.map(room => (
                        <div key={room.id} className="p-4 bg-white rounded-lg shadow-sm border">
                            <h3 className="font-bold text-lg">{room.name}</h3>
                            <p className="text-sm text-gray-600 mb-2">{room.description}</p>
                            <div className="flex justify-between items-center"><span className="text-xs text-gray-500">{room.members.length} members</span><button className="text-sm bg-brand-green text-white px-3 py-1 rounded-full">Join</button></div>
                        </div>
                    ))}
                </div>
            )}
            {activeTab === 'find' && (
                <div className="grid md:grid-cols-2 gap-4">
                    {filteredUsers.map(user => (
                        <div key={user.id} className="p-3 bg-white rounded-lg shadow-sm border flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <img src={user.profile_image} alt={user.full_name} className="w-12 h-12 rounded-full"/>
                                <div><h3 className="font-semibold">{user.full_name}</h3><p className="text-sm text-gray-500">{user.location}</p></div>
                            </div>
                            <button onClick={() => openChat(user)} className="p-2 bg-green-50 rounded-full text-brand-green hover:bg-green-100"><MessageCircle className="w-5 h-5"/></button>
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* Chat Dialog */}
        {selectedChat && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedChat(null)}>
                <div className="bg-gray-50 rounded-2xl shadow-xl w-full max-w-lg h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
                    <div className="p-4 border-b flex items-center justify-between bg-white rounded-t-2xl">
                        <div className="flex items-center gap-3">
                            <img src={selectedChat.profile_image} alt={selectedChat.full_name} className="w-10 h-10 rounded-full" />
                            <h3 className="font-bold">{selectedChat.full_name}</h3>
                        </div>
                        <button onClick={() => setSelectedChat(null)} className="p-2 rounded-full hover:bg-gray-100"><X size={20}/></button>
                    </div>
                    <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                        {messages.map(msg => {
                            const isSent = msg.sender_id === currentUser?.id;
                            return (
                                <div key={msg.id} className={`flex gap-2 items-end ${isSent ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${isSent ? 'bg-brand-green text-white rounded-br-none' : 'bg-white text-gray-800 border rounded-bl-none'}`}>
                                        <p className="text-sm break-words">{msg.message}</p>
                                        <div className={`text-xs mt-1 flex items-center gap-2 ${isSent ? 'text-green-200' : 'text-gray-400'}`}>
                                            {formatDistanceToNow(msg.created_date)}
                                            {isSent && msg.is_read && <CheckCheck className="w-4 h-4" />}
                                        </div>
                                    </div>
                                    {!isSent && <button onClick={() => speakMessage(msg.message)} className="p-2 text-gray-400 hover:text-brand-green"><Volume2 size={16}/></button>}
                                </div>
                            )
                        })}
                    </div>
                    <div className="p-4 border-t bg-white rounded-b-2xl">
                        <div className="flex gap-2 items-center">
                            <button className="p-3 rounded-full hover:bg-gray-100 text-gray-500"><Mic className="w-5 h-5"/></button>
                            <input value={newMessage} onChange={e => setNewMessage(e.target.value)} onKeyPress={e => e.key === 'Enter' && sendMessage()} placeholder="Type a message..." className="flex-1 w-full border rounded-full py-2.5 px-4 focus:ring-2 focus:ring-brand-green"/>
                            <button onClick={sendMessage} disabled={!newMessage.trim() || isOffline} className="p-3 bg-brand-green text-white rounded-full disabled:bg-gray-300"><Send className="w-5 h-5"/></button>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};