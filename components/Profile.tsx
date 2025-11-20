
import React, { useState, useEffect } from "react";
import { MockUser, Post, FeatureComponentProps } from '../types';
import { Sprout, MapPin, Phone, Edit, LogOut } from "lucide-react";
import { EditProfileDialog } from './profile/EditProfileDialog';

// --- Local UI Components ---
const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => <div className={`bg-white rounded-lg shadow-sm border ${className}`}>{children}</div>;
const CardContent: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => <div className={`p-6 ${className}`}>{children}</div>;
const CardHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => <div className="p-6 border-b">{children}</div>;
const CardTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => <h3 className="font-bold text-lg">{children}</h3>;
const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string, size?: string }> = (props) => {
    const { variant, size, ...rest } = props;
    let variantClasses = "bg-brand-green text-white hover:bg-emerald-700";
    if (variant === 'secondary') variantClasses = "bg-white/20 text-white hover:bg-white/30";
    if (variant === 'destructive') variantClasses = "bg-red-600 text-white hover:bg-red-700";
    return <button {...rest} className={`px-4 py-2 font-semibold rounded-md transition-colors flex items-center justify-center gap-2 ${size === 'sm' ? 'text-sm' : ''} ${variantClasses} ${props.className}`}>{props.children}</button>
};
const Avatar: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => <div className={`relative rounded-full flex items-center justify-center ${className}`}>{children}</div>;
const AvatarImage: React.FC<{ src?: string }> = ({ src }) => <img src={src} className="w-full h-full object-cover rounded-full" />;
const AvatarFallback: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => <div className={`w-full h-full flex items-center justify-center rounded-full ${className}`}>{children}</div>;
const Tabs: React.FC<{ children: React.ReactNode, defaultValue: string }> = ({ children }) => <div>{children}</div>;
const TabsList: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => <div className={`flex border-b ${className}`}>{children}</div>;
const TabsTrigger: React.FC<{ children: React.ReactNode, isActive: boolean, onClick: () => void }> = ({ children, isActive, onClick }) => <button onClick={onClick} className={`flex-1 p-3 font-semibold text-sm ${isActive ? 'border-b-2 border-brand-green text-brand-green' : 'text-gray-500'}`}>{children}</button>;
const TabsContent: React.FC<{ children: React.ReactNode, hidden: boolean }> = ({ children, hidden }) => <div hidden={hidden}>{children}</div>;


