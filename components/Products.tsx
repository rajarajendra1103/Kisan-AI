import React, { useState, useEffect, useMemo } from "react";
import { FeatureComponentProps, Product, MockUser, Order, Notification } from '../types';
import { 
  Search, Plus, ShoppingCart, Phone, MapPin, TrendingUp, Video, FileText, Percent, X 
} from "lucide-react";

// --- MOCK DATA & SERVICES ---
export const mockProducts: Product[] = [
    { id: 'prod_1', product_name: 'Organic Wheat Seeds', description: 'High-yield, disease-resistant organic wheat seeds suitable for Punjab region.', category: 'seeds', price: 150, unit: 'kg', seller_id: 'user_4', seller_name: 'Rohan Gupta', seller_type: 'shop_owner', in_stock: true, stock_quantity: 500, images: ['https://images.unsplash.com/photo-1507633698035-83f6114a85f3?q=80&w=2070&auto=format&fit=crop'], location: 'Mumbai, Maharashtra', contact_number: '+91 9876543211', orders_count: 25, promotion_active: true, promotion_discount: 10, created_date: new Date().toISOString() },
    { id: 'prod_2', product_name: 'Expert Consultation', description: 'One-hour video consultation with an agricultural expert on crop planning and management.', category: 'consultation', price: 2000, unit: 'session', seller_id: 'user_3', seller_name: 'Priya Patel', seller_type: 'guide', in_stock: true, location: 'Ahmedabad, Gujarat', contact_number: '+91 9876543212', orders_count: 12, consultation_duration: 60, created_date: new Date().toISOString() },
    { id: 'prod_3', product_name: 'Fresh Farm Tomatoes', description: 'Plump and juicy tomatoes, freshly harvested from our farm.', category: 'produce', price: 40, unit: 'kg', seller_id: 'user_2', seller_name: 'Aarav Sharma', seller_type: 'farmer', in_stock: true, stock_quantity: 150, images: ['https://images.unsplash.com/photo-1561138241-9c3b8a1c93a4?q=80&w=1974&auto=format&fit=crop'], location: 'Jaipur, Rajasthan', contact_number: '+91 9876543213', orders_count: 40, created_date: new Date().toISOString() }
];
let mockOrders: Order[] = [];
let mockNotifications: Notification[] = [];
// --- END MOCK DATA ---


