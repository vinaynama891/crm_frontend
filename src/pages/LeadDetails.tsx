import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  PhoneCall, 
  MessageSquare, 
  FileText, 
  MapPin, 
  Clock, 
  Share2, 
  User, 
  TrendingUp, 
  Plus, 
  Check, 
  ArrowLeft,
  Calendar,
  Layers,
  CircleDollarSign,
  Building,
  Volume2
} from 'lucide-react';

interface Activity {
  id: string;
  type: 'CALL' | 'WHATSAPP' | 'NOTE' | 'SHARE' | 'FOLLOWUP' | 'STATUS_CHANGE' | 'SITE_VISIT';
  content: string;
  createdAt: string;
  agent?: {
    profile: {
      fullName: string;
    };
  } | null;
}

interface Call {
  id: string;
  callSid: string;
  duration: number;
  recordingUrl: string | null;
  outcome: string;
  createdAt: string;
}

interface Property {
  id: string;
  title: string;
  projectName: string;
  location: string;
  price: number;
}

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
  assignedAgentId: string | null;
  notes: string | null;
  createdAt: string;
  activities: Activity[];
  calls: Call[];
  properties?: Property[];
}

export const LeadDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { organization } = useAuth();

  const [lead, setLead] = useState<Lead | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [agents, setAgents] = useState<{ id: string; fullName: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [callingState, setCallingState] = useState<'idle' | 'calling' | 'connected'>('idle');

  // Modal triggers
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [waModalOpen, setWaModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [visitModalOpen, setVisitModalOpen] = useState(false);
  const [followModalOpen, setFollowModalOpen] = useState(false);

  // Form states
  const [noteText, setNoteText] = useState('');
  const [waTemplate, setWaTemplate] = useState<'Welcome' | 'FollowUp' | 'SiteVisit' | 'MissedCall'>('Welcome');
  const [selectedPropertyId, setSelectedPropertyId] = useState('');
  
  // Followup form
  const [followTitle, setFollowTitle] = useState('Call to follow up');
  const [followDate, setFollowDate] = useState('');
  const [followNotes, setFollowNotes] = useState('');

  // Site visit form
  const [visitPropertyId, setVisitPropertyId] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [visitNotes, setVisitNotes] = useState('');

  const fetchLeadDetails = async () => {
    try {
      const res = await api.get(`/leads/${id}`);
      setLead(res.data);
    } catch (err) {
      console.error('Error fetching lead details:', err);
      alert('Lead not found or unauthorized access.');
      navigate('/leads');
    }
  };

  const fetchPropertiesAndAgents = async () => {
    try {
      const propRes = await api.get('/properties');
      setProperties(propRes.data);
      if (propRes.data.length > 0) {
        setSelectedPropertyId(propRes.data[0].id);
        setVisitPropertyId(propRes.data[0].id);
      }

      if (organization?.role !== 'SALES_AGENT') {
        const teamRes = await api.get('/auth/team');
        setAgents(teamRes.data.filter((m: any) => m.role === 'SALES_AGENT'));
      }
    } catch (err) {
      console.error('Error fetching properties/agents:', err);
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchLeadDetails(), fetchPropertiesAndAgents()]).finally(() => {
      setLoading(false);
    });
  }, [id]);

  const handleUpdateStatus = async (status: string) => {
    try {
      await api.put(`/leads/${id}`, { status });
      fetchLeadDetails();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleUpdateTemp = async (temperature: string) => {
    try {
      await api.put(`/leads/${id}`, { temperature });
      fetchLeadDetails();
    } catch (err) {
      console.error('Error updating temperature:', err);
    }
  };

  const handleReassignAgent = async (agentId: string) => {
    if (!agentId) return;
    try {
      await api.post(`/leads/${id}/assign`, { agentId });
      fetchLeadDetails();
    } catch (err) {
      console.error('Error reassigning agent:', err);
    }
  };

  const handleCallBridge = async () => {
    setCallingState('calling');
    try {
      await api.post(`/leads/${id}/call`, { dryRun: true });
      
      // Simulate ringing and connected states for visual wow
      setTimeout(() => {
        setCallingState('connected');
      }, 2000);
      
      setTimeout(() => {
        setCallingState('idle');
        fetchLeadDetails(); // refresh timeline for call completed
      }, 7000);

    } catch (err) {
      console.error('Failed to place call:', err);
      setCallingState('idle');
      alert('Failed to place call bridge.');
    }
  };

  const handleSendWhatsApp = async () => {
    try {
      await api.post(`/leads/${id}/whatsapp`, {
        templateName: waTemplate,
        variables: {},
        dryRun: true,
      });
      setWaModalOpen(false);
      fetchLeadDetails();
    } catch (err) {
      console.error('WhatsApp failed:', err);
      alert('Failed to send WhatsApp.');
    }
  };

  const handleShareProperty = async () => {
    if (!selectedPropertyId) return;
    try {
      await api.post(`/leads/${id}/share`, {
        propertyId: selectedPropertyId,
        channel: 'WHATSAPP',
        dryRun: true,
      });
      setShareModalOpen(false);
      fetchLeadDetails();
    } catch (err) {
      console.error('Property share failed:', err);
      alert('Failed to share property.');
    }
  };

  const handleScheduleFollowup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!followTitle || !followDate) return;

    try {
      await api.post('/followups', {
        leadId: id,
        title: followTitle,
        notes: followNotes,
        scheduledAt: new Date(followDate).toISOString(),
      });
      setFollowModalOpen(false);
      setFollowTitle('Call to follow up');
      setFollowDate('');
      setFollowNotes('');
      fetchLeadDetails();
    } catch (err) {
      console.error('Followup failed:', err);
      alert('Failed to schedule follow-up.');
    }
  };

  const handleScheduleSiteVisit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitPropertyId || !visitDate) return;

    try {
      await api.post('/sitevisits', {
        leadId: id,
        propertyId: visitPropertyId,
        scheduledAt: new Date(visitDate).toISOString(),
        notes: visitNotes,
      });
      setVisitModalOpen(false);
      setVisitDate('');
      setVisitNotes('');
      fetchLeadDetails();
    } catch (err) {
      console.error('Site visit failed:', err);
      alert('Failed to schedule site visit.');
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;

    try {
      await api.post(`/leads/${id}/notes`, { note: noteText });
      setNoteModalOpen(false);
      setNoteText('');
      fetchLeadDetails();
    } catch (err) {
      console.error('Notes addition failed:', err);
      alert('Failed to add note.');
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'CALL': return <PhoneCall size={14} className="text-green-400" />;
      case 'WHATSAPP': return <MessageSquare size={14} className="text-indigo-400" />;
      case 'NOTE': return <FileText size={14} className="text-slate-400" />;
      case 'SHARE': return <Share2 size={14} className="text-sky-400" />;
      case 'FOLLOWUP': return <Clock size={14} className="text-yellow-400" />;
      case 'SITE_VISIT': return <MapPin size={14} className="text-violet-400" />;
      default: return <Layers size={14} className="text-brand-400" />; // STATUS_CHANGE
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'SiteVisitScheduled': return 'Site Visit Scheduled';
      case 'NotResponding': return 'Not Responding';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin"></div>
        <p className="mt-3 text-xs text-slate-600 uppercase font-bold tracking-wider">Loading Timeline...</p>
      </div>
    );
  }

  if (!lead) return null;

  return (
    <div className="space-y-6">
      
      {/* Back button and Calling State Banner */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/leads')}
          className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-slate-200"
        >
          <ArrowLeft size={16} />
          <span>Back to pipeline</span>
        </button>

        {callingState !== 'idle' && (
          <div className="px-4 py-1.5 rounded-full text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/30 flex items-center space-x-2 call-pulse">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
            <span>{callingState === 'calling' ? 'Dialing Agent...' : 'Call Bridge Active'}</span>
          </div>
        )}
      </div>

      {/* Main Info Card */}
      <div className="glass-panel p-5 rounded-2xl space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-[10px] text-brand-400 font-bold uppercase tracking-wider">{lead.source}</span>
            <h2 className="text-2xl font-bold text-white tracking-tight mt-0.5">{lead.fullName}</h2>
            <p className="text-xs text-slate-500 mt-1">Phone: {lead.phone} {lead.email ? `• Email: ${lead.email}` : ''}</p>
          </div>

          {/* Quick Actions Panel */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <button 
              onClick={handleCallBridge}
              disabled={callingState !== 'idle'}
              className="flex-1 md:flex-none inline-flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-green-600 hover:bg-green-500 text-white disabled:opacity-50 transition-all duration-200"
            >
              <PhoneCall size={14} />
              <span>Call Lead</span>
            </button>

            <button 
              onClick={() => setWaModalOpen(true)}
              className="flex-1 md:flex-none inline-flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all duration-200"
            >
              <MessageSquare size={14} />
              <span>WhatsApp</span>
            </button>

            <button 
              onClick={() => setShareModalOpen(true)}
              className="flex-1 md:flex-none inline-flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all duration-200"
            >
              <Share2 size={14} />
              <span>Share Prop</span>
            </button>
          </div>
        </div>

        {/* Lead Specific Requirement Tags */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/50 p-3 rounded-xl border border-slate-900">
          <div className="space-y-0.5">
            <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider flex items-center gap-1">
              <Building size={10} /> Pref. Type
            </span>
            <p className="text-xs text-slate-200 font-semibold">{lead.propertyType || 'Apartment'}</p>
          </div>
          <div className="space-y-0.5">
            <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider flex items-center gap-1">
              <CircleDollarSign size={10} /> Budget
            </span>
            <p className="text-xs text-slate-200 font-semibold">
              {lead.budget ? `₹${(lead.budget / 100000).toFixed(1)} Lakhs` : 'Any'}
            </p>
          </div>
          <div className="space-y-0.5">
            <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider flex items-center gap-1">
              <MapPin size={10} /> Locality Pref.
            </span>
            <p className="text-xs text-slate-200 font-semibold truncate">{lead.preferredLocation || 'Any'}</p>
          </div>
          <div className="space-y-0.5">
            <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider flex items-center gap-1">
              <Calendar size={10} /> Lead Created
            </span>
            <p className="text-xs text-slate-200 font-semibold">{new Date(lead.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Status Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Lead Status</label>
            <select
              value={lead.status}
              onChange={(e) => handleUpdateStatus(e.target.value)}
              className="mt-1 block w-full bg-slate-950/80 border border-slate-800 rounded-xl text-xs px-3 py-2 text-slate-200 focus:outline-none"
            >
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Interested">Interested</option>
              <option value="SiteVisitScheduled">Site Visit Scheduled</option>
              <option value="Negotiation">Negotiation</option>
              <option value="Booked">Booked</option>
              <option value="Lost">Lost</option>
              <option value="NotResponding">Not Responding</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Lead Temp</label>
            <select
              value={lead.temperature}
              onChange={(e) => handleUpdateTemp(e.target.value)}
              className="mt-1 block w-full bg-slate-950/80 border border-slate-800 rounded-xl text-xs px-3 py-2 text-slate-200 focus:outline-none"
            >
              <option value="Hot">Hot</option>
              <option value="Warm">Warm</option>
              <option value="Cold">Cold</option>
            </select>
          </div>

          {/* Reassign Agent (Admin/Manager only) */}
          {organization?.role !== 'SALES_AGENT' && (
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Assigned Agent</label>
              <select
                value={lead.assignedAgentId || ''}
                onChange={(e) => handleReassignAgent(e.target.value)}
                className="mt-1 block w-full bg-slate-950/80 border border-slate-800 rounded-xl text-xs px-3 py-2 text-slate-200 focus:outline-none"
              >
                <option value="">Unassigned</option>
                {agents.map((agent) => (
                  <option key={agent.id} value={agent.id}>{agent.fullName}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Main split grid: Scheduling widgets & Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Scheduling & Notes Quick Actions */}
        <div className="lg:col-span-1 space-y-4">
          <div className="glass-panel p-5 rounded-2xl space-y-4">
            <h3 className="font-bold text-sm text-slate-200 border-b border-slate-800 pb-2">CRM Scheduling</h3>
            
            <div className="space-y-2">
              <button 
                onClick={() => setVisitModalOpen(true)}
                className="w-full inline-flex items-center justify-between px-4 py-3 bg-slate-950 border border-slate-850 rounded-xl text-xs hover:bg-slate-900 transition-colors"
              >
                <span className="font-semibold text-slate-350 flex items-center gap-2">
                  <MapPin size={14} className="text-violet-400" /> Schedule Site Visit
                </span>
                <Plus size={14} className="text-slate-500" />
              </button>

              <button 
                onClick={() => setFollowModalOpen(true)}
                className="w-full inline-flex items-center justify-between px-4 py-3 bg-slate-950 border border-slate-850 rounded-xl text-xs hover:bg-slate-900 transition-colors"
              >
                <span className="font-semibold text-slate-350 flex items-center gap-2">
                  <Clock size={14} className="text-yellow-400" /> Schedule Follow-up
                </span>
                <Plus size={14} className="text-slate-500" />
              </button>

              <button 
                onClick={() => setNoteModalOpen(true)}
                className="w-full inline-flex items-center justify-between px-4 py-3 bg-slate-950 border border-slate-850 rounded-xl text-xs hover:bg-slate-900 transition-colors"
              >
                <span className="font-semibold text-slate-350 flex items-center gap-2">
                  <FileText size={14} className="text-slate-400" /> Append Timeline Note
                </span>
                <Plus size={14} className="text-slate-500" />
              </button>
            </div>
          </div>
          
          {/* Call Recording Quick Access block */}
          {lead.calls.filter(c => c.recordingUrl).length > 0 && (
            <div className="glass-panel p-5 rounded-2xl space-y-3">
              <h3 className="font-bold text-sm text-slate-200 border-b border-slate-800 pb-2">Telephony Recordings</h3>
              <div className="space-y-3 max-h-56 overflow-y-auto">
                {lead.calls.filter(c => c.recordingUrl).map((call) => (
                  <div key={call.id} className="p-2.5 bg-slate-950/50 border border-slate-900 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span className="flex items-center gap-1"><Volume2 size={12} className="text-brand-400" /> Outgoing leg</span>
                      <span>{new Date(call.createdAt).toLocaleDateString()}</span>
                    </div>
                    {/* HTML5 Audio Player */}
                    <audio 
                      src={call.recordingUrl || ''} 
                      controls 
                      className="w-full h-8 rounded-lg outline-none bg-slate-900 text-xs" 
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Primary timeline feed */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-2xl space-y-4">
          <h3 className="font-bold text-sm text-slate-200 border-b border-slate-800 pb-2">Single Source of Truth Timeline</h3>
          
          <div className="relative pl-6 border-l border-slate-800/80 space-y-6 ml-3">
            {lead.activities.length === 0 ? (
              <p className="text-xs text-slate-500">No activity recorded on this lead yet.</p>
            ) : (
              lead.activities.map((act) => (
                <div key={act.id} className="relative group text-xs">
                  {/* Timeline dot icon container */}
                  <span className="absolute -left-10 top-0.5 bg-slate-900 border border-slate-800 rounded-full w-7.5 h-7.5 flex items-center justify-center shadow-lg">
                    {getActivityIcon(act.type)}
                  </span>
                  
                  <div>
                    <span className="text-[10px] text-slate-505 font-bold uppercase tracking-wider text-slate-500">
                      {act.type.replace('_', ' ')}
                    </span>
                    <p className="text-slate-200 mt-1 font-medium">{act.content}</p>
                    <div className="flex items-center space-x-2 mt-1.5 text-[10px] text-slate-500">
                      <span>{new Date(act.createdAt).toLocaleString()}</span>
                      <span>•</span>
                      <span>By: {act.agent?.profile.fullName || 'System'}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Append Note Modal */}
      {noteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md rounded-2xl p-6 shadow-2xl">
            <h3 className="font-bold text-lg text-slate-100 mb-4">Append Activity Note</h3>
            <form onSubmit={handleAddNote} className="space-y-4">
              <textarea 
                required
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="block w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                rows={4}
                placeholder="Enter client discussion notes, feedback, next steps..."
              />
              <div className="flex justify-end space-x-2">
                <button 
                  type="button" 
                  onClick={() => setNoteModalOpen(false)}
                  className="px-4 py-2 border border-slate-800 hover:bg-slate-900 rounded-xl text-xs text-slate-400 font-semibold"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-500 rounded-xl text-xs text-white font-semibold"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* WhatsApp Template Modal */}
      {waModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md rounded-2xl p-6 shadow-2xl">
            <h3 className="font-bold text-lg text-slate-100 mb-4">WhatsApp Template Assistant</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Select Template</label>
                <select 
                  value={waTemplate}
                  onChange={(e) => setWaTemplate(e.target.value as any)}
                  className="mt-1.5 block w-full bg-slate-950 border border-slate-850 rounded-xl text-xs px-3 py-2.5 text-slate-200 focus:outline-none"
                >
                  <option value="Welcome">Welcome Message</option>
                  <option value="FollowUp">Follow-Up Check</option>
                  <option value="SiteVisit">Site Visit Reminder</option>
                  <option value="MissedCall">Missed Call Follow-Up</option>
                </select>
              </div>

              {/* Template Preview block */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 text-xs">
                <span className="text-[9px] uppercase font-bold text-brand-400 block mb-1.5">Template Preview</span>
                <p className="text-slate-450 leading-relaxed whitespace-pre-line font-mono">
                  {waTemplate === 'Welcome' && `Hi ${lead.fullName},\nThank you for your interest. I will assist you with suitable properties.`}
                  {waTemplate === 'FollowUp' && `Hi ${lead.fullName},\nJust checking whether you reviewed the property details.`}
                  {waTemplate === 'SiteVisit' && `Hi ${lead.fullName},\nReminder for your site visit scheduled today.`}
                  {waTemplate === 'MissedCall' && `Hi ${lead.fullName},\nSorry I missed your call. I will try calling you back shortly.`}
                </p>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setWaModalOpen(false)}
                  className="px-4 py-2 border border-slate-800 hover:bg-slate-900 rounded-xl text-xs text-slate-400 font-semibold"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSendWhatsApp}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs text-white font-semibold"
                >
                  Send WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Property Modal */}
      {shareModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md rounded-2xl p-6 shadow-2xl">
            <h3 className="font-bold text-lg text-slate-100 mb-4">Share Property Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Select Property</label>
                <select 
                  value={selectedPropertyId}
                  onChange={(e) => setSelectedPropertyId(e.target.value)}
                  className="mt-1.5 block w-full bg-slate-950 border border-slate-850 rounded-xl text-xs px-3 py-2.5 text-slate-200 focus:outline-none"
                >
                  {properties.length === 0 ? (
                    <option>No properties available</option>
                  ) : (
                    properties.map((p) => (
                      <option key={p.id} value={p.id}>{p.title} - {p.projectName} (₹{(p.price/100000).toFixed(1)} L)</option>
                    ))
                  )}
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShareModalOpen(false)}
                  className="px-4 py-2 border border-slate-800 hover:bg-slate-900 rounded-xl text-xs text-slate-400 font-semibold"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleShareProperty}
                  disabled={!selectedPropertyId}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs text-white font-semibold disabled:opacity-50"
                >
                  Send via WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Followup Modal */}
      {followModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md rounded-2xl p-6 shadow-2xl">
            <h3 className="font-bold text-lg text-slate-100 mb-4">Schedule Follow-up Task</h3>
            <form onSubmit={handleScheduleFollowup} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Title</label>
                <input 
                  type="text" 
                  required
                  value={followTitle}
                  onChange={(e) => setFollowTitle(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                  placeholder="e.g. Call to discuss brochure options"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Due Date & Time</label>
                <input 
                  type="datetime-local" 
                  required
                  value={followDate}
                  onChange={(e) => setFollowDate(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-xl text-xs focus:outline-none focus:ring-1"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Additional Notes</label>
                <textarea 
                  value={followNotes}
                  onChange={(e) => setFollowNotes(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                  rows={2}
                  placeholder="Notes on discussion context..."
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setFollowModalOpen(false)}
                  className="px-4 py-2 border border-slate-800 hover:bg-slate-900 rounded-xl text-xs text-slate-400 font-semibold"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-500 rounded-xl text-xs text-white font-semibold"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Site Visit Modal */}
      {visitModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md rounded-2xl p-6 shadow-2xl">
            <h3 className="font-bold text-lg text-slate-100 mb-4">Schedule Site Visit</h3>
            <form onSubmit={handleScheduleSiteVisit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Select Target Property</label>
                <select 
                  value={visitPropertyId}
                  onChange={(e) => setVisitPropertyId(e.target.value)}
                  className="mt-1.5 block w-full bg-slate-950 border border-slate-850 rounded-xl text-xs px-3 py-2.5 text-slate-200 focus:outline-none"
                >
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>{p.title} - {p.projectName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Scheduled Date & Time</label>
                <input 
                  type="datetime-local" 
                  required
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-xl text-xs focus:outline-none focus:ring-1"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Visitor Notes / Requirements</label>
                <textarea 
                  value={visitNotes}
                  onChange={(e) => setVisitNotes(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                  rows={2}
                  placeholder="e.g. visiting with family, needs pick-up..."
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setVisitModalOpen(false)}
                  className="px-4 py-2 border border-slate-800 hover:bg-slate-900 rounded-xl text-xs text-slate-400 font-semibold"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-500 rounded-xl text-xs text-white font-semibold"
                >
                  Schedule Visit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
