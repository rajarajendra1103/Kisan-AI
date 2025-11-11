import React, { useState } from 'react';
import { X, Image } from 'lucide-react';
import { MockPost, MockUser } from '../../types';

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPostCreated: (post: MockPost) => void;
  currentUser: MockUser | null;
}

export const CreatePostDialog: React.FC<CreatePostDialogProps> = ({ open, onOpenChange, onPostCreated, currentUser }) => {
  const [content, setContent] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  if (!open) return null;

  const handleSubmit = () => {
    if (!content.trim() || !currentUser) return;
    const newPost: MockPost = {
      id: Date.now(),
      user: currentUser,
      content: content,
      image: imagePreview || undefined,
      likes_count: 0,
      comments_count: 0,
      timestamp: 'Just now'
    };
    onPostCreated(newPost);
    setContent('');
    setImagePreview(null);
    onOpenChange(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => onOpenChange(false)}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-bold text-lg">Create a Post</h2>
          <button onClick={() => onOpenChange(false)} className="p-2 rounded-full hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>
        <div className="p-4">
          <textarea
            className="w-full p-2 border-none focus:ring-0 resize-none text-lg"
            rows={5}
            placeholder={`What's on your mind, ${currentUser?.full_name.split(' ')[0]}?`}
            value={content}
            onChange={e => setContent(e.target.value)}
          />
          {imagePreview && (
            <div className="relative my-2">
              <img src={imagePreview} alt="Preview" className="rounded-lg w-full" />
              <button onClick={() => setImagePreview(null)} className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1">
                <X size={16} />
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between p-4 border-t">
          <label className="cursor-pointer text-gray-500 hover:text-brand-green p-2 rounded-full">
            <Image size={22} />
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </label>
          <button
            onClick={handleSubmit}
            disabled={!content.trim()}
            className="px-6 py-2 bg-brand-green text-white font-semibold rounded-full disabled:bg-gray-300 hover:bg-emerald-700"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};