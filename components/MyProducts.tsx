import React, { useState, useEffect } from "react";
import { FeatureComponentProps, Product, Order, Notification } from '../types';
import { mockProducts } from './Products'; 
import { Plus, Trash2, TrendingUp, ShoppingCart, Eye, Package, Percent } from "lucide-react";

// Mock Data for Orders and Notifications, scoped to this component
let mockOrders: Order[] = [
    { id: 'ord_1', product_id: 'prod_1', product_name: 'Organic Wheat Seeds', buyer_id: 'user_2', buyer_name: 'Aarav Sharma', seller_id: 'user_4', seller_name: 'Rohan Gupta', quantity: 10, total_price: 1350, delivery_address: 'Jaipur, Rajasthan', buyer_contact: '+91 999...', status: 'pending', order_date: '2023-10-26', created_date: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString() },
    { id: 'ord_2', product_id: 'prod_3', product_name: 'Fresh Farm Tomatoes', buyer_id: 'user_123', buyer_name: 'Sanjay Kumar', seller_id: 'user_2', seller_name: 'Aarav Sharma', quantity: 5, total_price: 200, delivery_address: 'Ludhiana, Punjab', buyer_contact: '+91 9876543210', status: 'confirmed', order_date: '2023-10-25', created_date: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString() },
];
let mockNotifications: Notification[] = [];

