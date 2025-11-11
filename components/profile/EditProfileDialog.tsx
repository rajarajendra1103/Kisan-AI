import React, { useState, useEffect } from 'react';
import { X, Loader2, Upload } from 'lucide-react';
import { MockUser } from '../../types';

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUser: MockUser | null;
  onUpdate: (updatedData: Partial<MockUser>) => void;
}

export const EditProfileDialog: React.FC<EditProfileDialogProps> = ({ open, onOpenChange, currentUser, onUpdate }) => {
    const [formData, setFormData] = useState<Partial<MockUser>>({});
    
    useEffect(() => {
        if (currentUser) {
            setFormData({
                full_name: currentUser.full_name || "",
                profile_image: currentUser.profile_image || "",
                user_type: currentUser.user_type || "farmer",
                phone_number: currentUser.phone_number || "",
                location: currentUser.location || "",
                state: currentUser.state || "",
                farm_size_acres: currentUser.farm_size_acres || 0,
                preferred_language: currentUser.preferred_language || "english",
            });
        }
    }, [currentUser, open]);
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
    
        setIsUploading(true);
        try {
            // Simulate API call for upload
            await new Promise(resolve => setTimeout(resolve, 1000));
            const fileUrl = URL.createObjectURL(file);
            setFormData(prev => ({...prev, profile_image: fileUrl}));
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("Failed to upload image.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        onUpdate(formData);
        setIsSubmitting(false);
        onOpenChange(false);
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'farm_size_acres' ? parseFloat(value) || 0 : value }));
    }

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => onOpenChange(false)}>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="font-bold text-lg text-gray-800">Edit Profile</h2>
                    <button onClick={() => onOpenChange(false)} className="p-2 rounded-full hover:bg-gray-100">
                        <X size={20} className="text-gray-600"/>
                    </button>
                </div>

                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto scrollbar-hide">
                    {/* Profile Picture Uploader */}
                    <div className="flex justify-center">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-200">
                                {formData.profile_image ? (
                                    <img src={formData.profile_image} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-3xl font-semibold text-gray-500">{currentUser?.initials}</span>
                                )}
                                {isUploading && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                                    </div>
                                )}
                            </div>
                            <label htmlFor="profile-image-upload" className="absolute -bottom-1 -right-1 bg-brand-green text-white rounded-full p-2 cursor-pointer hover:bg-emerald-700 shadow-md transition-transform hover:scale-110">
                              <Upload size={16} />
                              <input id="profile-image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input type="text" name="full_name" value={formData.full_name} onChange={handleInputChange} placeholder="e.g. Sanjay Kumar" className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-green focus:border-brand-green" />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">User Type</label>
                        <select name="user_type" value={formData.user_type} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-green focus:border-brand-green">
                            <option value="farmer">👨‍🌾 Farmer</option>
                            <option value="guide">👨‍🏫 Agricultural Guide</option>
                            <option value="shop_owner">🏪 Shop Owner</option>
                            <option value="customer">👤 Customer</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input type="text" name="phone_number" value={formData.phone_number} onChange={handleInputChange} placeholder="+91 XXXXXXXXXX" className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-green focus:border-brand-green" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location (City/Village)</label>
                        <input type="text" name="location" value={formData.location} onChange={handleInputChange} placeholder="e.g. Pune" className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-green focus:border-brand-green" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                        <input type="text" name="state" value={formData.state} onChange={handleInputChange} placeholder="e.g. Maharashtra" className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-green focus:border-brand-green" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Farm Size (Acres)</label>
                        <input type="number" name="farm_size_acres" value={formData.farm_size_acres} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-green focus:border-brand-green" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Language</label>
                        <select name="preferred_language" value={formData.preferred_language} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-green focus:border-brand-green">
                            <option value="english">English</option>
                            <option value="hindi">Hindi</option>
                            <option value="punjabi">Punjabi</option>
                            <option value="tamil">Tamil</option>
                            <option value="telugu">Telugu</option>
                            <option value="kannada">Kannada</option>
                            <option value="marathi">Marathi</option>
                        </select>
                    </div>
                </div>

                <div className="p-4 border-t bg-gray-50 rounded-b-2xl">
                    <button onClick={handleSubmit} disabled={isSubmitting} className="w-full flex justify-center items-center px-6 py-2.5 bg-brand-green text-white font-semibold rounded-lg disabled:bg-gray-400 hover:bg-emerald-700 transition-colors">
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            "Save Changes"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};