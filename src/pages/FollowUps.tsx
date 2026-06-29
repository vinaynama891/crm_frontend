import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Clock, 
  Check, 
  Calendar, 
  User, 
  ExternalLink,
  RotateCcw,
  CheckCircle2,
  ListTodo,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FollowUp {
  id: string;
  title: string;
  notes: string | null;
  scheduledAt: string;
  status: 'PENDING' | 'COMPLETED' | 'SNOOZED' | 'RESCHEDULED';
  lead: {
    id: string;
    fullName: string;
    phone: string;
  };
}

export const FollowUps: React.FC = () => {
  const navigate = useNavigate();
  const [followups, setFollowups] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('PENDING');

  // Reschedule state
  const [rescheduleId, setRescheduleId] = useState<string | null>(null);
  const [newDateString, setNewDateString] = useState('');

  const fetchFollowUps = async () => {
    try {
      const url = statusFilter ? `/followups?status=${statusFilter}` : '/followups';
      const res = await api.get(url);
      setFollowups(res.data);
    } catch (err) {
      console.error('[Followups] Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowUps();
  }, [statusFilter]);

  const handleComplete = async (id: string) => {
    try {
      await api.post(`/followups/${id}/complete`);
      fetchFollowUps();
    } catch (err) {
      console.error('Failed to complete:', err);
    }
  };

  const handleSnooze = async (id: string) => {
    try {
      await api.post(`/followups/${id}/snooze`, { minutes: 60 });
      fetchFollowUps();
    } catch (err) {
      console.error('Failed to snooze:', err);
    }
  };

  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleId || !newDateString) return;

    try {
      await api.post(`/followups/${rescheduleId}/reschedule`, {
        newDate: new Date(newDateString).toISOString(),
      });
      setRescheduleId(null);
      setNewDateString('');
      fetchFollowUps();
    } catch (err) {
      console.error('Failed to reschedule:', err);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20';
      case 'COMPLETED': return 'bg-green-500/10 text-green-400 border border-green-500/20';
      case 'SNOOZED': return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      default: return 'bg-purple-500/10 text-purple-400 border border-purple-500/20'; // RESCHEDULED
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title & Filters */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Follow-Ups Queue</h2>
          <p className="text-xs text-slate-400 mt-1">Check off, snooze, or reschedule scheduled follow-ups</p>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-xl text-xs px-3 py-2 text-slate-400 focus:outline-none"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="SNOOZED">Snoozed</option>
          <option value="RESCHEDULED">Rescheduled</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin"></div>
          <p className="mt-3 text-xs text-slate-650 uppercase font-bold tracking-wider">Loading tasks queue...</p>
        </div>
      ) : followups.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl text-center border-slate-900">
          <ListTodo size={32} className="mx-auto text-slate-600 mb-3 opacity-60" />
          <h3 className="font-bold text-slate-350 text-sm font-semibold">No Follow-ups Found</h3>
          <p className="text-xs text-slate-505 text-slate-500 mt-1">All caught up! There are no tasks matching this status.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {followups.map((f) => (
            <div key={f.id} className="glass-panel p-4 rounded-2xl border-slate-900 flex flex-col justify-between space-y-4 hover:border-slate-800/80 transition-colors">
              <div className="space-y-3">
                
                {/* Header */}
                <div className="flex items-start justify-between">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${getStatusBadge(f.status)}`}>
                    {f.status}
                  </span>
                  <div className="text-[10px] text-slate-500 flex items-center gap-1 font-medium">
                    <Clock size={12} />
                    <span>{new Date(f.scheduledAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                  </div>
                </div>

                {/* Task Title */}
                <div>
                  <h4 className="font-bold text-slate-200 text-sm leading-snug">{f.title}</h4>
                  {f.notes && <p className="text-xs text-slate-400 mt-1 line-clamp-2">{f.notes}</p>}
                </div>

                {/* Lead client */}
                <div className="flex items-center justify-between text-xs border-t border-slate-850/60 pt-2.5">
                  <div className="flex items-center space-x-1.5">
                    <User size={13} className="text-slate-500" />
                    <span className="font-semibold text-slate-350">{f.lead.fullName}</span>
                  </div>

                  <button 
                    onClick={() => navigate(`/leads/${f.lead.id}`)}
                    className="text-[10px] text-brand-400 hover:underline flex items-center gap-0.5 font-semibold"
                  >
                    Manage Lead <ExternalLink size={10} />
                  </button>
                </div>

              </div>

              {/* Action Buttons (Only for non-completed) */}
              {f.status !== 'COMPLETED' && (
                <div className="pt-2 border-t border-slate-850/60 flex gap-2">
                  <button
                    onClick={() => handleComplete(f.id)}
                    className="flex-1 inline-flex items-center justify-center space-x-1.5 py-2 rounded-xl text-xs font-bold bg-green-500/10 hover:bg-green-500 text-green-400 hover:text-white transition-all duration-200 shadow-sm"
                  >
                    <Check size={14} />
                    <span>Complete</span>
                  </button>
                  <button
                    onClick={() => handleSnooze(f.id)}
                    className="inline-flex items-center justify-center p-2 rounded-xl bg-slate-950 border border-slate-850 hover:bg-slate-900 text-slate-400 hover:text-slate-200 transition-all duration-200"
                    title="Snooze 1 hour"
                  >
                    <Clock size={14} />
                  </button>
                  <button
                    onClick={() => { setRescheduleId(f.id); }}
                    className="inline-flex items-center justify-center p-2 rounded-xl bg-slate-950 border border-slate-850 hover:bg-slate-900 text-slate-400 hover:text-slate-200 transition-all duration-200"
                    title="Reschedule Date"
                  >
                    <RotateCcw size={14} />
                  </button>
                </div>
              )}

              {/* Completed Visual Stamp */}
              {f.status === 'COMPLETED' && (
                <div className="pt-1 flex items-center justify-center text-[10px] font-bold text-green-500 space-x-1 uppercase">
                  <CheckCircle2 size={12} />
                  <span>Task Completed</span>
                </div>
              )}

            </div>
          ))}
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleId && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-sm rounded-2xl p-6 shadow-2xl">
            <h3 className="font-bold text-lg text-slate-100 mb-2">Reschedule Task</h3>
            <p className="text-xs text-slate-500 mb-4">Choose a new target date and time for follow-up.</p>

            <form onSubmit={handleRescheduleSubmit} className="space-y-4">
              <input 
                type="datetime-local" 
                required
                value={newDateString}
                onChange={(e) => setNewDateString(e.target.value)}
                className="block w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-xl text-xs focus:outline-none"
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => { setRescheduleId(null); setNewDateString(''); }}
                  className="px-4 py-2 border border-slate-800 hover:bg-slate-900 rounded-xl text-xs text-slate-400 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-500 rounded-xl text-xs text-white font-semibold"
                >
                  Confirm Date
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
