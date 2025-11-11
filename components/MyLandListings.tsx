import React, { useState, useEffect } from "react";
import { FeatureComponentProps, LandLease } from '../types';
import { Plus, Trash2, Maximize, IndianRupee } from "lucide-react";

// Mock Data for LandLease - this should be consistent with the discovery page's data
const mockLandLeaseData: LandLease[] = [
    {
        id: 'land_1',
        owner_id: 'user_123',
        owner_name: 'Sanjay Kumar',
        land_size_acres: 15,
        lease_cost_per_acre: 60000,
        location: 'Near Grand Trunk Road',
        village: 'Phillaur',
        district: 'Jalandhar',
        state: 'Punjab',
        soil_type: 'alluvial',
        soil_ph: 7.2,
        irrigation_available: true,
        irrigation_type: 'Canal',
        images: ['https://images.unsplash.com/photo-1599557382832-8d77a060000a?q=80&w=2070&auto=format&fit=crop', 'https://images.unsplash.com/photo-1444930694458-04f4e813aa11?q=80&w=2070&auto=format&fit=crop'],
        gps_coordinates: '31.0256, 75.7877',
        contact_number: '+91 9876543210',
        available: true,
        created_date: new Date().toISOString()
    },
    {
        id: 'land_2',
        owner_id: 'user_456',
        owner_name: 'Rajesh Patel',
        land_size_acres: 8,
        lease_cost_per_acre: 45000,
        location: 'Close to Sugar Mill',
        village: 'Baramati',
        district: 'Pune',
        state: 'Maharashtra',
        soil_type: 'black',
        soil_ph: 7.8,
        irrigation_available: true,
        irrigation_type: 'Drip Irrigation',
        images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1932&auto=format&fit=crop'],
        gps_coordinates: '18.1517, 74.5838',
        contact_number: '+91 9876512345',
        available: true,
        created_date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString()
    }
];

// Local UI components
const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => <div className={`bg-white rounded-lg shadow-md border ${className}`}>{children}</div>;
const CardHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => <div className="p-4 border-b">{children}</div>;
const CardTitle: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => <h3 className={`font-bold text-lg ${className}`}>{children}</h3>;
const CardContent: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => <div className={`p-4 ${className}`}>{children}</div>;
const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = (props) => <button {...props} className={`px-4 py-2 font-semibold rounded-md transition-colors ${props.className}`}>{props.children}</button>;
const Badge: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => <span className={`px-2 py-1 text-xs font-semibold rounded-full ${className}`}>{children}</span>;

export const MyLandListings: React.FC<FeatureComponentProps> = ({ setActiveFeature, currentUser }) => {
  const [myLands, setMyLands] = useState<LandLease[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      const userLands = mockLandLeaseData.filter(land => land.owner_id === currentUser.id);
      setMyLands(userLands);
    }
    setIsLoading(false);
  }, [currentUser]);

  const handleDelete = (landId: string) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      setMyLands(prev => prev.filter(land => land.id !== landId));
      const index = mockLandLeaseData.findIndex(l => l.id === landId);
      if (index > -1) mockLandLeaseData.splice(index, 1);
    }
  };

  const toggleAvailability = (landToToggle: LandLease) => {
    const updatedLands = myLands.map(land =>
      land.id === landToToggle.id ? { ...land, available: !land.available } : land
    );
    setMyLands(updatedLands);
    const landInMock = mockLandLeaseData.find(l => l.id === landToToggle.id);
    if (landInMock) landInMock.available = !landInMock.available;
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-white rounded-2xl shadow-lg flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-green border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-white rounded-2xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Land Listings</h1>
          <p className="text-gray-600">Manage your land lease listings</p>
        </div>
        <Button onClick={() => setActiveFeature && setActiveFeature('ADD_LAND_LISTING')} className="bg-brand-green hover:bg-emerald-700 text-white">
          <Plus className="w-5 h-5 mr-2" />
          Add New Land
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {myLands.length === 0 ? (
          <Card className="md:col-span-2">
            <CardContent className="p-12 text-center">
              <p className="text-gray-500 mb-4">You haven't listed any land yet</p>
              <Button onClick={() => setActiveFeature && setActiveFeature('ADD_LAND_LISTING')} className="bg-brand-green hover:bg-emerald-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                List Your First Land
              </Button>
            </CardContent>
          </Card>
        ) : (
          myLands.map((land) => (
            <Card key={land.id} className="relative">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl mb-2">{land.location}</CardTitle>
                    <p className="text-sm text-gray-600">
                      📍 {land.village}, {land.district}, {land.state}
                    </p>
                  </div>
                  <Badge className={land.available ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                    {land.available ? "Available" : "Unavailable"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {land.images && land.images.length > 0 && (
                  <img
                    src={land.images[0]}
                    alt="Land"
                    className="w-full h-40 object-cover rounded-lg"
                  />
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 bg-blue-50 rounded-lg p-3">
                    <Maximize className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-xs text-blue-700">Size</p>
                      <p className="font-bold text-blue-900">{land.land_size_acres} acres</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-green-50 rounded-lg p-3">
                    <IndianRupee className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-xs text-green-700">Cost/Acre/Year</p>
                      <p className="font-bold text-green-900">₹{land.lease_cost_per_acre}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-3 border-t">
                  <Button
                    onClick={() => toggleAvailability(land)}
                    className="flex-1 bg-white border-gray-300 text-gray-700 hover:bg-gray-50 border"
                  >
                    Mark as {land.available ? "Unavailable" : "Available"}
                  </Button>
                  <Button
                    onClick={() => handleDelete(land.id)}
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