// Local UI components for consistent styling.
const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => <div className={`bg-white rounded-lg shadow-md border ${className}`}>{children}</div>;
const CardContent: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => <div className={`p-4 ${className}`}>{children}</div>;
const CardHeader: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => <div className={`p-4 border-b ${className}`}>{children}</div>;
const CardTitle: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => <h3 className={`font-bold text-lg ${className}`}>{children}</h3>;
const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & {variant?: string, size?: string}> = (props) => {
    const { variant, size, ...rest } = props;
    const baseClasses = "px-3 py-1.5 text-sm font-semibold rounded-md transition-colors flex items-center justify-center gap-2";
    let variantClasses = "bg-brand-green hover:bg-emerald-700 text-white";
    if (variant === 'destructive') variantClasses = "bg-red-500 hover:bg-red-600 text-white";
    if (variant === 'outline') variantClasses = "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50";
    return <button {...rest} className={`${baseClasses} ${variantClasses} ${props.className}`}>{props.children}</button>
};
const Badge: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${className}`}>{children}</span>;
const Tabs: React.FC<{ children: React.ReactNode, defaultValue: string }> = ({ children }) => <div>{children}</div>;
const TabsList: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => <div className={`flex border-b ${className}`}>{children}</div>;
const TabsTrigger: React.FC<{ children: React.ReactNode, isActive: boolean, onClick: () => void }> = ({ children, isActive, onClick }) => <button onClick={onClick} className={`flex-1 p-3 font-semibold text-sm ${isActive ? 'border-b-2 border-brand-green text-brand-green' : 'text-gray-500'}`}>{children}</button>;
const TabsContent: React.FC<{ children: React.ReactNode }> = ({ children }) => <div>{children}</div>;

export const MyProducts: React.FC<FeatureComponentProps> = ({ setActiveFeature, currentUser }) => {
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState('products');
  const [isLoading, setIsLoading] = useState(true);

  const loadData = () => {
    if (currentUser) {
      setMyProducts(mockProducts.filter(p => p.seller_id === currentUser.id));
      setMyOrders(mockOrders.filter(o => o.seller_id === currentUser.id).sort((a,b) => new Date(b.created_date).getTime() - new Date(a.created_date).getTime()));
    }
    setIsLoading(false);
  };

  useEffect(loadData, [currentUser]);

  const handleDelete = (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      const index = mockProducts.findIndex(p => p.id === productId);
      if (index > -1) mockProducts.splice(index, 1);
      loadData(); // Refresh data
    }
  };

  const toggleAvailability = (product: Product) => {
    const prod = mockProducts.find(p => p.id === product.id);
    if (prod) prod.in_stock = !prod.in_stock;
    loadData();
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['status'], order: Order) => {
    const ord = mockOrders.find(o => o.id === orderId);
    if (ord) ord.status = newStatus;
    
    const statusMessages: Record<string, string> = { confirmed: "confirmed", shipped: "shipped", delivered: "delivered", cancelled: "cancelled"};
    mockNotifications.push({
      id: `notif_${Date.now()}`, user_id: order.buyer_id, title: `📦 Order Update: ${order.product_name}`,
      message: `Your order has been ${statusMessages[newStatus]} by the seller.`, type: "order", related_id: orderId,
      action_url: "MY_ORDERS", is_read: false, created_date: new Date().toISOString()
    });
    console.log("Created notification:", mockNotifications[mockNotifications.length-1]);
    loadData();
  };
  
  const getStatusColor = (status: Order['status']) => ({ pending: "bg-yellow-100 text-yellow-700", confirmed: "bg-blue-100 text-blue-700", shipped: "bg-purple-100 text-purple-700", delivered: "bg-green-100 text-green-700", cancelled: "bg-red-100 text-red-700" }[status] || "bg-gray-100 text-gray-700");

  if (isLoading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="p-4 md:p-6 bg-white rounded-2xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My {currentUser?.user_type === "guide" ? "Services" : "Products"}</h1>
          <p className="text-gray-600">Manage your listings and orders</p>
        </div>
        <Button onClick={() => setActiveFeature && setActiveFeature('ADD_PRODUCT')}><Plus className="w-5 h-5"/> Add New</Button>
      </div>
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card><CardContent className="p-4 text-center"><Package className="w-8 h-8 mx-auto mb-2 text-blue-600"/><p className="text-2xl font-bold">{myProducts.length}</p><p className="text-sm text-gray-600">Total Products</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><ShoppingCart className="w-8 h-8 mx-auto mb-2 text-green-600"/><p className="text-2xl font-bold">{myOrders.length}</p><p className="text-sm text-gray-600">Total Orders</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><TrendingUp className="w-8 h-8 mx-auto mb-2 text-purple-600"/><p className="text-2xl font-bold">{myProducts.reduce((s, p) => s + (p.orders_count || 0), 0)}</p><p className="text-sm text-gray-600">Items Sold</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><Eye className="w-8 h-8 mx-auto mb-2 text-orange-600"/><p className="text-2xl font-bold">{myProducts.reduce((s, p) => s + (p.views_count || 0), 0)}</p><p className="text-sm text-gray-600">Total Views</p></CardContent></Card>
      </div>
      <Tabs defaultValue="products">
        <TabsList><TabsTrigger isActive={activeTab === 'products'} onClick={() => setActiveTab('products')}>My Products</TabsTrigger><TabsTrigger isActive={activeTab === 'orders'} onClick={() => setActiveTab('orders')}>Orders ({myOrders.filter(o => o.status === "pending").length})</TabsTrigger></TabsList>
        {activeTab === 'products' && <TabsContent>
          <div className="grid md:grid-cols-2 gap-6 pt-6">
            {myProducts.length === 0 ? <Card className="md:col-span-2"><CardContent className="p-12 text-center"><p className="text-gray-500 mb-4">You haven't listed any products yet</p><Button onClick={() => setActiveFeature && setActiveFeature('ADD_PRODUCT')}><Plus className="w-4 h-4"/>List Your First Product</Button></CardContent></Card> : myProducts.map((product) => (
              <Card key={product.id}><CardHeader><div className="flex justify-between items-start"><CardTitle className="flex-1">{product.product_name}</CardTitle><Badge className={product.in_stock ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>{product.in_stock ? "In Stock" : "Out of Stock"}</Badge></div></CardHeader><CardContent className="space-y-3">
                {product.images?.[0] && <img src={product.images[0]} alt={product.product_name} className="w-full h-32 object-cover rounded-md"/>}
                <div className="flex justify-between text-sm"><span className="font-bold text-lg text-brand-green">₹{product.price} <span className="text-gray-500 font-normal text-sm">/ {product.unit}</span></span>{product.promotion_active && <Badge className="bg-red-100 text-red-700"><Percent size={12} className="mr-1"/>{product.promotion_discount}% OFF</Badge>}</div>
                <div className="grid grid-cols-2 gap-2 text-center text-sm"><div className="bg-gray-50 p-2 rounded-md"><p className="text-xs">Stock</p><p className="font-bold">{product.stock_quantity ?? 'N/A'}</p></div><div className="bg-gray-50 p-2 rounded-md"><p className="text-xs">Sold</p><p className="font-bold">{product.orders_count || 0}</p></div></div>
                <div className="flex gap-2 pt-3 border-t"><Button onClick={() => toggleAvailability(product)} variant="outline" className="flex-1">Mark as {product.in_stock ? "Unavailable" : "Available"}</Button><Button onClick={() => handleDelete(product.id)} variant="destructive"><Trash2 className="w-4 h-4"/></Button></div>
              </CardContent></Card>
            ))}
          </div>
        </TabsContent>}
        {activeTab === 'orders' && <TabsContent>
          <div className="space-y-4 pt-6">
            {myOrders.length === 0 ? <Card><CardContent className="p-12 text-center text-gray-500">No orders yet</CardContent></Card> : myOrders.map((order) => (
              <Card key={order.id}><CardContent className="p-4">
                <div className="flex justify-between items-start mb-3"><div className="flex-1"><h3 className="font-bold text-gray-900">{order.product_name}</h3><p className="text-sm text-gray-600">From: {order.buyer_name}</p><p className="text-xs text-gray-500">📅 {new Date(order.created_date).toLocaleDateString()}</p></div><Badge className={getStatusColor(order.status)}>{order.status}</Badge></div>
                <div className="grid md:grid-cols-2 gap-3 text-sm bg-gray-50 p-3 rounded-lg mb-3">
                    <div><p className="text-xs">Quantity</p><p className="font-semibold">{order.quantity}</p></div>
                    <div><p className="text-xs">Total</p><p className="font-semibold text-brand-green">₹{order.total_price}</p></div>
                    <div className="md:col-span-2"><p className="text-xs">Address</p><p className="font-semibold">{order.delivery_address}</p></div>
                    <div className="md:col-span-2"><p className="text-xs">Contact</p><p className="font-semibold">{order.buyer_contact}</p></div>
                </div>
                {order.status !== "delivered" && order.status !== "cancelled" && <div className="flex flex-wrap gap-2">
                  {order.status === "pending" && <Button onClick={() => updateOrderStatus(order.id, "confirmed", order)} className="bg-blue-600 hover:bg-blue-700">Confirm Order</Button>}
                  {order.status === "confirmed" && <Button onClick={() => updateOrderStatus(order.id, "shipped", order)} className="bg-purple-600 hover:bg-purple-700">Mark as Shipped</Button>}
                  {order.status === "shipped" && <Button onClick={() => updateOrderStatus(order.id, "delivered", order)}>Mark as Delivered</Button>}
                  <Button onClick={() => updateOrderStatus(order.id, "cancelled", order)} variant="destructive">Cancel Order</Button>
                </div>}
              </CardContent></Card>
            ))}
          </div>
        </TabsContent>}
      </Tabs>
    </div>
  );
};