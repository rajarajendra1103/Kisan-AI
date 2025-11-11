import React, { useState, useEffect } from "react";
import { FeatureComponentProps, MockUser, Notification, QuoteRequest } from '../types';
import { Loader2, FileText } from "lucide-react";

// Local mock data stores
const mockUsers: MockUser[] = [
    { id: 'user_4', full_name: 'Rohan Gupta', initials: 'RG', user_type: 'shop_owner', location: 'Mumbai', state: 'Maharashtra' },
    { id: 'user_6', full_name: 'Vikram Singh', initials: 'VS', user_type: 'shop_owner', location: 'Ludhiana', state: 'Punjab' },
];
const mockQuoteRequests: QuoteRequest[] = [];
const mockNotifications: Notification[] = [];

// Local UI components for styling consistency
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
const Label: React.FC<{ children: React.ReactNode, htmlFor?: string }> = ({ children, htmlFor }) => <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1">{children}</label>;
const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => <textarea {...props} className={`w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-brand-green focus:border-brand-green ${props.className}`} />;
const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => <select {...props} className={`w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-brand-green focus:border-brand-green appearance-none ${props.className}`}>{props.children}</select>;


export const RequestQuote: React.FC<FeatureComponentProps> = ({ setActiveFeature, currentUser }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    product_category: "seeds" as QuoteRequest['product_category'],
    product_description: "",
    quantity_needed: "",
    budget_range: "",
    location: "",
    contact_number: "",
    needed_by_date: ""
  });

  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        location: `${currentUser.location}, ${currentUser.state}` || "",
        contact_number: currentUser.phone_number || ""
      }));
    }
  }, [currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return alert("Please log in to request a quote.");
    setIsSubmitting(true);

    try {
      const quoteRequest: QuoteRequest = {
        id: `qr_${Date.now()}`,
        ...formData,
        farmer_id: currentUser.id,
        farmer_name: currentUser.full_name,
        status: "open",
        quotes_received: 0,
        created_date: new Date().toISOString()
      };
      
      mockQuoteRequests.push(quoteRequest);
      
      const shopOwners = mockUsers.filter(u => u.user_type === "shop_owner" && u.state === currentUser.state);

      shopOwners.forEach(shopOwner => {
        const newNotification: Notification = {
          id: `notif_${Date.now()}_${shopOwner.id}`,
          user_id: shopOwner.id,
          title: "💼 New Quote Request",
          message: `${currentUser.full_name} is looking for ${formData.product_category} - ${formData.quantity_needed}`,
          type: "quote",
          related_id: quoteRequest.id,
          action_url: "QUOTE_REQUESTS",
          is_read: false,
          created_date: new Date().toISOString()
        };
        mockNotifications.push(newNotification);
        console.log("Notification created for shop owner:", newNotification);
      });

      await new Promise(resolve => setTimeout(resolve, 1000));

      alert("✅ Quote request submitted! Nearby shop owners have been notified.");
      if (setActiveFeature) {
        setActiveFeature("MY_QUOTE_REQUESTS");
      }
    } catch (error) {
      console.error("Error creating quote request:", error);
    }

    setIsSubmitting(false);
  };

  return (
    <div className="p-4 md:p-6 bg-white rounded-2xl shadow-lg">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">📝 Request Quote</h1>
          <p className="text-gray-600">Get quotes from nearby agricultural shops</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader><CardTitle>Quote Request Details</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Product Category *</Label>
                <Select value={formData.product_category} onChange={(e) => setFormData({ ...formData, product_category: e.target.value as QuoteRequest['product_category'] })}>
                  <option value="seeds">🌱 Seeds</option>
                  <option value="fertilizer">🧪 Fertilizer</option>
                  <option value="pesticide">🦟 Pesticide</option>
                  <option value="equipment">🚜 Equipment</option>
                  <option value="other">📦 Other</option>
                </Select>
              </div>
              <div>
                <Label>Product Description *</Label>
                <Textarea required value={formData.product_description} onChange={(e) => setFormData({ ...formData, product_description: e.target.value })} placeholder="Describe what you need in detail... (e.g., Organic wheat seeds, disease-resistant variety)" rows={4} />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div><Label>Quantity Needed *</Label><Input required value={formData.quantity_needed} onChange={(e) => setFormData({ ...formData, quantity_needed: e.target.value })} placeholder="e.g., 50 kg, 10 liters" /></div>
                <div><Label>Budget Range (₹)</Label><Input value={formData.budget_range} onChange={(e) => setFormData({ ...formData, budget_range: e.target.value })} placeholder="e.g., 5000-10000" /></div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div><Label>Your Location *</Label><Input required value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="Your village/town" /></div>
                <div><Label>Contact Number *</Label><Input required value={formData.contact_number} onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })} placeholder="+91 XXXXXXXXXX" /></div>
              </div>
              <div><Label>Needed By Date (Optional)</Label><Input type="date" value={formData.needed_by_date} onChange={(e) => setFormData({ ...formData, needed_by_date: e.target.value })} /></div>
              <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200"><p className="text-sm text-blue-900"><strong>💡 Tip:</strong> Be specific about your requirements to get accurate quotes from shop owners. They will contact you directly with their pricing and availability.</p></div>
              <Button type="submit" disabled={isSubmitting} className="w-full bg-brand-green hover:bg-emerald-700 text-white disabled:bg-gray-400" size="lg">
                {isSubmitting ? (<><Loader2 className="w-5 h-5 mr-2 animate-spin" />Submitting...</>) : (<><FileText className="w-5 h-5 mr-2" />Submit Quote Request</>)}
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
};
