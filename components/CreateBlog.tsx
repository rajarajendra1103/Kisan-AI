import React, { useState } from "react";
import { FeatureComponentProps, Blog as BlogType } from '../types';
import { Loader2, Upload, X } from "lucide-react";

// Local UI components for consistent styling within this file.
const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => <div className={`bg-white rounded-lg shadow-md border ${className}`}>{children}</div>;
const CardHeader: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => <div className={`p-4 border-b ${className}`}>{children}</div>;
const CardTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => <h3 className="font-bold text-lg">{children}</h3>;
const CardContent: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => <div className={`p-4 ${className}`}>{children}</div>;
const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => <input {...props} className={`w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-brand-green focus:border-brand-green ${props.className}`} />;
const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & {variant?: string, size?: string}> = (props) => <button {...props} className={`px-4 py-2 font-semibold rounded-lg transition-colors ${props.className}`}>{props.children}</button>;
const Label: React.FC<{ children: React.ReactNode, htmlFor?: string }> = ({ children, htmlFor }) => <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1">{children}</label>;
const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => <textarea {...props} className={`w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-brand-green focus:border-brand-green ${props.className}`} />;
const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => <select {...props} className={`w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-brand-green focus:border-brand-green appearance-none ${props.className}`}>{props.children}</select>;
const Badge: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => <span className={`px-2.5 py-1 text-xs font-semibold rounded-full inline-flex items-center ${className}`}>{children}</span>;

// Mock services to simulate backend operations
const mockUploadFile = async ({ file }: { file: File }): Promise<{ file_url: string }> => {
  console.log(`Uploading file: ${file.name}`);
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { file_url: URL.createObjectURL(file) };
};

const mockBlogCreate = async (data: Partial<BlogType>) => {
  console.log("Creating blog with data:", data);
  await new Promise(resolve => setTimeout(resolve, 500));
  return { ...data, id: `blog_${Date.now()}` };
}

export const CreateBlog: React.FC<FeatureComponentProps> = ({ setActiveFeature, currentUser }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    blog_type: "experience" as BlogType['blog_type'],
    media_type: "text" as BlogType['media_type'],
    media_url: "",
    tags: [] as string[],
    language: "english",
  });
  const [currentTag, setCurrentTag] = useState("");

  const commonTags = ["wheat", "rice", "organic", "irrigation", "pests", "sustainability", "success", "tips"];

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingMedia(true);
    try {
      const { file_url } = await mockUploadFile({ file });
      const mediaType = file.type.startsWith("video") ? "video" : "image";
      setFormData({ ...formData, media_url: file_url, media_type: mediaType });
    } catch (error) {
      console.error("Error uploading media:", error);
    }
    setIsUploadingMedia(false);
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, currentTag.trim()] });
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((tag) => tag !== tagToRemove) });
  };

  const addCommonTag = (tag: string) => {
    if (!formData.tags.includes(tag)) {
      setFormData({ ...formData, tags: [...formData.tags, tag] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
        alert("Please log in to create a blog post.");
        return;
    }
    setIsSubmitting(true);

    try {
      await mockBlogCreate({
        ...formData,
        author_id: currentUser.id,
        author_name: currentUser.full_name,
        author_type: currentUser.user_type || "farmer",
      });

      alert("Blog published successfully! (Mocked)");
      if (setActiveFeature) {
        setActiveFeature("BLOG_CORNER");
      }
    } catch (error) {
      console.error("Error creating blog:", error);
    }

    setIsSubmitting(false);
  };

  return (
    <div className="p-4 md:p-6 bg-white rounded-2xl shadow-lg">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">✍️ Write a Blog</h1>
          <p className="text-gray-600">Share your farming knowledge and experiences</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="shadow-xl bg-white border-2 border-gray-100">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-gray-100">
              <CardTitle>Blog Details</CardTitle>
            </CardHeader>
            <CardContent className="p-6 bg-white space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Blog Type *</Label>
                  <Select
                    value={formData.blog_type}
                    onChange={(e) => setFormData({ ...formData, blog_type: e.target.value as BlogType['blog_type'] })}
                  >
                    <option value="success_story">🏆 Success Story</option>
                    <option value="tip">💡 Farming Tip</option>
                    <option value="tutorial">📚 Tutorial</option>
                    <option value="experience">✍️ Experience</option>
                  </Select>
                </div>
                <div>
                  <Label>Language</Label>
                  <Select
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  >
                    <option value="english">English</option>
                    <option value="hindi">Hindi</option>
                    <option value="punjabi">Punjabi</option>
                    <option value="tamil">Tamil</option>
                    <option value="telugu">Telugu</option>
                    <option value="kannada">Kannada</option>
                    <option value="marathi">Marathi</option>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Blog Title *</Label>
                <Input
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., How I Doubled My Wheat Yield..."
                />
              </div>
              <div>
                <Label>Content *</Label>
                <Textarea
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write your blog content here..."
                  rows={8}
                  className="resize-none"
                />
              </div>
              <div>
                <Label>Media (Optional)</Label>
                <div className="mt-2">
                  <label className="cursor-pointer">
                    <input type="file" accept="image/*,video/*" onChange={handleMediaUpload} className="hidden" disabled={isUploadingMedia} />
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-500 transition-colors bg-white">
                      {isUploadingMedia ? <Loader2 className="w-8 h-8 animate-spin mx-auto text-orange-600" />
                       : formData.media_url ? (
                        <div className="relative">
                          {formData.media_type === "image" ? <img src={formData.media_url} alt="Blog media" className="w-full h-48 object-cover rounded-lg" />
                           : <video src={formData.media_url} controls className="w-full h-48 rounded-lg" />}
                          <button type="button" onClick={() => setFormData({ ...formData, media_url: "", media_type: "text" })} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <><Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" /><p className="text-sm text-gray-600">Click to upload image or video</p></>
                      )}
                    </div>
                  </label>
                </div>
              </div>
              <div>
                <Label>Tags (for easy discovery)</Label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input value={currentTag} onChange={(e) => setCurrentTag(e.target.value)} onKeyPress={(e) => {if(e.key === "Enter"){e.preventDefault(); addTag()}}} placeholder="Add custom tag..." />
                    <Button type="button" onClick={addTag} variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">Add</Button>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Common Tags:</p>
                    <div className="flex flex-wrap gap-2">
                      {commonTags.map((tag) => (
                        <button key={tag} type="button" onClick={() => addCommonTag(tag)} className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-full hover:bg-orange-50 hover:border-orange-500 transition-colors" disabled={formData.tags.includes(tag)}>
                          🏷️ {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                  {formData.tags.length > 0 && <div className="flex flex-wrap gap-2">{formData.tags.map((tag) => (<Badge key={tag} className="bg-orange-100 text-orange-700">{tag}<button type="button" onClick={() => removeTag(tag)} className="ml-2 hover:text-orange-900"><X className="w-3 h-3" /></button></Badge>))}</div>}
                </div>
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-orange-500 to-amber-600 text-white hover:opacity-90 disabled:opacity-50" size="lg">
                {isSubmitting ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Publishing...</> : "Publish Blog"}
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
};