// --- Mock Entities ---
const mockUserPosts: Post[] = [
  { id: 'post_1', author_id: 'user_123', content: 'Harvested my first batch of organic carrots today! Feeling proud. #organicfarming', likes_count: 58, comments_count: 12, created_date: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
  { id: 'post_2', author_id: 'user_123', content: 'The weather forecast looks great for sowing wheat next week in Punjab. Anyone else getting ready?', likes_count: 34, comments_count: 7, created_date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString() },
];

const PostService = {
  filter: async (filters: { author_id: string }, sort: string): Promise<Post[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    if (filters.author_id === 'user_123') {
        return mockUserPosts.filter(p => p.author_id === filters.author_id);
    }
    return [];
  }
};

export const Profile: React.FC<FeatureComponentProps> = ({ currentUser, setCurrentUser }) => {
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('about');

  useEffect(() => {
    const loadPosts = async () => {
      if (currentUser) {
        setIsLoadingPosts(true);
        const posts = await PostService.filter({ author_id: currentUser.id }, "-created_date");
        setUserPosts(posts);
        setIsLoadingPosts(false);
      }
    };
    loadPosts();
  }, [currentUser]);

  const handleProfileUpdate = (updatedData: Partial<MockUser>) => {
    if (setCurrentUser && currentUser) {
      setCurrentUser({ ...currentUser, ...updatedData });
    }
  };

  const handleLogout = () => {
    if (setCurrentUser) {
      setCurrentUser(null);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card><CardContent className="text-center"><p>You are not logged in.</p></CardContent></Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 lg:pb-8 bg-gray-50">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-brand-green to-emerald-600 text-white p-6 md:p-8 rounded-b-2xl shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start justify-between mb-6 gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20 sm:w-24 sm:h-24 border-4 border-white shadow-xl">
                {currentUser.profile_image ? <AvatarImage src={currentUser.profile_image} /> : null}
                <AvatarFallback className="bg-white text-brand-green text-3xl font-bold">
                  {currentUser.full_name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-1">
                  {currentUser.full_name}
                </h1>
                <p className="text-green-100 capitalize mb-2">
                  {currentUser.user_type || "Farmer"}
                </p>
                {currentUser.location && (
                  <div className="flex items-center gap-2 text-green-100">
                    <MapPin className="w-4 h-4" />
                    {currentUser.location}
                  </div>
                )}
              </div>
            </div>
            <Button
              onClick={() => setShowEditDialog(true)}
              variant="secondary"
              size="sm"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4"><p className="text-xl sm:text-2xl font-bold">{userPosts.length}</p><p className="text-xs sm:text-sm text-green-100">Posts</p></div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4"><p className="text-xl sm:text-2xl font-bold">{currentUser.farm_size_acres || 0}</p><p className="text-xs sm:text-sm text-green-100">Acres</p></div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4"><p className="text-xl sm:text-2xl font-bold">{currentUser.crops_grown?.length || 0}</p><p className="text-xs sm:text-sm text-green-100">Crops</p></div>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <Tabs defaultValue="about">
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-gray-200 rounded-lg p-1">
            <TabsTrigger isActive={activeTab === 'about'} onClick={() => setActiveTab('about')}>About</TabsTrigger>
            <TabsTrigger isActive={activeTab === 'posts'} onClick={() => setActiveTab('posts')}>Posts</TabsTrigger>
            <TabsTrigger isActive={activeTab === 'settings'} onClick={() => setActiveTab('settings')}>Settings</TabsTrigger>
          </TabsList>

          <TabsContent hidden={activeTab !== 'about'}>
            <Card>
              <CardHeader><CardTitle>Profile Information</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {currentUser.phone_number && (
                  <div className="flex items-center gap-3"><Phone className="w-5 h-5 text-gray-400" /><div><p className="text-sm text-gray-500">Phone Number</p><p className="font-medium">{currentUser.phone_number}</p></div></div>
                )}
                {currentUser.crops_grown && currentUser.crops_grown.length > 0 && (
                  <div className="flex items-start gap-3"><Sprout className="w-5 h-5 text-gray-400 mt-1" /><div><p className="text-sm text-gray-500 mb-2">Crops Grown</p><div className="flex flex-wrap gap-2">{currentUser.crops_grown.map((crop, index) => (<span key={index} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">{crop}</span>))}</div></div></div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent hidden={activeTab !== 'posts'}>
            <div className="space-y-4">{isLoadingPosts ? <Card><CardContent className="p-12 text-center"><p className="text-gray-500">Loading posts...</p></CardContent></Card> : userPosts.length === 0 ? <Card><CardContent className="p-12 text-center"><p className="text-gray-500">No posts yet</p></CardContent></Card> : userPosts.map((post) => (<Card key={post.id}><CardContent className="p-6"><p className="text-gray-800 mb-4">{post.content}</p><div className="flex items-center gap-4 text-sm text-gray-500"><span>{post.likes_count || 0} likes</span><span>{post.comments_count || 0} comments</span></div></CardContent></Card>))}</div>
          </TabsContent>
          <TabsContent hidden={activeTab !== 'settings'}>
            <Card>
              <CardHeader><CardTitle>Account Settings</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <Button variant="destructive" onClick={handleLogout} className="w-full"><LogOut className="w-4 h-4 mr-2" />Logout</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <EditProfileDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        currentUser={currentUser}
        onUpdate={handleProfileUpdate}
      />
    </div>
  );
};
