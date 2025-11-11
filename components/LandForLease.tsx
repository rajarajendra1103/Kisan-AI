import React, { useState, useMemo } from "react";
import { FeatureComponentProps, LandLease } from '../types';
import {
  MapPin,
  Search,
  Plus,
  Droplets,
  Maximize,
  IndianRupee,
  Phone
} from "lucide-react";

// Mock Data for LandLease
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

// Assuming UI components are globally available or styled with Tailwind
const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => <div className={`bg-white rounded-lg shadow-md border ${className}`}>{children}</div>;
const CardHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => <div className="p-4 border-b">{children}</div>;
const CardTitle: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => <h3 className={`font-bold text-lg ${className}`}>{children}</h3>;
const CardContent: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => <div className={`p-4 ${className}`}>{children}</div>;
const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => <input {...props} className={`w-full p-2 border border-gray-300 rounded-md focus:ring-brand-green focus:border-brand-green ${props.className}`} />;
const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & {variant?: string, size?: string}> = (props) => {
    const { variant, size, ...rest } = props;
    return <button {...rest} className={`px-4 py-2 font-semibold rounded-md transition-colors ${props.className}`}>{props.children}</button>
};
const Badge: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => <span className={`px-2 py-1 text-xs font-semibold rounded-full ${className}`}>{children}</span>;
const Select: React.FC<{ children: React.ReactNode, value: string, onValueChange: (value: string) => void }> = ({ children, value, onValueChange }) => <div className="relative"><select value={value} onChange={(e) => onValueChange(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md appearance-none pr-8 bg-white">{children}</select><div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"><svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg></div></div>;
const SelectItem: React.FC<{ children: React.ReactNode, value: string }> = ({ children, value }) => <option value={value}>{children}</option>;


export const LandForLease: React.FC<FeatureComponentProps> = ({ setActiveFeature }) => {
  const [lands, setLands] = useState(mockLandLeaseData.filter(l => l.available));
  const [searchQuery, setSearchQuery] = useState("");
  const [soilTypeFilter, setSoilTypeFilter] = useState("all");
  const [irrigationFilter, setIrrigationFilter] = useState("all");
  const [minSize, setMinSize] = useState("");
  const [maxSize, setMaxSize] = useState("");

  const filteredLands = useMemo(() => lands.filter((land) => {
    const matchesSearch =
      land.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      land.village?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      land.district?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      land.state?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSoil = soilTypeFilter === "all" || land.soil_type === soilTypeFilter;
    const matchesIrrigation =
      irrigationFilter === "all" ||
      (irrigationFilter === "yes" && land.irrigation_available) ||
      (irrigationFilter === "no" && !land.irrigation_available);
    const matchesSize =
      (!minSize || land.land_size_acres >= parseFloat(minSize)) &&
      (!maxSize || land.land_size_acres <= parseFloat(maxSize));
    return matchesSearch && matchesSoil && matchesIrrigation && matchesSize;
  }), [lands, searchQuery, soilTypeFilter, irrigationFilter, minSize, maxSize]);

  const getSoilColor = (soilType: LandLease['soil_type']) => {
    const colors = {
      sandy: "bg-yellow-100 text-yellow-700",
      clay: "bg-orange-100 text-orange-700",
      loam: "bg-green-100 text-green-700",
      silt: "bg-blue-100 text-blue-700",
      red: "bg-red-100 text-red-700",
      black: "bg-gray-800 text-white",
      alluvial: "bg-teal-100 text-teal-700",
    };
    return colors[soilType] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="p-4 md:p-6 bg-white rounded-2xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🌾 Land for Lease</h1>
          <p className="text-gray-600">Find agricultural land for farming</p>
        </div>
        <Button className="bg-brand-green hover:bg-emerald-700 text-white" onClick={() => setActiveFeature && setActiveFeature('ADD_LAND_LISTING')}>
          <Plus className="w-5 h-5 mr-2" />
          List Your Land
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search by location, village, district, or state..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Select value={soilTypeFilter} onValueChange={setSoilTypeFilter}>
                <SelectItem value="all">All Soil Types</SelectItem>
                <SelectItem value="sandy">Sandy</SelectItem>
                <SelectItem value="clay">Clay</SelectItem>
                <SelectItem value="loam">Loam</SelectItem>
                <SelectItem value="silt">Silt</SelectItem>
                <SelectItem value="red">Red</SelectItem>
                <SelectItem value="black">Black</SelectItem>
                <SelectItem value="alluvial">Alluvial</SelectItem>
            </Select>
            <Select value={irrigationFilter} onValueChange={setIrrigationFilter}>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="yes">With Irrigation</SelectItem>
                <SelectItem value="no">No Irrigation</SelectItem>
            </Select>
            <Input type="number" placeholder="Min acres" value={minSize} onChange={(e) => setMinSize(e.target.value)} />
            <Input type="number" placeholder="Max acres" value={maxSize} onChange={(e) => setMaxSize(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {filteredLands.length === 0 ? (
          <Card className="md:col-span-2">
            <CardContent className="p-12 text-center">
              <p className="text-gray-500 mb-4">No land listings found matching your criteria</p>
              <Button className="bg-brand-green hover:bg-emerald-700 text-white" onClick={() => setActiveFeature && setActiveFeature('ADD_LAND_LISTING')}>
                <Plus className="w-4 h-4 mr-2" />
                Be the first to list your land
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredLands.map((land) => (
            <Card key={land.id} className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl mb-2">{land.location}</CardTitle>
                <p className="text-sm text-gray-600">📍 {land.village}, {land.district}, {land.state}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {land.images && land.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-2"><img src={land.images[0]} alt="Land" className="w-full h-32 object-cover rounded-lg"/>{land.images[1] && <img src={land.images[1]} alt="Land" className="w-full h-32 object-cover rounded-lg"/>}</div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 bg-blue-50 rounded-lg p-3"><Maximize className="w-5 h-5 text-blue-600" /><div><p className="text-xs text-blue-700">Land Size</p><p className="font-bold text-blue-900">{land.land_size_acres} acres</p></div></div>
                  <div className="flex items-center gap-2 bg-green-50 rounded-lg p-3"><IndianRupee className="w-5 h-5 text-green-600" /><div><p className="text-xs text-green-700">Cost/Acre/Year</p><p className="font-bold text-green-900">₹{land.lease_cost_per_acre}</p></div></div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge className={getSoilColor(land.soil_type)}>{land.soil_type} soil</Badge>
                  {land.soil_ph && <Badge className="bg-gray-100 text-gray-700">pH: {land.soil_ph}</Badge>}
                  {land.irrigation_available ? <Badge className="bg-blue-100 text-blue-700"><Droplets className="w-3 h-3 mr-1" />{land.irrigation_type || "Irrigation Available"}</Badge> : <Badge className="bg-gray-100 text-gray-700">No Irrigation</Badge>}
                </div>
                <div className="pt-3 border-t flex items-center justify-between">
                  <div><p className="text-sm font-semibold text-gray-900">{land.owner_name}</p>{land.contact_number && <p className="text-sm text-gray-600 flex items-center gap-1"><Phone className="w-3 h-3" />{land.contact_number}</p>}</div>
                  {land.gps_coordinates && <Button variant="outline" size="sm" onClick={() => window.open(`https://www.google.com/maps?q=${land.gps_coordinates}`, "_blank")} className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"><MapPin className="w-4 h-4 mr-1" />View Map</Button>}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};