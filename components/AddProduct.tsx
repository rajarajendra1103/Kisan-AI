import React, { useState, useEffect } from "react";
import { FeatureComponentProps, Product } from '../types';
import { mockProducts } from './Products';
import { Loader2, Upload, X, Plus, Percent } from "lucide-react";

// Local UI components for consistent styling.
const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => <div className={`bg-white rounded-lg shadow-md border ${className}`}>{children}</div>;
const CardHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => <div className="p-4 border-b">{children}</div>;
const CardTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => <h3 className="font-bold text-lg">{children}</h3>;
const CardContent: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => <div className={`p-4 ${className}`}>{children}</div>;
const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => <input {...props} className={`w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-brand-green focus:border-brand-green ${props.className}`} />;
const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { size?: string }> = (props) => {
    const { size, ...rest } = props;
    const sizeClasses = size === 'lg' ? 'py-3 text-base' : 'py-2 text-sm';
    return <button {...rest} className={`px-4 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 ${sizeClasses} ${props.className}`}>{props.children}</button>
};
const Label: React.FC<{ children: React.ReactNode, htmlFor?: string } & React.LabelHTMLAttributes<HTMLLabelElement>> = ({ children, htmlFor, ...props }) => <label htmlFor={htmlFor} {...props} className={`block text-sm font-medium text-gray-700 mb-1 ${props.className}`}>{children}</label>;
const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => <textarea {...props} className={`w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-brand-green focus:border-brand-green ${props.className}`} />;
const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => <select {...props} className={`w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-brand-green focus:border-brand-green appearance-none ${props.className}`}>{props.children}</select>;

// Mock services
const mockUploadFile = async ({ file }: { file: File }): Promise<{ file_url: string }> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { file_url: URL.createObjectURL(file) };
};

