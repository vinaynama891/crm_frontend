import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Search, 
  Filter, 
  Plus, 
  Flame, 
  PhoneCall, 
  Clock, 
  Calendar,
  CheckCircle,
  AlertTriangle,
  User,
  Users,
  ArrowRight,
  TrendingUp
} from 'lucide-react';

interface Lead {
  id: string;
  fullName: string;
  phone: string;
  email: string | null;
  source: string;
  propertyType: string | null;
  budget: number | null;
  preferredLocation: string | null;
  status: string;
  temperature: 'Cold' | 'Warm' | 'Hot';
  assignedAgent: {
    profile: {
      fullName: string;
    };
  } | null;
  createdAt: string;
}

export const Leads: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { organization } = useAuth();
  
  const [leads, setLeads] = useState<Lead[]>([]);
  const [agents, setAgents] = useState<{ id: string; fullName: string }[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [tempFilter, setTempFilter] = useState('');
  const [agentFilter, setAgentFilter] = useState('');
  
  // Add Lead Modal State
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [source, setSource] = useState('Manual Input');
  const [propType, setPropType] = useState('Apartment');
  const [budget, setBudget] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [temp, setTemp] = useState('Hot');

  // Trigger modal if query param action=add is set
  useEffect(() => {
    if (searchParams.get('action') === 'add') {
      setAddModalOpen(true);
    }
  }, [searchParams]);

  const fetchLeads = async () => {
    try {
      const qParams = new URLSearchParams();
      if (search) qParams.append('search', search);
      if (statusFilter) qParams.append('status', statusFilter);
      if (tempFilter) qParams.append('temperature', tempFilter);
      if (agentFilter) qParams.append('agentId', agentFilter);

      const res = await api.get(`/leads?${qParams.toString()}`);
      setLeads(res.data);
    } catch (err) {
      console.error('[Leads] Fetch leads error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeam = async () => {
    if (organization?.role === 'SALES_AGENT') return;
    try {
      const res = await api.get('/auth/team');
      setAgents(res.data.filter((m: any) => m.role === 'SALES_AGENT'));
    } catch (err) {
      console.error('[Leads] Fetch agents error:', err);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [search, statusFilter, tempFilter, agentFilter]);

  useEffect(() => {
    fetchTeam();
  }, [organization]);

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    try {
      const res = await api.post('/leads', {
        fullName: name,
        phone,
        email: email || null,
        source,
        propertyType: propType,
        budget: budget ? parseFloat(budget) : null,
        preferredLocation: location || null,
        notes: notes || null,
        temperature: temp,
      });

      setAddModalOpen(false);
      setName('');
      setPhone('');
      setEmail('');
      setBudget('');
      setLocation('');
      setNotes('');
      fetchLeads();
      navigate(`/leads/${res.data.id}`);
    } catch (err) {
      console.error('Error creating lead:', err);
      alert('Failed to save lead.');
    }
  };

  const getTempBadgeColor = (temp: 'Cold' | 'Warm' | 'Hot') => {
    if (temp === 'Hot') return 'bg-red-500/10 text-red-400 border border-red-500/20';
    if (temp === 'Warm') return 'bg-orange-500/10 text-orange-400 border border-orange-500/20';
    return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'Contacted': return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20';
      case 'Interested': return 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20';
      case 'SiteVisitScheduled': return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
      case 'Negotiation': return 'bg-orange-500/10 text-orange-400 border border-orange-500/20';
      case 'Booked': return 'bg-green-500/10 text-green-400 border border-green-500/20';
      case 'Lost': return 'bg-slate-500/10 text-slate-400 border border-slate-800';
      default: return 'bg-red-500/10 text-red-400 border border-red-500/20'; // Not Responding
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Title & Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Leads Pipeline</h2>
          <p className="text-xs text-slate-400 mt-1">Manage, search, and assign incoming customer requests</p>
        </div>
        <button
          onClick={() => setAddModalOpen(true)}
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 text-white hover:bg-brand-500 transition-all duration-200 shadow-lg shadow-brand-500/10"
        >
          <Plus size={16} />
          <span>New Lead</span>
        </button>
      </div>

      {/* Filters Panel */}
      <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-4 space-y-3.5">
        <div className="flex flex-col sm:flex-row gap-3">
          
          {/* Search bar */}
          <div className="relative flex-1 rounded-xl shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <Search size={16} />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none text-xs"
              placeholder="Search by name, phone, email, locality..."
            />
          </div>

          <div className="flex gap-2 shrink-0">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block bg-slate-950/80 border border-slate-800 rounded-xl text-xs px-3 py-2 text-slate-400 focus:outline-none"
            >
              <option value="">All Statuses</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Interested">Interested</option>
              <option value="SiteVisitScheduled">Site Visit</option>
              <option value="Negotiation">Negotiation</option>
              <option value="Booked">Booked</option>
              <option value="Lost">Lost</option>
              <option value="NotResponding">Not Responding</option>
            </select>

            {/* Temperature Filter */}
            <select
              value={tempFilter}
              onChange={(e) => setTempFilter(e.target.value)}
              className="block bg-slate-950/80 border border-slate-800 rounded-xl text-xs px-3 py-2 text-slate-400 focus:outline-none"
            >
              <option value="">All Temps</option>
              <option value="Hot">Hot</option>
              <option value="Warm">Warm</option>
              <option value="Cold">Cold</option>
            </select>

            {/* Agent Filter (Admin/Manager only) */}
            {organization?.role !== 'SALES_AGENT' && (
              <select
                value={agentFilter}
                onChange={(e) => setAgentFilter(e.target.value)}
                className="block bg-slate-950/80 border border-slate-800 rounded-xl text-xs px-3 py-2 text-slate-400 focus:outline-none max-w-[120px] truncate"
              >
                <option value="">All Agents</option>
                {agents.map((agent) => (
                  <option key={agent.id} value={agent.id}>{agent.fullName}</option>
                ))}
              </select>
            )}
          </div>

        </div>
      </div>

      {/* Leads List Loader */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin"></div>
          <p className="mt-3 text-xs text-slate-600 uppercase font-bold tracking-wider">Fetching Leads...</p>
        </div>
      ) : leads.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl text-center border-slate-900">
          <Users size={32} className="mx-auto text-slate-600 mb-3 opacity-60" />
          <h3 className="font-bold text-slate-350 text-sm">No Leads Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">There are no leads in this view matching your criteria. Try widening your filters.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-hidden bg-slate-900/40 border border-slate-900 rounded-2xl shadow-xl">
            <table className="min-w-full divide-y divide-slate-850">
              <thead className="bg-slate-950/60">
                <tr>
                  <th className="px-6 py-3.5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Lead Info</th>
                  <th className="px-6 py-3.5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Source</th>
                  <th className="px-6 py-3.5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Requirement</th>
                  <th className="px-6 py-3.5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3.5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Temp</th>
                  <th className="px-6 py-3.5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Agent</th>
                  <th className="px-6 py-3.5 text-right text-[10px] font-bold text-slate-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850/60 bg-transparent">
                {leads.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <h4 className="font-semibold text-slate-200 text-sm">{l.fullName}</h4>
                        <span className="text-[10px] text-slate-500 block mt-0.5">{l.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-xs text-slate-350">{l.source}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-xs text-slate-350">
                        <span>{l.propertyType || 'Apartment'}</span>
                        {l.budget && (
                          <span className="text-slate-500 block text-[10px] mt-0.5">
                            ₹{(l.budget / 100000).toFixed(1)} Lakhs • {l.preferredLocation || 'Any'}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadgeColor(l.status)}`}>
                        {l.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getTempBadgeColor(l.temperature)}`}>
                        {l.temperature}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1.5 text-xs text-slate-400">
                        <User size={12} className="text-slate-500" />
                        <span>{l.assignedAgent?.profile.fullName || 'Unassigned'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium">
                      <button 
                        onClick={() => navigate(`/leads/${l.id}`)}
                        className="inline-flex items-center space-x-1 text-brand-400 hover:text-brand-300 font-semibold"
                      >
                        <span>Manage</span>
                        <ArrowRight size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {leads.map((l) => (
              <div 
                key={l.id} 
                onClick={() => navigate(`/leads/${l.id}`)}
                className="p-4 bg-slate-900/40 border border-slate-900 rounded-2xl space-y-3 cursor-pointer hover:bg-slate-900/60 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-slate-200 text-sm">{l.fullName}</h4>
                    <span className="text-[10px] text-slate-500">{l.phone}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${getStatusBadgeColor(l.status)}`}>
                    {l.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs border-t border-slate-850/60 pt-2.5">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Requirement</span>
                    <p className="text-slate-350 font-medium text-[11px]">
                      {l.propertyType || 'Apartment'} {l.budget ? `(₹${(l.budget / 100000).toFixed(1)} L)` : ''}
                    </p>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold ${getTempBadgeColor(l.temperature)}`}>
                    {l.temperature}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Add Lead Slide-out / Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg rounded-2xl p-6 shadow-2xl relative overflow-y-auto max-h-[90vh]">
            <h3 className="font-bold text-lg text-slate-100 mb-4">Add Manual Lead</h3>
            
            <form onSubmit={handleCreateLead} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Full Name</label>
                  <input 
                    type="text" 
                    required 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full px-3 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                    placeholder="Rahul Verma"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Phone Number</label>
                  <input 
                    type="tel" 
                    required 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1 block w-full px-3 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                    placeholder="+919900112233"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Email Address</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full px-3 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                    placeholder="rahul.v@gmail.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Lead Source</label>
                  <select 
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="mt-1 block w-full px-3 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-xs focus:outline-none"
                  >
                    <option value="Manual Input">Manual Input</option>
                    <option value="Facebook Lead Ads">Facebook Ads</option>
                    <option value="Instagram Lead Ads">Instagram Ads</option>
                    <option value="Website Form">Website Form</option>
                    <option value="MagicBricks">MagicBricks</option>
                    <option value="Housing.com">Housing.com</option>
                    <option value="99acres">99acres</option>
                  </select>
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
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Budget (INR)</label>
                  <input 
                    type="number" 
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="mt-1 block w-full px-3 py-2.5 bg-slate-950 border border-slate-855 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                    placeholder="e.g. 7500000"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Location Pref.</label>
                  <input 
                    type="text" 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="mt-1 block w-full px-3 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                    placeholder="e.g. Whitefield"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Lead Temperature</label>
                  <div className="mt-1.5 flex gap-2">
                    {['Hot', 'Warm', 'Cold'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTemp(t)}
                        className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all duration-200 ${
                          temp === t 
                            ? t === 'Hot' ? 'bg-red-500/10 border-red-500/40 text-red-400' 
                              : t === 'Warm' ? 'bg-orange-500/10 border-orange-500/40 text-orange-400'
                              : 'bg-blue-500/10 border-blue-500/40 text-blue-400'
                            : 'border-slate-850 bg-slate-950 text-slate-500 hover:text-slate-400'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Initial Description / Notes</label>
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                  rows={3}
                  placeholder="Additional customer requirements, references..."
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
                  Create Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
