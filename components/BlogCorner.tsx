import React, { useState, useMemo } from "react";
import { FeatureComponentProps, Blog } from '../types';
import {
  BookOpen,
  Plus,
  Search,
  Heart,
  Eye,
  Image as ImageIcon,
  Video,
  FileText
} from "lucide-react";

// Mock Data
const mockBlogs: Blog[] = [
  {
    id: 'blog_1',
    title: 'My Journey with Drip Irrigation: A Game Changer',
    content: 'Switching to drip irrigation was the best decision I made for my farm. It has not only conserved water but also increased my tomato yield by almost 30%. In this post, I will share the step-by-step process of how I set it up, the costs involved, and the challenges I faced...',
    author_name: 'Sanjay Kumar',
    author_type: 'farmer',
    author_avatar_fallback: 'SK',
    blog_type: 'success_story',
    media_type: 'image',
    media_url: 'https://images.unsplash.com/photo-1582229061121-ca34b9b00984?q=80&w=2070&auto=format&fit=crop',
    tags: ['irrigation', 'tomato', 'success', 'sustainability'],
    views_count: 1250,
    likes_count: 230,
    created_date: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
  },
  {
    id: 'blog_2',
    title: '5 Organic Methods to Control Pests in Wheat Crops',
    content: 'Battling pests without resorting to harsh chemicals is a challenge for many organic farmers. Here are five tried-and-tested methods that have worked wonders for my wheat fields in Rajasthan, from introducing beneficial insects to using neem oil sprays effectively.',
    author_name: 'Aarav Sharma',
    author_type: 'farmer',
    author_avatar_fallback: 'AS',
    blog_type: 'tip',
    media_type: 'text',
    tags: ['organic', 'pests', 'wheat'],
    views_count: 890,
    likes_count: 150,
    created_date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: 'blog_3',
    title: 'A Step-by-Step Tutorial on Soil Testing',
    content: 'Understanding your soil is the first step towards a successful harvest. This tutorial provides a simple, step-by-step guide for farmers to collect soil samples, understand the key parameters to test for, and interpret the results to make informed decisions about fertilizers and crop selection.',
    author_name: 'Priya Patel',
    author_type: 'guide',
    author_avatar_fallback: 'PP',
    blog_type: 'tutorial',
    media_type: 'video',
    media_url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    tags: ['soil', 'tutorial', 'sustainability'],
    views_count: 2100,
    likes_count: 450,
    created_date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
];


// Local UI components
const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => <div className={`bg-white rounded-2xl border border-gray-100 shadow-md ${className}`}>{children}</div>;
const CardHeader: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => <div className={`p-6 ${className}`}>{children}</div>;
const CardTitle: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => <h3 className={`font-bold text-2xl text-gray-900 ${className}`}>{children}</h3>;
const CardContent: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => <div className={`p-6 ${className}`}>{children}</div>;
const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = (props) => <button {...props} className={`px-4 py-2 font-semibold rounded-lg transition-colors ${props.className}`}>{props.children}</button>;
const Badge: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${className}`}>{children}</span>;
const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => <select {...props} className={`w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-brand-green focus:border-brand-green ${props.className}`}>{props.children}</select>;
const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => <input {...props} className={`w-full p-2 border border-gray-300 rounded-md focus:ring-brand-green focus:border-brand-green ${props.className}`} />;

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

export const BlogCorner: React.FC<FeatureComponentProps> = ({ setActiveFeature }) => {
  const [blogs] = useState(mockBlogs);
  const [searchQuery, setSearchQuery] = useState("");
  const [blogTypeFilter, setBlogTypeFilter] = useState("all");
  const [mediaTypeFilter, setMediaTypeFilter] = useState("all");
  const [selectedTag, setSelectedTag] = useState("all");

  const allTags = useMemo(() => ["all", ...new Set(blogs.flatMap(blog => blog.tags || []))], [blogs]);

  const filteredBlogs = useMemo(() => blogs.filter((blog) => {
    const matchesSearch =
      blog.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.content?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBlogType = blogTypeFilter === "all" || blog.blog_type === blogTypeFilter;
    const matchesMediaType = mediaTypeFilter === "all" || blog.media_type === mediaTypeFilter;
    const matchesTag = selectedTag === "all" || blog.tags?.includes(selectedTag);
    return matchesSearch && matchesBlogType && matchesMediaType && matchesTag;
  }), [blogs, searchQuery, blogTypeFilter, mediaTypeFilter, selectedTag]);

  const getBlogTypeColor = (type: Blog['blog_type']) => ({
      "success_story": "bg-green-100 text-green-700",
      "tip": "bg-blue-100 text-blue-700",
      "tutorial": "bg-purple-100 text-purple-700",
      "experience": "bg-orange-100 text-orange-700",
  }[type] || "bg-gray-100 text-gray-700");

  const getMediaIcon = (mediaType: Blog['media_type']) => ({
      "image": <ImageIcon className="w-4 h-4" />,
      "video": <Video className="w-4 h-4" />,
      "text": <FileText className="w-4 h-4" />,
  }[mediaType]);

  return (
    <div className="p-4 md:p-6 bg-gray-50 rounded-2xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg">
            <BookOpen className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Blog Corner</h1>
            <p className="text-gray-600">Success stories, tips & farming experiences</p>
          </div>
        </div>
        <Button onClick={() => setActiveFeature && setActiveFeature("CREATE_BLOG")} className="bg-gradient-to-r from-orange-500 to-amber-600 text-white hover:opacity-90">
          <Plus className="w-5 h-5 mr-2" />
          Write Blog
        </Button>
      </div>

      <Card className="mb-6 bg-white">
        <CardContent className="p-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search blogs by title or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Select value={blogTypeFilter} onChange={e => setBlogTypeFilter(e.target.value)}>
              <option value="all">All Types</option>
              <option value="success_story">🏆 Success Stories</option>
              <option value="tip">💡 Tips</option>
              <option value="tutorial">📚 Tutorials</option>
              <option value="experience">✍️ Experiences</option>
            </Select>
            <Select value={mediaTypeFilter} onChange={e => setMediaTypeFilter(e.target.value)}>
              <option value="all">All Media</option>
              <option value="text">📝 Text</option>
              <option value="image">🖼️ Image</option>
              <option value="video">📹 Video</option>
            </Select>
            <Select value={selectedTag} onChange={e => setSelectedTag(e.target.value)}>
              {allTags.map((tag) => <option key={tag} value={tag}>{tag === "all" ? "All Tags" : `🏷️ ${tag}`}</option>)}
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {filteredBlogs.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <BookOpen className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 mb-4">No blogs found matching your criteria.</p>
              <Button onClick={() => setActiveFeature && setActiveFeature("CREATE_BLOG")} className="bg-gradient-to-r from-orange-500 to-amber-600 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Write First Blog
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredBlogs.map((blog) => (
            <Card key={blog.id} className="hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full border-2 border-orange-500 bg-orange-100 text-orange-700 flex items-center justify-center font-bold">{blog.author_avatar_fallback}</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{blog.author_name}</h3>
                      <p className="text-sm text-gray-600 capitalize">{blog.author_type}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={getBlogTypeColor(blog.blog_type)}>{blog.blog_type?.replace("_", " ")}</Badge>
                    <Badge className="bg-gray-100 text-gray-700 flex items-center gap-1">{getMediaIcon(blog.media_type)}{blog.media_type}</Badge>
                  </div>
                </div>
                <CardTitle>{blog.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {blog.media_url && blog.media_type === "image" && <img src={blog.media_url} alt={blog.title} className="w-full h-64 object-cover rounded-xl mb-4" />}
                {blog.media_url && blog.media_type === "video" && <video src={blog.media_url} controls className="w-full rounded-xl mb-4" />}
                <p className="text-gray-700 mb-4 line-clamp-3">{blog.content}</p>
                {blog.tags && blog.tags.length > 0 && <div className="flex flex-wrap gap-2 mb-4">{blog.tags.map((tag, idx) => <Badge key={idx} className="bg-gray-100 text-gray-700">🏷️ {tag}</Badge>)}</div>}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1"><Eye className="w-4 h-4" />{blog.views_count} views</span>
                    <span className="flex items-center gap-1"><Heart className="w-4 h-4" />{blog.likes_count} likes</span>
                  </div>
                  <p className="text-sm text-gray-500">{formatDistanceToNow(blog.created_date)}</p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};