export const AddProduct: React.FC<FeatureComponentProps> = ({ setActiveFeature, currentUser }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [formData, setFormData] = useState({
    product_name: "",
    description: "",
    category: "seeds" as Product['category'],
    price: "",
    unit: "kg",
    stock_quantity: "",
    images: [] as string[],
    location: "",
    contact_number: "",
    promotion_active: false,
    promotion_discount: "",
    promotion_ends: "",
    consultation_duration: ""
  });

  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        location: `${currentUser.location}, ${currentUser.state}` || "",
        contact_number: currentUser.phone_number || "",
        category: currentUser.user_type === "guide" ? "consultation" : "seeds",
        unit: currentUser.user_type === "guide" ? "session" : "kg"
      }));
    }
  }, [currentUser]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (files.length === 0) return;
    setIsUploadingImages(true);

    try {
      const uploadPromises = files.map(file => mockUploadFile({ file }));
      const results = await Promise.all(uploadPromises);
      const imageUrls = results.map(result => result.file_url);
      setFormData(prev => ({...prev, images: [...prev.images, ...imageUrls]}));
    } catch (error) {
      console.error("Error uploading images:", error);
    }
    setIsUploadingImages(false);
  };

  const removeImage = (indexToRemove: number) => {
    setFormData(prev => ({...prev, images: prev.images.filter((_, index) => index !== indexToRemove)}));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return alert("You must be logged in to list a product.");
    setIsSubmitting(true);

    const newProduct: Product = {
      id: `prod_${Date.now()}`,
      product_name: formData.product_name,
      description: formData.description,
      category: formData.category,
      price: parseFloat(formData.price),
      unit: formData.unit,
      stock_quantity: formData.stock_quantity ? parseFloat(formData.stock_quantity) : undefined,
      images: formData.images,
      location: formData.location,
      contact_number: formData.contact_number,
      promotion_active: formData.promotion_active,
      promotion_discount: formData.promotion_discount ? parseFloat(formData.promotion_discount) : undefined,
      promotion_ends: formData.promotion_ends,
      consultation_duration: formData.consultation_duration ? parseFloat(formData.consultation_duration) : undefined,
      seller_id: currentUser.id,
      seller_name: currentUser.full_name,
      seller_type: currentUser.user_type,
      in_stock: formData.category === 'consultation' ? true : (formData.stock_quantity ? parseFloat(formData.stock_quantity) > 0 : false),
      created_date: new Date().toISOString(),
    };
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    mockProducts.unshift(newProduct);
    
    setIsSubmitting(false);
    alert("Product listed successfully!");
    if (setActiveFeature) setActiveFeature("MY_PRODUCTS");
  };

  return (
    <div className="p-4 md:p-6 bg-white rounded-2xl shadow-lg">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {currentUser?.user_type === "guide" ? "📋 Add Consultation Service" : "📦 Add Product"}
          </h1>
          <p className="text-gray-600">Fill in the details to list your {currentUser?.user_type === "guide" ? "service" : "product"}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader><CardTitle>Product Details</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div><Label>Product Name *</Label><Input required value={formData.product_name} onChange={(e) => setFormData({ ...formData, product_name: e.target.value })} placeholder={currentUser?.user_type === "guide" ? "e.g., Crop Disease Consultation" : "e.g., Organic Wheat Seeds"}/></div>
              <div><Label>Description *</Label><Textarea required value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Detailed description..." rows={4}/></div>
              <div className="grid md:grid-cols-2 gap-4">
                <div><Label>Category *</Label><Select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value as Product['category'], unit: e.target.value === "consultation" ? "session" : "kg" })}>{currentUser?.user_type === "guide" && <option value="consultation">👨‍🏫 Consultation</option>}<option value="seeds">🌱 Seeds</option><option value="fertilizer">🧪 Fertilizer</option><option value="pesticide">🦟 Pesticide</option><option value="equipment">🚜 Equipment</option><option value="produce">🌾 Produce</option><option value="other">📦 Other</option></Select></div>
                <div><Label>Price (₹) *</Label><Input type="number" required value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} placeholder="Enter price"/></div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {formData.category === "consultation" ? (<div><Label>Session Duration (minutes)</Label><Input type="number" value={formData.consultation_duration} onChange={(e) => setFormData({ ...formData, consultation_duration: e.target.value })} placeholder="e.g., 60"/></div>) : (<><div><Label>Unit</Label><Select value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })}><option value="kg">Per Kg</option><option value="liter">Per Liter</option><option value="bag">Per Bag</option><option value="piece">Per Piece</option><option value="acre">Per Acre</option></Select></div><div><Label>Stock Quantity</Label><Input type="number" value={formData.stock_quantity} onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })} placeholder="Available quantity"/></div></>)}
              </div>
              <div className="bg-orange-50 rounded-lg p-4 space-y-4 border-2 border-orange-200">
                <div className="flex items-center gap-2"><input type="checkbox" id="promotion" checked={formData.promotion_active} onChange={(e) => setFormData({ ...formData, promotion_active: e.target.checked })} className="w-4 h-4 text-orange-600 focus:ring-orange-500"/><Label htmlFor="promotion" className="text-orange-900 font-semibold flex items-center gap-1"><Percent className="w-4 h-4 inline"/>Add Promotional Discount</Label></div>
                {formData.promotion_active && (<div className="grid md:grid-cols-2 gap-4"><div><Label>Discount (%)</Label><Input type="number" min="1" max="99" value={formData.promotion_discount} onChange={(e) => setFormData({ ...formData, promotion_discount: e.target.value })} placeholder="e.g., 20"/></div><div><Label>Promotion Ends</Label><Input type="date" value={formData.promotion_ends} onChange={(e) => setFormData({ ...formData, promotion_ends: e.target.value })}/></div></div>)}
              </div>
              <div><Label>Product Images</Label><div className="mt-2"><label className="cursor-pointer"><input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" disabled={isUploadingImages}/><div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-brand-green transition-colors">{isUploadingImages ? <Loader2 className="w-8 h-8 animate-spin mx-auto text-brand-green"/> : <><Upload className="w-8 h-8 mx-auto text-gray-400 mb-2"/><p className="text-sm text-gray-600">Click to upload images</p></>}</div></label>{formData.images.length > 0 && <div className="grid grid-cols-3 gap-3 mt-4">{formData.images.map((img, index) => (<div key={index} className="relative group"><img src={img} alt={`Product ${index + 1}`} className="w-full h-24 object-cover rounded-lg"/><button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-3 h-3"/></button></div>))}</div>}</div></div>
              <div className="grid md:grid-cols-2 gap-4"><div><Label>Location *</Label><Input required value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="Your location"/></div><div><Label>Contact Number *</Label><Input required value={formData.contact_number} onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })} placeholder="+91 XXXXXXXXXX"/></div></div>
              <Button type="submit" disabled={isSubmitting} className="w-full bg-brand-green hover:bg-emerald-700 text-white disabled:bg-gray-400" size="lg">{isSubmitting ? <><Loader2 className="w-5 h-5 mr-2 animate-spin"/>Listing...</> : <><Plus className="w-5 h-5 mr-2"/>List {currentUser?.user_type === "guide" ? "Service" : "Product"}</>}</Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
};