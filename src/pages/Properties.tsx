import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Building2, 
  Search, 
  Plus, 
  Share2, 
  MapPin, 
  BedDouble, 
  Maximize2,
  CheckCircle,
  FileText,
  X,
  Send,
  Loader
} from 'lucide-react';

interface Property {
  id: string;
  title: string;
  projectName: string;
  location: string;
  address: string;
  propertyType: string;
  price: number;
  size: string;
  bedrooms: number;
  bathrooms: number;
  description: string;
  amenities: string[];
  availability: 'Available' | 'Hold' | 'Sold';
  brochureUrl: string | null;
}

interface Lead {
  id: string;
  fullName: string;
  phone: string;
  status: string;
}

export const Properties: React.FC = () => {
  const { organization } = useAuth();
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [availFilter, setAvailFilter] = useState('');

  // Share Drawer States
  const [shareDrawerOpen, setShareDrawerOpen] = useState(false);
  const [sharingProperty, setSharingProperty] = useState<Property | null>(null);
  const [selectedLeadId, setSelectedLeadId] = useState('');
  const [shareChannel, setShareChannel] = useState<'WHATSAPP' | 'EMAIL'>('WHATSAPP');
  const [sharingLoading, setSharingLoading] = useState(false);

  // Add Property States
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [projectName, setProjectName] = useState('');
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [propType, setPropType] = useState('Apartment');
  const [price, setPrice] = useState('');
  const [size, setSize] = useState('');
  const [bedrooms, setBedrooms] = useState('2');
  const [bathrooms, setBathrooms] = useState('2');
  const [desc, setDesc] = useState('');
  const [amenityInput, setAmenityInput] = useState('');
  const [brochureUrl, setBrochureUrl] = useState('');
  
  const fetchProperties = async () => {
    try {
      const qParams = new URLSearchParams();
      if (search) qParams.append('search', search);
      if (typeFilter) qParams.append('propertyType', typeFilter);
      if (availFilter) qParams.append('availability', availFilter);

      const res = await api.get(`/properties?${qParams.toString()}`);
      setProperties(res.data);
    } catch (err) {
      console.error('[Properties] Fetch properties error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeadsForSharing = async () => {
    try {
      const res = await api.get('/leads');
      // Show active prospects
      setLeads(res.data.filter((l: any) => l.status !== 'Booked' && l.status !== 'Lost'));
      if (res.data.length > 0) {
        setSelectedLeadId(res.data[0].id);
      }
    } catch (err) {
      console.error('[Properties] Fetch leads error:', err);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [search, typeFilter, availFilter]);

  useEffect(() => {
    fetchLeadsForSharing();
  }, []);

  const handleCreateProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !projectName || !location || !price) return;

    try {
      const amenities = amenityInput.split(',').map(s => s.trim()).filter(Boolean);
      await api.post('/properties', {
        title,
        projectName,
        location,
        address,
        propertyType: propType,
        price: parseFloat(price),
        size,
        bedrooms: parseInt(bedrooms) || 0,
        bathrooms: parseInt(bathrooms) || 0,
        description: desc,
        amenities,
        brochureUrl: brochureUrl || null,
        images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'] // default mock image
      });

      setAddModalOpen(false);
      setTitle('');
      setProjectName('');
      setLocation('');
      setAddress('');
      setPrice('');
      setSize('');
      setDesc('');
      setAmenityInput('');
      setBrochureUrl('');
      fetchProperties();
    } catch (err) {
      console.error('Error creating property:', err);
      alert('Failed to save property.');
    }
  };

  const handleOpenShare = (property: Property) => {
    setSharingProperty(property);
    setShareDrawerOpen(true);
  };

  const handleShareSubmit = async () => {
    if (!sharingProperty || !selectedLeadId) return;

    setSharingLoading(true);
    try {
      await api.post(`/leads/${selectedLeadId}/share`, {
        propertyId: sharingProperty.id,
        channel: shareChannel,
        dryRun: true,
      });

      setShareDrawerOpen(false);
      alert('Property details queued for sharing successfully!');
    } catch (err) {
      console.error('Error sharing property:', err);
      alert('Failed to share property.');
    } finally {
      setSharingLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
    return `₹${price.toLocaleString()}`;
  };

  const getAvailColor = (avail: string) => {
    if (avail === 'Available') return 'bg-green-500/10 text-green-400 border border-green-500/20';
    if (avail === 'Hold') return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20';
    return 'bg-red-500/10 text-red-400 border border-red-500/20';
  };

  return (
    <div className="space-y-6">
      
      {/* Title & Add button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Property Inventory</h2>
          <p className="text-xs text-slate-400 mt-1">Search active listings, specifications, and brochure details</p>
        </div>
        {organization && organization.role !== 'SALES_AGENT' && (
          <button
            onClick={() => setAddModalOpen(true)}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 text-white hover:bg-brand-500 transition-all duration-200 shadow-lg shadow-brand-500/10"
          >
            <Plus size={16} />
            <span>Add Property</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 rounded-xl shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <Search size={16} />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none text-xs"
            placeholder="Search by title, project name, location..."
          />
        </div>

        <div className="flex gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="block bg-slate-950/80 border border-slate-800 rounded-xl text-xs px-3 py-2 text-slate-400 focus:outline-none"
          >
            <option value="">All Types</option>
            <option value="Apartment">Apartment</option>
            <option value="Villa">Villa</option>
            <option value="Plot">Plot</option>
            <option value="Studio">Studio</option>
            <option value="Commercial">Commercial</option>
          </select>

          <select
            value={availFilter}
            onChange={(e) => setAvailFilter(e.target.value)}
            className="block bg-slate-950/80 border border-slate-800 rounded-xl text-xs px-3 py-2 text-slate-400 focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Hold">Hold</option>
            <option value="Sold">Sold</option>
          </select>
        </div>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin"></div>
          <p className="mt-3 text-xs text-slate-650 uppercase font-bold tracking-wider">Loading listings...</p>
        </div>
      ) : properties.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl text-center border-slate-900">
          <Building2 size={32} className="mx-auto text-slate-600 mb-3 opacity-60" />
          <h3 className="font-bold text-slate-350 text-sm">No Properties Found</h3>
          <p className="text-xs text-slate-500 mt-1">There are no property listings currently in your organization inventory.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {properties.map((p) => (
            <div key={p.id} className="glass-panel rounded-2xl overflow-hidden flex flex-col group border-slate-900 hover:border-slate-800/80 transition-all duration-300">
              {/* Image box */}
              <div className="h-44 bg-slate-950 relative overflow-hidden">
                <img 
                  src={`https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&q=80`} // nice architectural default mock
                  alt={p.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                />
                <span className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[9px] font-bold ${getAvailColor(p.availability)}`}>
                  {p.availability}
                </span>
                <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-slate-950/80 text-white backdrop-blur-sm">
                  {p.propertyType}
                </span>
              </div>

              {/* Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <span className="text-[10px] text-brand-400 font-bold uppercase tracking-wider">{p.projectName}</span>
                  <h4 className="font-bold text-slate-200 text-sm line-clamp-1 leading-tight">{p.title}</h4>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin size={12} className="shrink-0" /> {p.location}
                  </p>
                </div>

                {/* Specs row */}
                <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-850/60 text-slate-400">
                  <div className="flex items-center space-x-1 justify-center">
                    <BedDouble size={14} className="text-slate-500" />
                    <span className="text-[11px] font-medium">{p.bedrooms ? `${p.bedrooms} BHK` : 'N/A'}</span>
                  </div>
                  <div className="flex items-center space-x-1 justify-center border-x border-slate-850/60">
                    <Maximize2 size={14} className="text-slate-500" />
                    <span className="text-[11px] font-medium truncate">{p.size}</span>
                  </div>
                  <div className="flex items-center space-x-1 justify-center">
                    <FileText size={14} className="text-slate-500" />
                    <span className="text-[11px] font-medium">{p.brochureUrl ? 'Brochure' : 'No Doc'}</span>
                  </div>
                </div>

                {/* Footer Price & Share button */}
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-500 block">Price</span>
                    <span className="text-sm font-bold text-white">{formatPrice(p.price)}</span>
                  </div>

                  <button 
                    onClick={() => handleOpenShare(p)}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all duration-200 shadow-md shadow-indigo-600/10"
                  >
                    <Share2 size={12} />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Share Property Slide-Up Drawer */}
      {shareDrawerOpen && sharingProperty && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-end justify-center">
          <div className="bg-slate-900 border-t border-slate-800 w-full max-w-xl rounded-t-2xl p-6 shadow-2xl space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div>
                <h4 className="font-bold text-slate-200 text-md">One-Click Property Sharing</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Select a lead to share "{sharingProperty.title}"</p>
              </div>
              <button 
                onClick={() => setShareDrawerOpen(false)}
                className="p-1 text-slate-400 hover:bg-slate-800 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            {leads.length === 0 ? (
              <div className="text-center py-6 text-slate-500 text-xs">No active prospects available. Add leads first.</div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Select Lead</label>
                  <select
                    value={selectedLeadId}
                    onChange={(e) => setSelectedLeadId(e.target.value)}
                    className="mt-1.5 block w-full bg-slate-950 border border-slate-850 rounded-xl text-xs px-3 py-2.5 text-slate-200 focus:outline-none"
                  >
                    {leads.map((l) => (
                      <option key={l.id} value={l.id}>{l.fullName} ({l.phone}) - {l.status}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Sharing Channel</label>
                  <div className="mt-1.5 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setShareChannel('WHATSAPP')}
                      className={`py-2 px-4 rounded-xl border text-xs font-semibold transition-all duration-200 ${
                        shareChannel === 'WHATSAPP' 
                          ? 'bg-indigo-600/10 border-indigo-500/40 text-indigo-400' 
                          : 'border-slate-800 bg-slate-950 text-slate-500'
                      }`}
                    >
                      WhatsApp
                    </button>
                    <button
                      type="button"
                      onClick={() => setShareChannel('EMAIL')}
                      className={`py-2 px-4 rounded-xl border text-xs font-semibold transition-all duration-200 ${
                        shareChannel === 'EMAIL' 
                          ? 'bg-indigo-600/10 border-indigo-500/40 text-indigo-400' 
                          : 'border-slate-800 bg-slate-950 text-slate-500'
                      }`}
                    >
                      Email
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShareDrawerOpen(false)}
                    className="px-4 py-2 border border-slate-800 hover:bg-slate-800 rounded-xl text-xs font-semibold text-slate-450"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleShareSubmit}
                    disabled={sharingLoading}
                    className="inline-flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold disabled:opacity-50"
                  >
                    {sharingLoading ? <Loader size={14} className="animate-spin" /> : <Send size={14} />}
                    <span>{shareChannel === 'WHATSAPP' ? 'Share on WhatsApp' : 'Send Email'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Property Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg rounded-2xl p-6 shadow-2xl relative overflow-y-auto max-h-[90vh]">
            <h3 className="font-bold text-lg text-slate-100 mb-4">Add Property Listing</h3>
            
            <form onSubmit={handleCreateProperty} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Listing Title</label>
                  <input 
                    type="text" 
                    required 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 block w-full px-3 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                    placeholder="e.g. Skyline Heights 2BHK"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Project / Phase Name</label>
                  <input 
                    type="text" 
                    required 
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="mt-1 block w-full px-3 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                    placeholder="e.g. Skyline Towers Phase 1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Property Type</label>
                  <select
                    value={propType}
                    onChange={(e) => setPropType(e.target.value)}
                    className="mt-1 block w-full px-3 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-xs focus:outline-none"
                  >
                    <option value="Apartment">Apartment</option>
                    <option value="Villa">Villa</option>
                    <option value="Plot">Plot</option>
                    <option value="Studio">Studio</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Price (INR)</label>
                  <input 
                    type="number" 
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="mt-1 block w-full px-3 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                    placeholder="e.g. 7500000"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Size / Area</label>
                  <input 
                    type="text" 
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="mt-1 block w-full px-3 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                    placeholder="e.g. 1250 sqft"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Bedrooms</label>
                  <input 
                    type="number" 
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    className="mt-1 block w-full px-3 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                    placeholder="2"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Bathrooms</label>
                  <input 
                    type="number" 
                    value={bathrooms}
                    onChange={(e) => setBathrooms(e.target.value)}
                    className="mt-1 block w-full px-3 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                    placeholder="2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Location (City/Sub)</label>
                  <input 
                    type="text" 
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="mt-1 block w-full px-3 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                    placeholder="e.g. Whitefield, Bangalore"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Brochure URL</label>
                  <input 
                    type="url" 
                    value={brochureUrl}
                    onChange={(e) => setBrochureUrl(e.target.value)}
                    className="mt-1 block w-full px-3 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                    placeholder="https://brochure.pdf"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Detailed Address</label>
                <input 
                  type="text" 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="mt-1 block w-full px-3 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-sm focus:outline-none focus:ring-1"
                  placeholder="e.g. ECC Road, Whitefield, Bangalore"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Amenities (comma-separated)</label>
                <input 
                  type="text" 
                  value={amenityInput}
                  onChange={(e) => setAmenityInput(e.target.value)}
                  className="mt-1 block w-full px-3 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-sm focus:outline-none focus:ring-1"
                  placeholder="Gym, Swimming Pool, Clubhouse, Power Backup"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Description</label>
                <textarea 
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                  rows={3}
                  placeholder="Detailed specifications, options, possession dates..."
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button 
                  type="button" 
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2.5 border border-slate-800 hover:bg-slate-900 rounded-xl text-xs font-semibold text-slate-450"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2.5 bg-brand-600 hover:bg-brand-500 rounded-xl text-xs font-semibold text-white shadow-lg shadow-brand-600/10"
                >
                  Save Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