// --- UI COMPONENTS ---
const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => <div className={`bg-white rounded-lg shadow-md border ${className}`}>{children}</div>;
const CardHeader: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => <div className={`p-4 ${className}`}>{children}</div>;
const CardTitle: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => <h3 className={`font-bold text-lg ${className}`}>{children}</h3>;
const CardContent: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => <div className={`p-4 ${className}`}>{children}</div>;
const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & {variant?: string, size?:string}> = (props) => <button {...props} className={`px-4 py-2 font-semibold rounded-md transition-colors flex items-center justify-center gap-2 ${props.className}`}>{props.children}</button>;
const Badge: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => <span className={`px-2 py-1 text-xs font-semibold rounded-full ${className}`}>{children}</span>;
const Select: React.FC<{ children: React.ReactNode, value: string, onValueChange: (value: string) => void }> = ({ children, value, onValueChange }) => <div className="relative"><select value={value} onChange={(e) => onValueChange(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md appearance-none pr-8 bg-white text-sm">{children}</select><div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"><svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg></div></div>;
const SelectItem: React.FC<{ children: React.ReactNode, value: string }> = ({ children, value }) => <option value={value}>{children}</option>;
const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => <input {...props} className={`w-full p-2 border border-gray-300 rounded-md focus:ring-brand-green focus:border-brand-green ${props.className}`} />;
const Dialog: React.FC<{open: boolean, onOpenChange: (open: boolean) => void, children: React.ReactNode}> = ({open, onOpenChange, children}) => {
    if (!open) return null;
    return <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => onOpenChange(false)}><div onClick={e => e.stopPropagation()}>{children}</div></div>
};
const DialogContent: React.FC<{children: React.ReactNode, className?: string}> = ({children, className}) => <div className={`bg-white rounded-lg shadow-xl w-full max-w-lg ${className}`}>{children}</div>;
const DialogHeader: React.FC<{children: React.ReactNode}> = ({children}) => <div className="p-4 border-b flex items-center justify-between">{children}</div>;
const DialogTitle: React.FC<{children: React.ReactNode}> = ({children}) => <h2 className="font-bold text-lg">{children}</h2>;
const Label: React.FC<{ children: React.ReactNode, htmlFor?: string }> = ({ children, htmlFor }) => <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1">{children}</label>;
// --- END UI COMPONENTS ---

export const Products: React.FC<FeatureComponentProps> = ({ setActiveFeature, currentUser }) => {
  const [products, setProducts] = useState(mockProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sellerTypeFilter, setSellerTypeFilter] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [orderForm, setOrderForm] = useState({ quantity: 1, delivery_address: "", contact_number: "", notes: "" });

  useEffect(() => {
    if (currentUser) {
        setOrderForm(prev => ({ ...prev, delivery_address: `${currentUser.location}, ${currentUser.state}`, contact_number: currentUser.phone_number || '' }));
    }
  }, [currentUser]);

  const filteredProducts = useMemo(() => products.filter(product => {
    const matchesSearch = product.product_name?.toLowerCase().includes(searchQuery.toLowerCase()) || product.description?.toLowerCase().includes(searchQuery.toLowerCase()) || product.seller_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    const matchesSeller = sellerTypeFilter === "all" || product.seller_type === sellerTypeFilter;
    return matchesSearch && matchesCategory && matchesSeller && product.in_stock;
  }), [products, searchQuery, categoryFilter, sellerTypeFilter]);

  const openOrderDialog = (product: Product) => {
    setSelectedProduct(product);
    setShowOrderDialog(true);
  };
  
  const getDiscountedPrice = (product: Product) => (product.promotion_active ? product.price * (1 - (product.promotion_discount ?? 0) / 100) : product.price);

  const handleOrder = async () => {
    if (!orderForm.quantity || !orderForm.delivery_address || !orderForm.contact_number || !selectedProduct || !currentUser) return alert("Please fill all required fields");
    
    const totalPrice = getDiscountedPrice(selectedProduct) * orderForm.quantity;
    
    // Mock creating order and notification
    console.log("Creating order:", { product_id: selectedProduct.id, buyer_id: currentUser.id, quantity: orderForm.quantity, total_price: totalPrice });
    console.log("Creating notification for seller:", selectedProduct.seller_id);

    // Mock updating product stock
    const updatedProducts = products.map(p => p.id === selectedProduct.id ? {...p, stock_quantity: Math.max(0, (p.stock_quantity || 0) - orderForm.quantity), orders_count: (p.orders_count || 0) + 1} : p);
    setProducts(updatedProducts);

    alert("🎉 Order placed successfully! The seller will contact you soon. (Mocked)");
    setShowOrderDialog(false);
  };
  
  const getCategoryIcon = (category: Product['category']) => ({ seeds: "🌱", fertilizer: "🧪", pesticide: "🦟", equipment: "🚜", produce: "🌾", consultation: "👨‍🏫", other: "📦" }[category] || "📦");

  return (
    <div className="bg-white rounded-2xl shadow-lg">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center mb-4">
            <div><h1 className="text-3xl font-bold text-gray-900">🛒 Products Marketplace</h1><p className="text-gray-600">Seeds, fertilizers, equipment & consultations</p></div>
            <div className="flex gap-2">
                <Button onClick={() => setActiveFeature && setActiveFeature('MY_ORDERS')} className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"><ShoppingCart className="w-5 h-5" /> My Orders</Button>
                <Button onClick={() => setActiveFeature && setActiveFeature('ADD_PRODUCT')} className="bg-brand-green text-white hover:bg-emerald-700"><Plus className="w-5 h-5" /> Add Product</Button>
            </div>
        </div>
        <div className="space-y-3">
          <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" /><Input placeholder="Search products, sellers..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" /></div>
          <div className="flex flex-wrap gap-2">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}><SelectItem value="all">All Categories</SelectItem><SelectItem value="seeds">🌱 Seeds</SelectItem><SelectItem value="fertilizer">🧪 Fertilizer</SelectItem><SelectItem value="pesticide">🦟 Pesticide</SelectItem><SelectItem value="equipment">🚜 Equipment</SelectItem><SelectItem value="produce">🌾 Produce</SelectItem><SelectItem value="consultation">👨‍🏫 Consultation</SelectItem></Select>
            <Select value={sellerTypeFilter} onValueChange={setSellerTypeFilter}><SelectItem value="all">All Sellers</SelectItem><SelectItem value="shop_owner">🏪 Shop Owners</SelectItem><SelectItem value="guide">👨‍🏫 Guides</SelectItem><SelectItem value="farmer">👨‍🌾 Farmers</SelectItem></Select>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-xl transition-shadow relative overflow-hidden">
              {product.promotion_active && <div className="absolute top-3 right-3 z-10"><Badge className="bg-red-600 text-white shadow-lg"><Percent className="w-3 h-3 mr-1" />{product.promotion_discount}% OFF</Badge></div>}
              <CardHeader className="pb-3">
                  {product.images?.[0] ? <img src={product.images[0]} alt={product.product_name} className="w-full h-48 object-cover rounded-lg mb-4"/> : <div className="w-full h-48 bg-gray-100 rounded-lg mb-4 flex items-center justify-center"><span className="text-6xl">{getCategoryIcon(product.category)}</span></div>}
                  <CardTitle className="text-xl mb-1">{product.product_name}</CardTitle>
                  <Badge className="bg-gray-100 text-gray-700">{getCategoryIcon(product.category)} {product.category}</Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 line-clamp-2 h-10">{product.description}</p>
                  <div className="flex items-end gap-2">{product.promotion_active ? <><p className="text-3xl font-bold text-brand-green">₹{getDiscountedPrice(product).toFixed(2)}</p><p className="text-lg text-gray-400 line-through mb-1">₹{product.price}</p></> : <p className="text-3xl font-bold text-brand-green">₹{product.price}</p>}<p className="text-sm text-gray-500 mb-1">/ {product.unit}</p></div>
                  <div className="pt-3 border-t space-y-2">
                      <div className="flex justify-between"><p className="text-sm font-semibold">{product.seller_name} <span className="text-xs font-normal text-gray-500 capitalize">({product.seller_type})</span></p><Badge className="bg-gray-100 text-gray-700"><TrendingUp size={12} className="mr-1"/>{product.orders_count || 0} sold</Badge></div>
                      <p className="text-sm text-gray-600 flex items-center gap-1"><MapPin size={14}/> {product.location}</p>
                  </div>
                  <Button onClick={() => openOrderDialog(product)} className="w-full bg-brand-green hover:bg-emerald-700 text-white">{product.category === "consultation" ? <><Video className="w-5 h-5"/>Book Now</> : <><ShoppingCart className="w-5 h-5"/>Place Order</>}</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      <Dialog open={showOrderDialog} onOpenChange={setShowOrderDialog}>
        <DialogContent>
            <DialogHeader><DialogTitle>{selectedProduct?.category === "consultation" ? "Book Consultation" : "Place Order"}</DialogTitle><button onClick={() => setShowOrderDialog(false)} className="p-1 rounded-full hover:bg-gray-100"><X size={20}/></button></DialogHeader>
            <div className="p-4 space-y-4">
                <div className="bg-gray-50 rounded-lg p-3"><h4 className="font-semibold">{selectedProduct?.product_name}</h4><div className="flex justify-between text-sm"><span>Price</span><span className="font-bold text-brand-green">₹{selectedProduct && getDiscountedPrice(selectedProduct)} / {selectedProduct?.unit}</span></div></div>
                <div><Label>Quantity</Label><Input type="number" min="1" value={orderForm.quantity} onChange={(e) => setOrderForm({ ...orderForm, quantity: parseInt(e.target.value) })} /></div>
                <div><Label>Delivery Address *</Label><Input value={orderForm.delivery_address} onChange={(e) => setOrderForm({ ...orderForm, delivery_address: e.target.value })} /></div>
                <div><Label>Contact Number *</Label><Input value={orderForm.contact_number} onChange={(e) => setOrderForm({ ...orderForm, contact_number: e.target.value })} /></div>
                <div className="bg-green-50 rounded-lg p-3 flex justify-between items-center"><span className="font-semibold">Total</span><span className="text-2xl font-bold text-brand-green">₹{selectedProduct && (getDiscountedPrice(selectedProduct) * orderForm.quantity).toFixed(2)}</span></div>
                <Button onClick={handleOrder} className="w-full bg-brand-green hover:bg-emerald-700 text-white">Confirm Order</Button>
            </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};