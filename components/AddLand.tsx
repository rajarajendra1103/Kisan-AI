import React, { useState } from "react";
import { FeatureComponentProps } from '../types';
import { Loader2, Upload, X, MapPin } from "lucide-react";

// Mock Service for file upload
const mockUploadFile = async ({ file }: { file: File }): Promise<{ file_url: string }> => {
    console.log(`Uploading file: ${file.name}`);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate upload time
    return { file_url: URL.createObjectURL(file) }; // Use local URL for preview
};

// Assuming UI components are globally available or styled with Tailwind
const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => <div className={`bg-white rounded-lg shadow-md border ${className}`}>{children}</div>;
const CardHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => <div className="p-4 border-b">{children}</div>;
const CardTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => <h3 className="font-bold text-lg">{children}</h3>;
const CardContent: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => <div className={`p-4 ${className}`}>{children}</div>;
const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => <input {...props} className={`w-full p-2 border border-gray-300 rounded-md focus:ring-brand-green focus:border-brand-green ${props.className}`} />;
const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & {variant?: string, size?: string}> = (props) => {
    const { variant, size, ...rest } = props;
    return <button {...rest} className={`px-4 py-2 font-semibold rounded-md transition-colors ${props.className}`}>{props.children}</button>
};
const Label: React.FC<{ children: React.ReactNode, htmlFor?: string }> = ({ children, htmlFor }) => <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1">{children}</label>;
const Select: React.FC<{ children: React.ReactNode, value: string, onValueChange: (value: string) => void }> = ({ children, value, onValueChange }) => <div className="relative"><select value={value} onChange={(e) => onValueChange(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md appearance-none pr-8 bg-white">{children}</select><div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"><svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg></div></div>;
const SelectItem: React.FC<{ children: React.ReactNode, value: string }> = ({ children, value }) => <option value={value}>{children}</option>;


export const AddLand: React.FC<FeatureComponentProps> = ({ setActiveFeature, currentUser }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [formData, setFormData] = useState({
    land_size_acres: "",
    lease_cost_per_acre: "",
    location: "",
    village: "",
    district: "",
    state: "",
    soil_type: "loam",
    soil_ph: "",
    irrigation_available: false,
    irrigation_type: "",
    images: [] as string[],
    gps_coordinates: "",
    contact_number: "",
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
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

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = `${position.coords.latitude},${position.coords.longitude}`;
          setFormData(prev => ({ ...prev, gps_coordinates: coords }));
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Could not get location. Please enable location services.");
        }
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
        alert("You must be logged in to list land.");
        return;
    }
    setIsSubmitting(true);

    try {
        console.log("Creating land listing with data:", {
            ...formData,
            owner_id: currentUser.id,
            owner_name: currentUser.full_name,
            land_size_acres: parseFloat(formData.land_size_acres),
            lease_cost_per_acre: parseFloat(formData.lease_cost_per_acre),
            soil_ph: formData.soil_ph ? parseFloat(formData.soil_ph) : undefined,
            available: true,
        });
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        alert("Land listed successfully! (Mocked)");
        if (setActiveFeature) {
            setActiveFeature("LAND_LISTINGS");
        }
    } catch (error) {
      console.error("Error creating land listing:", error);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="p-4 md:p-6 bg-white rounded-2xl shadow-lg">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🌾 List Your Land</h1>
        <p className="text-gray-600">Fill in the details to list your land for lease</p>
      </div>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader><CardTitle>Land Details</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div><Label>Land Size (acres) *</Label><Input type="number" step="0.01" required value={formData.land_size_acres} onChange={(e) => setFormData({ ...formData, land_size_acres: e.target.value })} placeholder="e.g., 5.5" /></div>
              <div><Label>Lease Cost per Acre per Year (₹) *</Label><Input type="number" required value={formData.lease_cost_per_acre} onChange={(e) => setFormData({ ...formData, lease_cost_per_acre: e.target.value })} placeholder="e.g., 50000" /></div>
            </div>
            <div className="space-y-4">
              <div><Label>Location/Area Name *</Label><Input required value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="e.g., Near Highway 44" /></div>
              <div className="grid md:grid-cols-3 gap-4">
                <div><Label>Village *</Label><Input required value={formData.village} onChange={(e) => setFormData({ ...formData, village: e.target.value })} /></div>
                <div><Label>District *</Label><Input required value={formData.district} onChange={(e) => setFormData({ ...formData, district: e.target.value })} /></div>
                <div><Label>State *</Label><Input required value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} /></div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div><Label>Soil Type *</Label><Select value={formData.soil_type} onValueChange={(value) => setFormData({ ...formData, soil_type: value as any })}><SelectItem value="sandy">Sandy</SelectItem><SelectItem value="clay">Clay</SelectItem><SelectItem value="loam">Loam</SelectItem><SelectItem value="silt">Silt</SelectItem><SelectItem value="red">Red</SelectItem><SelectItem value="black">Black</SelectItem><SelectItem value="alluvial">Alluvial</SelectItem></Select></div>
              <div><Label>Soil pH (optional)</Label><Input type="number" step="0.1" min="0" max="14" value={formData.soil_ph} onChange={(e) => setFormData({ ...formData, soil_ph: e.target.value })} placeholder="e.g., 6.5" /></div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2"><input type="checkbox" id="irrigation" checked={formData.irrigation_available} onChange={(e) => setFormData({ ...formData, irrigation_available: e.target.checked })} className="w-4 h-4 text-brand-green" /><Label htmlFor="irrigation">Irrigation Available</Label></div>
              {formData.irrigation_available && <Input placeholder="Type of irrigation (e.g., Drip, Sprinkler, Canal)" value={formData.irrigation_type} onChange={(e) => setFormData({ ...formData, irrigation_type: e.target.value })} />}
            </div>
            <div>
              <Label>Land Images</Label>
              <div className="mt-2">
                <label className="cursor-pointer"><input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" disabled={isUploadingImages} /><div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-brand-green transition-colors">{isUploadingImages ? <Loader2 className="w-8 h-8 animate-spin mx-auto text-brand-green" /> : <><Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" /><p className="text-sm text-gray-600">Click to upload land images</p></>}</div></label>
                {formData.images.length > 0 && <div className="grid grid-cols-3 gap-3 mt-4">{formData.images.map((img, index) => (<div key={index} className="relative group"><img src={img} alt={`Land ${index + 1}`} className="w-full h-24 object-cover rounded-lg" /><button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-3 h-3" /></button></div>))}</div>}
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div><Label>GPS Coordinates</Label><div className="flex gap-2"><Input value={formData.gps_coordinates} onChange={(e) => setFormData({ ...formData, gps_coordinates: e.target.value })} placeholder="lat,long" /><Button type="button" variant="outline" onClick={getCurrentLocation} className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"><MapPin className="w-4 h-4" /></Button></div></div>
              <div><Label>Contact Number *</Label><Input required value={formData.contact_number} onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })} placeholder="+91 XXXXXXXXXX" /></div>
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full bg-brand-green hover:bg-emerald-700 text-white" size="lg">{isSubmitting ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Listing...</> : "List Your Land"}</Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};