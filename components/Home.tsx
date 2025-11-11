import React, { useState } from 'react';
import { WelcomeBanner } from './home/WelcomeBanner';
import { QuickActions } from './home/QuickActions';
import { PostCard } from './feed/PostCard';
import { CreatePostDialog } from './feed/CreatePostDialog';
import { MockUser, MockPost, FeatureComponentProps } from '../types';
import { EditProfileDialog } from './profile/EditProfileDialog';
import { ProfileDrawer } from './ProfileDrawer';


// Mock Data
const mockPosts: MockPost[] = [
  {
    id: 1,
    user: { id: 'user_456', full_name: 'Rajesh Patel', initials: 'RP' },
    content: 'Just finished planting the new batch of tomatoes. The weather looks promising this week! 🍅',
    image: 'https://images.unsplash.com/photo-1598512752271-33f913a5af13?q=80&w=2070&auto=format&fit=crop',
    likes_count: 42,
    comments_count: 8,
    timestamp: '2 hours ago',
  },
  {
    id: 2,
    user: { id: 'user_789', full_name: 'Priya Singh', initials: 'PS' },
    content: 'Has anyone tried the new organic fertilizer from the co-op? Seeing great results on my spinach crop.',
    likes_count: 29,
    comments_count: 12,
    timestamp: '5 hours ago',
  },
];


export const Home: React.FC<FeatureComponentProps> = ({ setActiveFeature, currentUser, setCurrentUser }) => {
  const [posts, setPosts] = useState<MockPost[]>(mockPosts);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);


  const handlePostCreated = (newPost: MockPost) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
    setShowCreatePost(false);
  };

  const handleProfileUpdate = (updatedData: Partial<MockUser>) => {
    if (currentUser && setCurrentUser) {
      setCurrentUser({ ...currentUser, ...updatedData });
    }
  };

  return (
    <div className="pb-24 lg:pb-0">
      <div className="bg-white lg:rounded-2xl lg:shadow-lg overflow-hidden">
        <WelcomeBanner user={currentUser} onEditProfile={() => setShowEditProfile(true)} onOpenProfileDrawer={() => setShowProfileDrawer(true)} />
        
        <div className="p-4 md:p-6 space-y-6">
          <QuickActions setActiveFeature={setActiveFeature} />

          <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-gradient-to-br from-brand-green to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg flex-shrink-0">
                {currentUser?.initials}
              </div>
              <button
                onClick={() => setShowCreatePost(true)}
                className="flex-1 text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-500 transition-colors duration-200"
              >
                Share your farming experience...
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-800">Community Feed</h2>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </div>

      <CreatePostDialog
        open={showCreatePost}
        onOpenChange={setShowCreatePost}
        onPostCreated={handlePostCreated}
        currentUser={currentUser}
      />
      
      <EditProfileDialog
        open={showEditProfile}
        onOpenChange={setShowEditProfile}
        currentUser={currentUser}
        onUpdate={handleProfileUpdate}
      />
      
      <ProfileDrawer
        open={showProfileDrawer}
        onOpenChange={setShowProfileDrawer}
        currentUser={currentUser}
        setActiveFeature={setActiveFeature}
      />
    </div>
  );
};