import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Users, 
  UserPlus, 
  Mail, 
  User, 
  ShieldAlert, 
  ShieldCheck, 
  UserCheck2,
  X
} from 'lucide-react';

interface Member {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  role: 'ADMIN' | 'SALES_MANAGER' | 'SALES_AGENT';
  status: 'ACTIVE' | 'INACTIVE' | 'INVITED';
  createdAt: string;
}

export const Team: React.FC = () => {
  const { organization } = useAuth();
  
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  // Invite modal state
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [invitePhone, setInvitePhone] = useState('');
  const [inviteRole, setInviteRole] = useState<'ADMIN' | 'SALES_MANAGER' | 'SALES_AGENT'>('SALES_AGENT');
  const [inviting, setInviting] = useState(false);

  const fetchTeamMembers = async () => {
    try {
      const res = await api.get('/auth/team');
      setMembers(res.data);
    } catch (err) {
      console.error('[Team] Error fetching team members:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail || !inviteName) return;

    setInviting(true);
    try {
      await api.post('/auth/invite', {
        email: inviteEmail,
        fullName: inviteName,
        phone: invitePhone || undefined,
        role: inviteRole,
      });

      setInviteModalOpen(false);
      setInviteEmail('');
      setInviteName('');
      setInvitePhone('');
      setInviteRole('SALES_AGENT');
      fetchTeamMembers();
    } catch (err: any) {
      console.error('[Team] Invite error:', err);
      alert(err.response?.data?.error || 'Failed to send invite.');
    } finally {
      setInviting(false);
    }
  };

  const getRoleBadge = (role: string) => {
    if (role === 'ADMIN') return 'bg-red-500/10 text-red-400 border border-red-500/20';
    if (role === 'SALES_MANAGER') return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
    return 'bg-green-500/10 text-green-400 border border-green-500/20'; // SALES_AGENT
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Team Members</h2>
          <p className="text-xs text-slate-400 mt-1">Manage agent accounts, permission roles, and check performance roles</p>
        </div>

        {organization && organization.role === 'ADMIN' && (
          <button
            onClick={() => setInviteModalOpen(true)}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 text-white hover:bg-brand-500 transition-all duration-200 shadow-lg shadow-brand-500/10"
          >
            <UserPlus size={16} />
            <span>Invite Member</span>
          </button>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin"></div>
          <p className="mt-3 text-xs text-slate-655 uppercase font-bold tracking-wider">Fetching team roster...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((member) => (
            <div key={member.id} className="glass-panel p-5 rounded-2xl border-slate-900 flex items-start space-x-4 hover:border-slate-800/85 transition-colors">
              <img 
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${member.fullName}`} 
                alt="Avatar" 
                className="w-12 h-12 rounded-full border border-slate-800 shrink-0"
              />
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-200 text-sm truncate leading-tight">{member.fullName}</h4>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${getRoleBadge(member.role)}`}>
                    {member.role.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-xs text-slate-400 truncate">{member.email}</p>
                <p className="text-[11px] text-slate-550 text-slate-500">{member.phone || 'No phone number'}</p>

                <div className="flex items-center space-x-1.5 pt-1 text-[10px]">
                  <span className={`w-1.5 h-1.5 rounded-full ${member.status === 'ACTIVE' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                  <span className="text-slate-500 font-bold uppercase tracking-wider">{member.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Invite Member Modal */}
      {inviteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
            <h3 className="font-bold text-lg text-slate-100 mb-4">Invite Team Member</h3>
            
            <form onSubmit={handleInviteSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                  placeholder="e.g. Priyesh Patel"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                  placeholder="name@company.com"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Mobile Number</label>
                <input 
                  type="tel" 
                  value={invitePhone}
                  onChange={(e) => setInvitePhone(e.target.value)}
                  className="mt-1 block w-full px-3 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                  placeholder="+919988776655"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Access Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
                  className="mt-1.5 block w-full bg-slate-950 border border-slate-850 rounded-xl text-xs px-3 py-2.5 text-slate-200 focus:outline-none"
                >
                  <option value="SALES_AGENT">Sales Agent (View assigned leads, call, update status)</option>
                  <option value="SALES_MANAGER">Sales Manager (View all leads, assign leads, reports)</option>
                  <option value="ADMIN">Administrator (Full CRM access, invite users, configure settings)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button 
                  type="button" 
                  onClick={() => setInviteModalOpen(false)}
                  className="px-4 py-2.5 border border-slate-800 hover:bg-slate-900 rounded-xl text-xs font-semibold text-slate-450"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={inviting}
                  className="px-4 py-2.5 bg-brand-600 hover:bg-brand-500 rounded-xl text-xs font-semibold text-white shadow-lg shadow-brand-600/10"
                >
                  {inviting ? 'Inviting...' : 'Send Invitation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
