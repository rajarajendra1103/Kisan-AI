import React from 'react';
import { ThumbsUp, MessageCircle, MoreHorizontal } from 'lucide-react';
import { MockPost } from '../../types';

interface PostCardProps {
  post: MockPost;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-brand-green to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold">
            {post.user.initials}
          </div>
          <div>
            <h4 className="font-bold text-gray-800">{post.user.full_name}</h4>
            <p className="text-xs text-gray-500">{post.timestamp}</p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreHorizontal />
        </button>
      </div>
      
      <p className="text-gray-700 mb-4 whitespace-pre-wrap">{post.content}</p>
      
      {post.image && (
        <div className="mb-4 rounded-lg overflow-hidden">
          <img src={post.image} alt="Post content" className="w-full h-auto object-cover" />
        </div>
      )}

      <div className="flex justify-between items-center text-gray-500 border-t pt-3">
        <button className="flex items-center gap-2 hover:text-brand-green transition-colors">
          <ThumbsUp size={18} />
          <span className="text-sm font-medium">{post.likes_count} Likes</span>
        </button>
        <button className="flex items-center gap-2 hover:text-brand-green transition-colors">
          <MessageCircle size={18} />
          <span className="text-sm font-medium">{post.comments_count} Comments</span>
        </button>
      </div>
    </div>
  );
};