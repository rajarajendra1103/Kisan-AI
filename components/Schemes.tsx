
import React, { useState, useMemo } from 'react';
import { FileText, Search, ExternalLink, Filter } from 'lucide-react';
import { FEATURES, FeatureComponentProps } from '../types';

interface Scheme {
  id: string;
  scheme_name: string;
  description: string;
  category: 'subsidy' | 'loan' | 'insurance' | 'training' | 'equipment' | 'other';
  eligibility: string;
  benefits: string;
  how_to_apply: string;
  official_link: string;
}

const mockSchemes: Scheme[] = [
  {
    id: '1',
    scheme_name: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
    description: 'A central sector scheme with 100% funding from the Government of India. It has become operational from 1.12.2018.',
    category: 'subsidy',
    eligibility: 'All landholding farmer families in the country.',
    benefits: 'Income support of Rs. 6,000 per year in three equal installments.',
    how_to_apply: 'Farmers can self-register through the PM-KISAN portal or approach the local patwari/revenue officer/Nodal Officer (PM-Kisan) nominated by the State Government.',
    official_link: 'https://pmkisan.gov.in/',
  },
  {
    id: '2',
    scheme_name: 'Kisan Credit Card (KCC)',
    description: 'The KCC scheme was introduced to ensure that farmers have access to timely and adequate credit.',
    category: 'loan',
    eligibility: 'Farmers, individuals/joint borrowers who are owner cultivators; tenant farmers, oral lessees & share croppers; SHGs or Joint Liability Groups of farmers.',
    benefits: 'Provides term loans for agriculture & allied activities. Revolving cash credit limit. Simple interest is charged at 7% p.a. for one year.',
    how_to_apply: 'Contact the nearest branch of a commercial bank, RRB, or cooperative bank.',
    official_link: 'https://www.sbi.co.in/web/agri-rural/agriculture-banking/crop-finance/kisan-credit-card',
  },
  {
    id: '3',
    scheme_name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    description: 'Provides comprehensive insurance coverage against failure of the crop thus helping in stabilising the income of the farmers.',
    category: 'insurance',
    eligibility: 'All farmers including sharecroppers and tenant farmers growing notified crops in the notified areas are eligible for coverage.',
    benefits: 'Provides insurance coverage and financial support to the farmers in the event of failure of any of the notified crop as a result of natural calamities, pests & diseases.',
    how_to_apply: 'Farmers can apply online on the National Crop Insurance Portal (NCIP) or through their bank branch.',
    official_link: 'https://pmfby.gov.in/',
  },
];


export const Schemes: React.FC<FeatureComponentProps> = ({}) => {
  const featureInfo = FEATURES.GOVERNMENT_SCHEMES;
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredSchemes = useMemo(() => {
    return mockSchemes.filter((scheme) => {
      const matchesSearch =
        scheme.scheme_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scheme.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" || scheme.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, categoryFilter]);
  
  const getCategoryColor = (category: Scheme['category']) => {
    const colors = {
      subsidy: "bg-blue-100 text-blue-800",
      loan: "bg-green-100 text-green-800",
      insurance: "bg-purple-100 text-purple-800",
      training: "bg-orange-100 text-orange-800",
      equipment: "bg-red-100 text-red-800",
      other: "bg-gray-100 text-gray-800",
    };
    return colors[category] || colors.other;
  };

  return (
    <div className="p-4 md:p-6 bg-white rounded-2xl shadow-lg">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-brand-green to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
          <FileText className="w-7 h-7 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{featureInfo.title}</h2>
          <p className="text-gray-500">{featureInfo.description}</p>
        </div>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 bg-gray-50 rounded-lg border">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search schemes by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:ring-brand-green focus:border-brand-green"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <select 
            value={categoryFilter} 
            onChange={e => setCategoryFilter(e.target.value)}
            className="w-full md:w-48 pl-9 p-2 border border-gray-300 rounded-md focus:ring-brand-green focus:border-brand-green appearance-none"
          >
            <option value="all">All Categories</option>
            <option value="subsidy">Subsidy</option>
            <option value="loan">Loan</option>
            <option value="insurance">Insurance</option>
            <option value="training">Training</option>
            <option value="equipment">Equipment</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Schemes List */}
      <div className="space-y-6">
        {filteredSchemes.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <p className="text-gray-500">No schemes found matching your criteria.</p>
          </div>
        ) : (
          filteredSchemes.map((scheme) => (
            <div
              key={scheme.id}
              className="border rounded-lg shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-start gap-4 mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{scheme.scheme_name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(scheme.category)}`}>
                    {scheme.category.charAt(0).toUpperCase() + scheme.category.slice(1)}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{scheme.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Eligibility</h4>
                    <p className="text-gray-600">{scheme.eligibility}</p>
                  </div>
                   <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Benefits</h4>
                    <p className="text-gray-600">{scheme.benefits}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="font-semibold text-gray-800 mb-1">How to Apply</h4>
                  <p className="text-gray-600 text-sm">{scheme.how_to_apply}</p>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-3">
                 <a
                    href={scheme.official_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center text-sm font-semibold text-brand-green hover:text-emerald-700"
                  >
                    Visit Official Website
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
