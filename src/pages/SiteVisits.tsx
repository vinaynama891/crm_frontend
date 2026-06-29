import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Calendar, 
  MapPin, 
  User, 
  Building2, 
  Check, 
  X, 
  AlertCircle,
  Clock,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SiteVisit {
  id: string;
  scheduledAt: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'NoShow';
  notes: string;
  lead: {
    id: string;
    fullName: string;
    phone: string;
  };
  property: {
    id: string;
    title: string;
    projectName: string;
  };
  agent: {
    profile: {
      fullName: string;
    };
  };
}

export const SiteVisits: React.FC = () => {
  const navigate = useNavigate();
  const [visits, setVisits] = useState<SiteVisit[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  // Status Change State
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [outcomeNotes, setOutcomeNotes] = useState('');
  const [statusToSet, setStatusToSet] = useState<'Completed' | 'Cancelled' | 'NoShow' | null>(null);

  const fetchSiteVisits = async () => {
    try {
      const url = statusFilter ? `/sitevisits?status=${statusFilter}` : '/sitevisits';
      const res = await api.get(url);
      setVisits(res.data);
    } catch (err) {
      console.error('[SiteVisits] Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSiteVisits();
  }, [statusFilter]);

  const handleStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updatingId || !statusToSet) return;

    try {
      await api.put(`/sitevisits/${updatingId}/status`, {
        status: statusToSet,
        notes: outcomeNotes,
      });

      setUpdatingId(null);
      setStatusToSet(null);
      setOutcomeNotes('');
      fetchSiteVisits();
    } catch (err) {
      console.error('[SiteVisits] Update status error:', err);
      alert('Failed to update visit status.');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'Completed': return 'bg-green-500/10 text-green-400 border border-green-500/20';
      case 'Cancelled': return 'bg-red-500/10 text-red-400 border border-red-500/20';
      default: return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'; // NoShow
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Site Visits Planner</h2>
          <p className="text-xs text-slate-400 mt-1">Track property tours, completions, no-shows, and cancellations</p>
        </div>

        {/* Filter dropdown */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-xl text-xs px-3 py-2 text-slate-400 focus:outline-none"
        >
          <option value="">All Statuses</option>
          <option value="Scheduled">Scheduled</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
          <option value="NoShow">No Show</option>
        </select>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin"></div>
          <p className="mt-3 text-xs text-slate-650 uppercase font-bold tracking-wider">Loading visits schedule...</p>
        </div>
      ) : visits.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl text-center border-slate-900">
          <Calendar size={32} className="mx-auto text-slate-600 mb-3 opacity-60" />
          <h3 className="font-bold text-slate-350 text-sm">No Site Visits Scheduled</h3>
          <p className="text-xs text-slate-500 mt-1">There are no property visits matching the selected filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visits.map((v) => (
            <div key={v.id} className="glass-panel p-5 rounded-2xl border-slate-900 flex flex-col justify-between space-y-4 hover:border-slate-800/80 transition-colors">
              <div className="space-y-3">
                
                {/* Header info */}
                <div className="flex items-start justify-between">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${getStatusBadge(v.status)}`}>
                    {v.status === 'NoShow' ? 'No Show' : v.status}
                  </span>
                  <div className="text-right text-[10px] text-slate-500 flex items-center gap-1 font-medium">
                    <Clock size={12} />
                    <span>{new Date(v.scheduledAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                  </div>
                </div>

                {/* Lead Name */}
                <div className="space-y-1">
                  <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Customer Prospect</span>
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-205 text-sm flex items-center gap-1">
                      <User size={14} className="text-slate-450" /> {v.lead.fullName}
                    </h4>
                    <button 
                      onClick={() => navigate(`/leads/${v.lead.id}`)}
                      className="text-[10px] text-brand-400 hover:underline flex items-center gap-0.5 font-semibold"
                    >
                      View Timeline <ExternalLink size={10} />
                    </button>
                  </div>
                </div>

                {/* Property Name */}
                <div className="space-y-0.5">
                  <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Selected Property</span>
                  <p className="text-xs text-slate-350 font-semibold flex items-center gap-1">
                    <Building2 size={13} className="text-slate-450 shrink-0" /> {v.property.title}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate pl-4">Project: {v.property.projectName}</p>
                </div>

                {/* Agent Assign */}
                <div className="text-xs text-slate-500 pt-1">
                  <span>Assigned Agent: <strong>{v.agent.profile.fullName}</strong></span>
                </div>

                {/* Notes */}
                {v.notes && (
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-900 text-[11px] text-slate-400 leading-relaxed italic">
                    "{v.notes}"
                  </div>
                )}

              </div>

              {/* Status Update Quick Buttons (only if Scheduled) */}
              {v.status === 'Scheduled' && (
                <div className="pt-2 border-t border-slate-850/60 flex gap-2">
                  <button
                    onClick={() => { setUpdatingId(v.id); setStatusToSet('Completed'); }}
                    className="flex-1 inline-flex items-center justify-center space-x-1 py-1.5 rounded-xl text-[10px] font-bold bg-green-500/10 hover:bg-green-500 text-green-450 hover:text-white transition-all duration-200"
                  >
                    <Check size={12} />
                    <span>Complete</span>
                  </button>
                  <button
                    onClick={() => { setUpdatingId(v.id); setStatusToSet('NoShow'); }}
                    className="flex-1 inline-flex items-center justify-center space-x-1 py-1.5 rounded-xl text-[10px] font-bold bg-yellow-500/10 hover:bg-yellow-500 text-yellow-450 hover:text-white transition-all duration-200"
                  >
                    <AlertCircle size={12} />
                    <span>No Show</span>
                  </button>
                  <button
                    onClick={() => { setUpdatingId(v.id); setStatusToSet('Cancelled'); }}
                    className="flex-1 inline-flex items-center justify-center space-x-1 py-1.5 rounded-xl text-[10px] font-bold bg-red-500/10 hover:bg-red-500 text-red-450 hover:text-white transition-all duration-200"
                  >
                    <X size={12} />
                    <span>Cancel</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Outcome Notes Modal */}
      {updatingId && statusToSet && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md rounded-2xl p-6 shadow-2xl">
            <h3 className="font-bold text-lg text-slate-100 mb-2">Mark Visit as {statusToSet}</h3>
            <p className="text-xs text-slate-550 text-slate-400 mb-4">Provide details on tour outcomes, customer feedback, or reasons for no-show.</p>
            
            <form onSubmit={handleStatusSubmit} className="space-y-4">
              <textarea
                required
                value={outcomeNotes}
                onChange={(e) => setOutcomeNotes(e.target.value)}
                className="block w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                rows={4}
                placeholder="Enter feedback notes..."
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => { setUpdatingId(null); setStatusToSet(null); setOutcomeNotes(''); }}
                  className="px-4 py-2 border border-slate-800 hover:bg-slate-900 rounded-xl text-xs text-slate-400 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-500 rounded-xl text-xs text-white font-semibold"
                >
                  Save Outcome
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
