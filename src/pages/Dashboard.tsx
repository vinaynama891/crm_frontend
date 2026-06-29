import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip,
  LineChart,
  Line
} from 'recharts';
import { 
  Users, 
  Flame, 
  PhoneCall, 
  Clock5, 
  CalendarRange, 
  TrendingUp, 
  Plus, 
  Share2, 
  CalendarDays, 
  ArrowUpRight,
  Activity as ActivityIcon,
  X,
  Building2,
  FileText,
  UserCheck
} from 'lucide-react';

interface Activity {
  id: string;
  type: string;
  content: string;
  leadName: string;
  leadId: string;
  agentName: string;
  createdAt: string;
}

interface Lead {
  _id: string;
  fullName: string;
  phone: string;
  email?: string;
  source: string;
  propertyType?: string;
  budget?: number;
  preferredLocation?: string;
  status: string;
  temperature: string;
  createdAt: string;
}

interface DashboardStats {
  newLeadsToday: number;
  hotLeads: number;
  callsToday: number;
  followUpsDue: number;
  siteVisitsScheduled: number;
  totalActiveProperties: number;
  conversionRate: number;
  averageResponseTimeMinutes: number;
  recentActivities: Activity[];
}

interface FunnelStage {
  name: string;
  count: number;
  conversionRate: number;
}

interface AgentPerformance {
  agentId: string;
  name: string;
  email: string;
  leadsAssigned: number;
  callsMade: number;
  callsConnected: number;
  followupsCompleted: number;
  siteVisitsScheduled: number;
  bookingsGenerated: number;
  conversionRate: number;
}

interface ResponseTimeData {
  averageResponseTimeMinutes: number;
  fastestAgent: string;
  slowestAgent: string;
}

interface FollowUp {
  _id: string;
  title: string;
  scheduledAt: string;
  status: string;
  lead?: {
    _id: string;
    fullName: string;
    phone: string;
  };
}

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, organization } = useAuth();
  
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [funnelData, setFunnelData] = useState<FunnelStage[]>([]);
  const [agents, setAgents] = useState<AgentPerformance[]>([]);
  const [responseTime, setResponseTime] = useState<ResponseTimeData | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [followups, setFollowups] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(true);

  // Quick modals toggles
  const [addLeadOpen, setAddLeadOpen] = useState(false);
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadPhone, setNewLeadPhone] = useState('');
  const [newLeadSource, setNewLeadSource] = useState('Website');
  const [newLeadLocation, setNewLeadLocation] = useState('');

  const fetchDashboardAnalytics = async () => {
    try {
      const statsRes = await api.get('/analytics/dashboard');
      setStats(statsRes.data);

      const funnelRes = await api.get('/analytics/funnel');
      setFunnelData(funnelRes.data);

      const agentsRes = await api.get('/analytics/agents');
      setAgents(agentsRes.data);

      const responseTimeRes = await api.get('/analytics/responsetime');
      setResponseTime(responseTimeRes.data);

      const leadsRes = await api.get('/leads');
      setLeads(leadsRes.data);

      const followRes = await api.get('/followups?due=today');
      setFollowups(followRes.data);
    } catch (err) {
      console.error('[Dashboard] Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardAnalytics();
  }, []);

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName || !newLeadPhone) return;

    try {
      await api.post('/leads', {
        fullName: newLeadName,
        phone: newLeadPhone,
        source: newLeadSource,
        preferredLocation: newLeadLocation,
      });

      setAddLeadOpen(false);
      setNewLeadName('');
      setNewLeadPhone('');
      setNewLeadLocation('');
      fetchDashboardAnalytics();
    } catch (err) {
      console.error('[Dashboard] Error creating lead:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gold-500/20 border-t-gold-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const formatResponseTime = (mins: number) => {
    if (!mins) return '00m 00s';
    const totalSecs = Math.round(mins * 60);
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;
  };

  // Donut chart status mapping
  const leadOverviewData = [
    { name: 'New', value: stats?.newLeadsToday || 12, color: '#aa8446' },
    { name: 'Contacted', value: stats?.callsToday || 18, color: '#c5a880' },
    { name: 'Interested', value: stats?.hotLeads || 8, color: '#e3d3ac' },
    { name: 'Site Visit', value: stats?.siteVisitsScheduled || 6, color: '#5b5e68' },
    { name: 'Negotiation', value: stats?.followUpsDue || 4, color: '#3a3c42' },
  ];

  const totalLeadsCount = leadOverviewData.reduce((acc, curr) => acc + curr.value, 0);

  // Line charts data
  const lineChartData = [
    { name: 'May 7', time: 4.8 },
    { name: 'May 8', time: 3.5 },
    { name: 'May 9', time: 4.2 },
    { name: 'May 10', time: 3.8 },
    { name: 'May 11', time: 5.1 },
    { name: 'May 12', time: 4.5 },
    { name: 'May 13', time: 6.2 },
  ];

  const agentLineChartData = [
    { name: 'May 1', bookings: 0 },
    { name: 'May 5', bookings: 1 },
    { name: 'May 10', bookings: 1 },
    { name: 'May 15', bookings: 2 },
    { name: 'May 19', bookings: 3 },
  ];

  const activeRole = organization?.role || 'SALES_AGENT';

  return (
    <div className="p-6 space-y-6 bg-[#0b0c0e] min-h-screen text-slate-100">

      {/* ========================================================================= */}
      {/* CASE 1: ADMIN DASHBOARD */}
      {/* ========================================================================= */}
      {activeRole === 'ADMIN' && (
        <>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="text-left">
              <h1 className="text-2xl sm:text-3xl font-serif font-light text-white">
                Good morning, {user?.fullName.split(' ')[0]} 👋
              </h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mt-1">
                Here's what's happening with your business today.
              </p>
            </div>

            <div className="flex items-center space-x-2 bg-slate-950 border border-white/5 px-4 py-2 text-[10px] font-bold text-slate-400 tracking-wider uppercase">
              <CalendarDays size={12} className="text-gold-400" />
              <span>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="bg-[#121316] border border-white/5 p-4 text-left">
              <div className="flex justify-between items-center text-slate-500">
                <span className="text-[9px] uppercase tracking-wider font-bold">New Leads</span>
                <Users size={14} className="text-gold-400" />
              </div>
              <p className="text-2xl font-serif text-white mt-2">{stats?.newLeadsToday || 0}</p>
              <span className="text-[9px] text-emerald-500 font-bold block mt-1">↑ 18% from yesterday</span>
            </div>

            <div className="bg-[#121316] border border-white/5 p-4 text-left">
              <div className="flex justify-between items-center text-slate-500">
                <span className="text-[9px] uppercase tracking-wider font-bold">Hot Leads</span>
                <Flame size={14} className="text-gold-400" />
              </div>
              <p className="text-2xl font-serif text-white mt-2">{stats?.hotLeads || 0}</p>
              <span className="text-[9px] text-emerald-500 font-bold block mt-1">↑ 24% from last week</span>
            </div>

            <div className="bg-[#121316] border border-white/5 p-4 text-left">
              <div className="flex justify-between items-center text-slate-500">
                <span className="text-[9px] uppercase tracking-wider font-bold">Calls Today</span>
                <PhoneCall size={14} className="text-gold-400" />
              </div>
              <p className="text-2xl font-serif text-white mt-2">{stats?.callsToday || 0}</p>
              <span className="text-[9px] text-emerald-500 font-bold block mt-1">↑ 12% from yesterday</span>
            </div>

            <div className="bg-[#121316] border border-white/5 p-4 text-left">
              <div className="flex justify-between items-center text-slate-500">
                <span className="text-[9px] uppercase tracking-wider font-bold">Follow-Ups</span>
                <Clock5 size={14} className="text-gold-400" />
              </div>
              <p className="text-2xl font-serif text-white mt-2">{stats?.followUpsDue || 0}</p>
              <span className="text-[9px] text-red-500 font-bold block mt-1">↓ 8% from yesterday</span>
            </div>

            <div className="bg-[#121316] border border-white/5 p-4 text-left">
              <div className="flex justify-between items-center text-slate-500">
                <span className="text-[9px] uppercase tracking-wider font-bold">Site Visits</span>
                <CalendarRange size={14} className="text-gold-400" />
              </div>
              <p className="text-2xl font-serif text-white mt-2">{stats?.siteVisitsScheduled || 0}</p>
              <span className="text-[9px] text-emerald-500 font-bold block mt-1">↑ 15% from yesterday</span>
            </div>

            <div className="bg-[#121316] border border-white/5 p-4 text-left">
              <div className="flex justify-between items-center text-slate-500">
                <span className="text-[9px] uppercase tracking-wider font-bold">Conversion Rate</span>
                <TrendingUp size={14} className="text-gold-400" />
              </div>
              <p className="text-2xl font-serif text-white mt-2">{stats?.conversionRate || 0}%</p>
              <span className="text-[9px] text-emerald-500 font-bold block mt-1">↑ 5.2% from last month</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div className="bg-[#121316] border border-white/5 p-5 flex flex-col justify-between h-[360px] text-left">
              <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
                <h3 className="font-serif text-sm text-slate-200">Conversion Funnel</h3>
                <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">This Month</span>
              </div>
              <div className="flex items-center space-x-6 flex-1 py-4">
                <div className="space-y-3.5 text-left text-[10px] font-bold text-slate-400">
                  <div>
                    <p className="text-slate-500 uppercase tracking-widest text-[8px]">Leads</p>
                    <p className="text-sm font-serif text-white mt-0.5">{funnelData[0]?.count || 1256}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 uppercase tracking-widest text-[8px]">Contacted</p>
                    <p className="text-sm font-serif text-white mt-0.5">{funnelData[1]?.count || 893}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 uppercase tracking-widest text-[8px]">Interested</p>
                    <p className="text-sm font-serif text-white mt-0.5">{funnelData[2]?.count || 612}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 uppercase tracking-widest text-[8px]">Site Visits</p>
                    <p className="text-sm font-serif text-white mt-0.5">{funnelData[3]?.count || 289}</p>
                  </div>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center space-y-1.5 py-4">
                  <div className="w-[100%] h-5 bg-[#aa8446] flex items-center justify-center text-[9px] font-bold text-black tracking-widest">100%</div>
                  <div className="w-[85%] h-5 bg-[#c5a880] flex items-center justify-center text-[9px] font-bold text-black tracking-widest">71.1%</div>
                  <div className="w-[70%] h-5 bg-[#e3d3ac] flex items-center justify-center text-[9px] font-bold text-black tracking-widest">68.6%</div>
                  <div className="w-[55%] h-5 bg-[#5b5e68] flex items-center justify-center text-[9px] font-bold text-white tracking-widest">47.2%</div>
                  <div className="w-[40%] h-5 bg-[#3a3c42] flex items-center justify-center text-[9px] font-bold text-white tracking-widest">49.1%</div>
                  <div className="w-[25%] h-5 bg-[#202124] flex items-center justify-center text-[9px] font-bold text-white tracking-widest">61.3%</div>
                </div>
              </div>
            </div>

            <div className="bg-[#121316] border border-white/5 p-5 flex flex-col justify-between h-[360px] text-left">
              <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
                <h3 className="font-serif text-sm text-slate-200">Leads Overview</h3>
                <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">Status Details</span>
              </div>
              <div className="flex-1 flex items-center justify-between py-2 relative">
                <div className="w-[50%] h-full flex items-center justify-center relative">
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie
                        data={leadOverviewData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={75}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {leadOverviewData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center mt-1">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Total</span>
                    <span className="text-xl font-serif text-white">{totalLeadsCount}</span>
                  </div>
                </div>
                <div className="w-[45%] space-y-2.5 text-[10px] text-slate-400">
                  {leadOverviewData.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                        <span className="font-light">{item.name}</span>
                      </div>
                      <span className="font-serif text-white font-bold">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-[#121316] border border-white/5 p-5 flex flex-col justify-between h-[360px] text-left">
              <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
                <h3 className="font-serif text-sm text-slate-200">Recent Activities</h3>
                <button onClick={() => navigate('/leads')} className="text-[9px] text-gold-400 font-bold uppercase tracking-wider hover:underline">View All</button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-1">
                {stats?.recentActivities && stats.recentActivities.length > 0 ? (
                  stats.recentActivities.map((act) => (
                    <div key={act.id} className="flex items-start space-x-3 text-xs">
                      <div className="p-1.5 bg-slate-900 border border-white/5 text-gold-400 shrink-0 mt-0.5">
                        <ActivityIcon size={12} />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-slate-300 font-light text-[11px] leading-relaxed">{act.content.replace(/\*\*(.*?)\*\*/g, '$1')}</p>
                        <span className="text-[9px] text-slate-600 font-bold block mt-1 uppercase tracking-wider">{new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-[10px] text-slate-500 text-center py-12">No recent logs</p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-[#121316] border border-white/5 p-5 flex flex-col justify-between h-[340px] text-left">
              <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
                <h3 className="font-serif text-sm text-slate-200">Top Performing Agents</h3>
                <button onClick={() => navigate('/team')} className="text-[9px] text-gold-400 font-bold uppercase tracking-wider hover:underline">View All</button>
              </div>
              <div className="flex-1 overflow-y-auto mt-3">
                <table className="w-full text-[10px]">
                  <thead>
                    <tr className="text-slate-550 text-slate-500 border-b border-white/5 pb-1 font-bold text-left uppercase tracking-widest">
                      <th className="py-2">Agent</th>
                      <th className="py-2 text-center">Calls</th>
                      <th className="py-2 text-center">Visits</th>
                      <th className="py-2 text-right">Conv %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agents.slice(0, 4).map((agent, index) => (
                      <tr key={index} className="border-b border-white/5 hover:bg-[#18191d]/20 transition-colors">
                        <td className="py-2 flex items-center space-x-2.5 text-left">
                          <div className="w-6 h-6 rounded-full bg-slate-900 border border-gold-500/20 flex items-center justify-center font-serif text-[10px] font-bold text-gold-400 uppercase">{agent.name.charAt(0)}</div>
                          <div>
                            <p className="text-slate-200 font-semibold">{agent.name}</p>
                            <p className="text-[8px] text-slate-500 uppercase tracking-wider">Agent</p>
                          </div>
                        </td>
                        <td className="py-2 text-center text-slate-300 font-serif">{agent.callsMade}</td>
                        <td className="py-2 text-center text-slate-300 font-serif">{agent.siteVisitsScheduled}</td>
                        <td className="py-2 text-right text-gold-400 font-bold font-serif">{agent.conversionRate}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-[#121316] border border-white/5 p-5 flex flex-col justify-between h-[340px] text-left">
              <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
                <h3 className="font-serif text-sm text-slate-200">Lead Sources</h3>
                <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">This Month</span>
              </div>
              <div className="flex-1 flex flex-col justify-center space-y-4 py-2">
                {[
                  { name: 'Facebook Ads', pct: 42, count: 528, color: 'bg-gold-500' },
                  { name: 'Website', pct: 26, count: 327, color: 'bg-gold-400' },
                  { name: '99acres', pct: 15, count: 188, color: 'bg-gold-300' },
                  { name: 'MagicBricks', pct: 8, count: 100, color: 'bg-[#5b5e68]' },
                  { name: 'Referral', pct: 5, count: 63, color: 'bg-[#3a3c42]' },
                  { name: 'Other', pct: 4, count: 50, color: 'bg-[#202124]' },
                ].map((src, idx) => (
                  <div key={idx} className="space-y-1 text-[10px]">
                    <div className="flex justify-between items-center font-bold text-slate-400">
                      <span className="font-light">{src.name}</span>
                      <span className="font-serif text-white">{src.pct}% <span className="text-[8px] font-sans font-light text-slate-500">({src.count})</span></span>
                    </div>
                    <div className="w-full h-1.5 bg-[#1b1c20] rounded-none overflow-hidden">
                      <div className={`h-full ${src.color}`} style={{ width: `${src.pct}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#121316] border border-white/5 p-5 flex flex-col justify-between h-[340px] text-left">
              <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
                <h3 className="font-serif text-sm text-slate-200">Lead Response Time</h3>
                <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">Live Metrics</span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-3 border-b border-white/5">
                <div className="text-left">
                  <p className="text-[8px] text-slate-500 uppercase tracking-widest font-bold">Average Time</p>
                  <p className="text-sm font-serif text-gold-300 mt-1">{responseTime ? formatResponseTime(responseTime.averageResponseTimeMinutes) : '04m 32s'}</p>
                  <span className="text-[7.5px] text-emerald-500 font-bold mt-0.5 block">↓ 12% from last month</span>
                </div>
                <div className="text-left border-l border-white/5 pl-2.5">
                  <p className="text-[8px] text-slate-500 uppercase tracking-widest font-bold">Fastest Agent</p>
                  <p className="text-xs text-white truncate font-medium mt-1">{responseTime?.fastestAgent?.split(' (')[0] || 'Neha Singh'}</p>
                  <span className="text-[8px] text-slate-500 block mt-0.5 font-bold font-serif">{responseTime?.fastestAgent?.split(' (')[1]?.replace(')', '') || '01m 08s'}</span>
                </div>
                <div className="text-left border-l border-white/5 pl-2.5">
                  <p className="text-[8px] text-slate-500 uppercase tracking-widest font-bold">Slowest Agent</p>
                  <p className="text-xs text-white truncate font-medium mt-1">{responseTime?.slowestAgent?.split(' (')[0] || 'Karan Patel'}</p>
                  <span className="text-[8px] text-slate-500 block mt-0.5 font-bold font-serif">{responseTime?.slowestAgent?.split(' (')[1]?.replace(')', '') || '08m 47s'}</span>
                </div>
              </div>
              <div className="flex-1 w-full h-32 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={lineChartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorTime" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#c5a880" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#c5a880" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#5b5e68" fontSize={8} tickLine={false} axisLine={false} />
                    <YAxis stroke="#5b5e68" fontSize={8} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#121316', borderColor: '#c5a880', fontSize: 10 }} />
                    <Area type="monotone" dataKey="time" stroke="#c5a880" strokeWidth={1.5} fillOpacity={1} fill="url(#colorTime)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="space-y-2.5 text-left">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.25em]">Quick Actions</h4>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <button onClick={() => setAddLeadOpen(true)} className="p-4 bg-[#121316] border border-white/5 hover:border-gold-400/30 text-left transition-all">
                <Plus size={16} className="text-gold-400" />
                <h5 className="text-[11px] font-bold text-slate-100 uppercase tracking-wider mt-2.5">Add Lead</h5>
                <p className="text-[9px] text-slate-500 font-light mt-0.5">Register new lead</p>
              </button>
              <button onClick={() => navigate('/leads')} className="p-4 bg-[#121316] border border-white/5 hover:border-gold-400/30 text-left transition-all">
                <PhoneCall size={16} className="text-gold-400" />
                <h5 className="text-[11px] font-bold text-slate-100 uppercase tracking-wider mt-2.5">Call Lead</h5>
                <p className="text-[9px] text-slate-500 font-light mt-0.5">Instant Call Bridge</p>
              </button>
              <button onClick={() => navigate('/leads')} className="p-4 bg-[#121316] border border-white/5 hover:border-gold-400/30 text-left transition-all">
                <Share2 size={16} className="text-gold-400" />
                <h5 className="text-[11px] font-bold text-slate-100 uppercase tracking-wider mt-2.5">Share Specs</h5>
                <p className="text-[9px] text-slate-500 font-light mt-0.5">Brochure via WhatsApp</p>
              </button>
              <button onClick={() => navigate('/sitevisits')} className="p-4 bg-[#121316] border border-white/5 hover:border-gold-400/30 text-left transition-all">
                <CalendarRange size={16} className="text-gold-400" />
                <h5 className="text-[11px] font-bold text-slate-100 uppercase tracking-wider mt-2.5">Schedule Tour</h5>
                <p className="text-[9px] text-slate-500 font-light mt-0.5">Book physical tour</p>
              </button>
              <button onClick={() => navigate('/followups')} className="p-4 bg-[#121316] border border-white/5 hover:border-gold-400/30 text-left transition-all">
                <Clock5 size={16} className="text-gold-400" />
                <h5 className="text-[11px] font-bold text-slate-100 uppercase tracking-wider mt-2.5">Add Task</h5>
                <p className="text-[9px] text-slate-500 font-light mt-0.5">Schedule follow-up</p>
              </button>
              <button onClick={() => navigate('/leads')} className="p-4 bg-gold-500 hover:bg-gold-600 text-gold-950 text-left transition-all shadow-lg shadow-gold-500/10">
                <ArrowUpRight size={16} className="text-[#1c140c]" />
                <h5 className="text-[11px] font-black uppercase tracking-wider mt-2.5">View All Leads</h5>
                <p className="text-[9px] text-gold-900 font-bold mt-0.5">Go to complete lead list</p>
              </button>
            </div>
          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* CASE 2: SALES MANAGER DASHBOARD */}
      {/* ========================================================================= */}
      {activeRole === 'SALES_MANAGER' && (
        <>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="text-left">
              <h1 className="text-2xl sm:text-3xl font-serif font-light text-white">
                Sales Manager Dashboard 👋
              </h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mt-1 font-sans">
                Welcome back, Manager! Here's your team performance overview.
              </p>
            </div>

            <div className="flex items-center space-x-2 bg-slate-950 border border-white/5 px-4 py-2 text-[10px] font-bold text-slate-400 tracking-wider uppercase">
              <CalendarDays size={12} className="text-gold-400" />
              <span>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>

          {/* Row of 6 KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="bg-[#121316] border border-white/5 p-4 text-left">
              <div className="flex justify-between items-center text-slate-500">
                <span className="text-[9px] uppercase tracking-wider font-bold">Total Leads</span>
                <Users size={14} className="text-gold-400" />
              </div>
              <p className="text-2xl font-serif text-white mt-2">{leads.length}</p>
              <span className="text-[9px] text-emerald-500 font-bold block mt-1">↑ 18% from last week</span>
            </div>
            <div className="bg-[#121316] border border-white/5 p-4 text-left">
              <div className="flex justify-between items-center text-slate-500">
                <span className="text-[9px] uppercase tracking-wider font-bold">New Leads</span>
                <Plus size={14} className="text-gold-400" />
              </div>
              <p className="text-2xl font-serif text-white mt-2">{stats?.newLeadsToday || 0}</p>
              <span className="text-[9px] text-emerald-500 font-bold block mt-1">↑ 22% from last week</span>
            </div>
            <div className="bg-[#121316] border border-white/5 p-4 text-left">
              <div className="flex justify-between items-center text-slate-500">
                <span className="text-[9px] uppercase tracking-wider font-bold">Hot Leads</span>
                <Flame size={14} className="text-gold-400" />
              </div>
              <p className="text-2xl font-serif text-white mt-2">{stats?.hotLeads || 0}</p>
              <span className="text-[9px] text-emerald-500 font-bold block mt-1">↑ 15% from last week</span>
            </div>
            <div className="bg-[#121316] border border-white/5 p-4 text-left">
              <div className="flex justify-between items-center text-slate-500">
                <span className="text-[9px] uppercase tracking-wider font-bold">Site Visits</span>
                <CalendarRange size={14} className="text-gold-400" />
              </div>
              <p className="text-2xl font-serif text-white mt-2">{stats?.siteVisitsScheduled || 0}</p>
              <span className="text-[9px] text-emerald-500 font-bold block mt-1">↑ 12% from last week</span>
            </div>
            <div className="bg-[#121316] border border-white/5 p-4 text-left">
              <div className="flex justify-between items-center text-slate-500">
                <span className="text-[9px] uppercase tracking-wider font-bold">Bookings</span>
                <Building2 size={14} className="text-gold-400" />
              </div>
              <p className="text-2xl font-serif text-white mt-2">{agents.reduce((acc, curr) => acc + curr.bookingsGenerated, 0)}</p>
              <span className="text-[9px] text-emerald-500 font-bold block mt-1">↑ 8% from last week</span>
            </div>
            <div className="bg-[#121316] border border-white/5 p-4 text-left">
              <div className="flex justify-between items-center text-slate-500">
                <span className="text-[9px] uppercase tracking-wider font-bold">Conversion Rate</span>
                <TrendingUp size={14} className="text-gold-400" />
              </div>
              <p className="text-2xl font-serif text-white mt-2">{stats?.conversionRate || 0}%</p>
              <span className="text-[9px] text-emerald-500 font-bold block mt-1">↑ 5.2% from last week</span>
            </div>
          </div>

          {/* Middle Blocks Grid (Lead Funnel, Agent Performance List, Lead Sources Donut, Upcoming Activities) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* Funnel */}
            <div className="bg-[#121316] border border-white/5 p-5 flex flex-col justify-between h-[360px] text-left">
              <h4 className="font-serif text-xs text-slate-200 border-b border-white/5 pb-2">Lead Funnel</h4>
              <div className="flex items-center space-x-4 flex-1 py-2">
                <div className="space-y-3.5 text-left text-[9px] font-bold text-slate-400">
                  <div>
                    <p className="text-[7.5px] text-slate-500 uppercase tracking-widest">Leads</p>
                    <p className="text-xs font-serif text-white">{funnelData[0]?.count || 1256}</p>
                  </div>
                  <div>
                    <p className="text-[7.5px] text-slate-500 uppercase tracking-widest">Contacted</p>
                    <p className="text-xs font-serif text-white">{funnelData[1]?.count || 893}</p>
                  </div>
                  <div>
                    <p className="text-[7.5px] text-slate-500 uppercase tracking-widest">Interested</p>
                    <p className="text-xs font-serif text-white">{funnelData[2]?.count || 612}</p>
                  </div>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center space-y-1.5 py-4">
                  <div className="w-[100%] h-4.5 bg-[#aa8446] flex items-center justify-center text-[8px] font-bold text-black">100%</div>
                  <div className="w-[80%] h-4.5 bg-[#c5a880] flex items-center justify-center text-[8px] font-bold text-black">71.1%</div>
                  <div className="w-[60%] h-4.5 bg-[#e3d3ac] flex items-center justify-center text-[8px] font-bold text-black">68.6%</div>
                  <div className="w-[40%] h-4.5 bg-[#4c4e57] flex items-center justify-center text-[8px] font-bold text-white">47.2%</div>
                </div>
              </div>
            </div>

            {/* Agent Performance List */}
            <div className="bg-[#121316] border border-white/5 p-5 flex flex-col justify-between h-[360px] text-left">
              <h4 className="font-serif text-xs text-slate-200 border-b border-white/5 pb-2">Agent Performance</h4>
              <div className="flex-1 overflow-y-auto mt-2 space-y-3.5 pr-1">
                {agents.map((agent, index) => (
                  <div key={index} className="flex items-center justify-between text-[10px]">
                    <div className="flex items-center space-x-2 text-left">
                      <div className="w-6 h-6 rounded-full bg-slate-900 border border-gold-500/20 flex items-center justify-center font-serif text-[10px] font-bold text-gold-400 uppercase">{agent.name.charAt(0)}</div>
                      <div>
                        <p className="text-slate-200 font-semibold">{agent.name}</p>
                        <p className="text-[8px] text-slate-500 uppercase">Sales Agent</p>
                      </div>
                    </div>
                    <div className="text-right font-serif text-slate-300">
                      <p className="font-bold text-gold-400">{agent.conversionRate}%</p>
                      <p className="text-[8px] text-slate-500">{agent.bookingsGenerated} bookings</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sources Pie chart */}
            <div className="bg-[#121316] border border-white/5 p-5 flex flex-col justify-between h-[360px] text-left">
              <h4 className="font-serif text-xs text-slate-200 border-b border-white/5 pb-2">Lead Sources</h4>
              <div className="flex-1 flex flex-col justify-center relative">
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie
                      data={leadOverviewData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={60}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {leadOverviewData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center mt-3">
                  <span className="text-[8px] text-slate-500 uppercase tracking-widest font-bold font-sans">Leads</span>
                  <span className="text-md font-serif text-white">{totalLeadsCount}</span>
                </div>
              </div>
            </div>

            {/* Upcoming Activities list */}
            <div className="bg-[#121316] border border-white/5 p-5 flex flex-col justify-between h-[360px] text-left">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <h4 className="font-serif text-xs text-slate-200">Upcoming Tasks</h4>
                <button onClick={() => navigate('/followups')} className="text-[8px] text-gold-400 font-bold uppercase tracking-wider hover:underline">View All</button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-1">
                {followups.slice(0, 3).map((f) => (
                  <div key={f._id} className="text-[10px] space-y-0.5 border-l-2 border-gold-500 pl-2.5 text-left">
                    <p className="font-semibold text-slate-200">{f.title}</p>
                    <p className="text-[8px] text-slate-500 uppercase">{f.lead?.fullName || 'Prospect'}</p>
                    <p className="text-[8px] text-gold-400 font-semibold">{new Date(f.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Bottom Grid (Recent Leads Table, Quick Actions Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* Table */}
            <div className="bg-[#121316] border border-white/5 p-5 md:col-span-3 flex flex-col justify-between text-left">
              <h4 className="font-serif text-xs text-slate-200 border-b border-white/5 pb-2 mb-3">Recent Captured Leads</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-[10px]">
                  <thead>
                    <tr className="text-slate-550 text-slate-500 border-b border-white/5 pb-1 font-bold text-left uppercase tracking-widest">
                      <th className="py-2">Lead Name</th>
                      <th className="py-2">Source</th>
                      <th className="py-2">Status</th>
                      <th className="py-2">Temperature</th>
                      <th className="py-2 text-right">Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.slice(0, 4).map((l) => (
                      <tr key={l._id} className="border-b border-white/5 hover:bg-[#18191d]/20 transition-colors">
                        <td className="py-2.5 font-semibold text-slate-200">{l.fullName}</td>
                        <td className="py-2.5 text-slate-400 font-light">{l.source}</td>
                        <td className="py-2.5">
                          <span className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider bg-gold-950/20 text-gold-400 border border-gold-900/30">
                            {l.status}
                          </span>
                        </td>
                        <td className="py-2.5">
                          <span className="inline-flex items-center space-x-1.5 text-[8.5px] font-bold text-slate-300">
                            <span className={`w-1.5 h-1.5 rounded-full ${l.temperature === 'Hot' ? 'bg-red-500' : l.temperature === 'Warm' ? 'bg-amber-400' : 'bg-slate-500'}`}></span>
                            <span>{l.temperature}</span>
                          </span>
                        </td>
                        <td className="py-2.5 text-right text-slate-550 text-slate-500">{new Date(l.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Manager actions */}
            <div className="bg-[#121316] border border-white/5 p-5 flex flex-col justify-between text-left">
              <h4 className="font-serif text-xs text-slate-200 border-b border-white/5 pb-2 mb-4">Quick Actions</h4>
              <div className="flex-1 flex flex-col justify-center space-y-3">
                <button onClick={() => navigate('/leads')} className="w-full text-left p-3.5 bg-slate-950 border border-white/5 hover:border-gold-400/20 transition-all text-xs rounded-none">
                  <h5 className="font-bold text-slate-200 uppercase tracking-wider">Assign Lead</h5>
                  <p className="text-[8px] text-slate-500 font-light mt-0.5">Assign properties to sales agents</p>
                </button>
                <button onClick={() => navigate('/followups')} className="w-full text-left p-3.5 bg-slate-950 border border-white/5 hover:border-gold-400/20 transition-all text-xs rounded-none">
                  <h5 className="font-bold text-slate-200 uppercase tracking-wider">Add Follow-Up</h5>
                  <p className="text-[8px] text-slate-500 font-light mt-0.5">Create client follow-up reminder</p>
                </button>
                <button onClick={() => navigate('/reports')} className="w-full text-left p-3.5 bg-slate-950 border border-white/5 hover:border-gold-400/20 transition-all text-xs rounded-none">
                  <h5 className="font-bold text-slate-200 uppercase tracking-wider">View Reports</h5>
                  <p className="text-[8px] text-slate-500 font-light mt-0.5">Analyze team conversion funnels</p>
                </button>
              </div>
            </div>

          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* CASE 3: SALES AGENT DASHBOARD */}
      {/* ========================================================================= */}
      {activeRole === 'SALES_AGENT' && (
        <>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="text-left">
              <h1 className="text-2xl sm:text-3xl font-serif font-light text-white">
                Sales Agent Dashboard 👋
              </h1>
              <p className="text-[10px] text-slate-550 text-slate-500 uppercase tracking-widest font-semibold mt-1 font-sans">
                Welcome back, {user?.fullName.split(' ')[0]}! Here's your daily overview.
              </p>
            </div>

            <div className="flex items-center space-x-2 bg-slate-950 border border-white/5 px-4 py-2 text-[10px] font-bold text-slate-400 tracking-wider uppercase">
              <CalendarDays size={12} className="text-gold-400" />
              <span>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>

          {/* Row of 6 KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="bg-[#121316] border border-white/5 p-4 text-left">
              <div className="flex justify-between items-center text-slate-500">
                <span className="text-[9px] uppercase tracking-wider font-bold">My Leads</span>
                <Users size={14} className="text-gold-400" />
              </div>
              <p className="text-2xl font-serif text-white mt-2">{leads.length}</p>
              <span className="text-[9px] text-emerald-500 font-bold block mt-1">↑ 12% from yesterday</span>
            </div>
            <div className="bg-[#121316] border border-white/5 p-4 text-left">
              <div className="flex justify-between items-center text-slate-500">
                <span className="text-[9px] uppercase tracking-wider font-bold">Calls Today</span>
                <PhoneCall size={14} className="text-gold-400" />
              </div>
              <p className="text-2xl font-serif text-white mt-2">{stats?.callsToday || 0}</p>
              <span className="text-[9px] text-emerald-500 font-bold block mt-1">↑ 20% from yesterday</span>
            </div>
            <div className="bg-[#121316] border border-white/5 p-4 text-left">
              <div className="flex justify-between items-center text-slate-500">
                <span className="text-[9px] uppercase tracking-wider font-bold">Follow-Ups Due</span>
                <Clock5 size={14} className="text-gold-400" />
              </div>
              <p className="text-2xl font-serif text-white mt-2">{stats?.followUpsDue || 0}</p>
              <span className="text-[9px] text-amber-500 font-bold block mt-1">Due today</span>
            </div>
            <div className="bg-[#121316] border border-white/5 p-4 text-left">
              <div className="flex justify-between items-center text-slate-500">
                <span className="text-[9px] uppercase tracking-wider font-bold">Site Visits</span>
                <CalendarRange size={14} className="text-gold-400" />
              </div>
              <p className="text-2xl font-serif text-white mt-2">{stats?.siteVisitsScheduled || 0}</p>
              <span className="text-[9px] text-slate-550 text-slate-500 block mt-1">Scheduled today</span>
            </div>
            <div className="bg-[#121316] border border-white/5 p-4 text-left">
              <div className="flex justify-between items-center text-slate-500">
                <span className="text-[9px] uppercase tracking-wider font-bold">Bookings</span>
                <Building2 size={14} className="text-gold-400" />
              </div>
              <p className="text-2xl font-serif text-white mt-2">3</p>
              <span className="text-[9px] text-slate-550 text-slate-500 block mt-1">This month</span>
            </div>
            <div className="bg-[#121316] border border-white/5 p-4 text-left">
              <div className="flex justify-between items-center text-slate-500">
                <span className="text-[9px] uppercase tracking-wider font-bold">Conversion Rate</span>
                <TrendingUp size={14} className="text-gold-400" />
              </div>
              <p className="text-2xl font-serif text-white mt-2">31.2%</p>
              <span className="text-[9px] text-emerald-500 font-bold block mt-1">↑ 6.3% from last month</span>
            </div>
          </div>

          {/* Middle Row (Agent Schedule, My Leads List, Quick Action Grid, Upcoming Follow-Ups) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* Timeline Schedule */}
            <div className="bg-[#121316] border border-white/5 p-5 flex flex-col justify-between h-[360px] text-left">
              <h4 className="font-serif text-xs text-slate-200 border-b border-white/5 pb-2 mb-3">Today's Schedule</h4>
              <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-[10px]">
                <div className="flex items-start space-x-3 text-left">
                  <span className="text-[8px] text-slate-500 font-bold uppercase mt-1 shrink-0 w-12">11:00 AM</span>
                  <div className="space-y-0.5 flex-1">
                    <p className="font-semibold text-slate-200">Follow-up with Rahul Sharma</p>
                    <span className="inline-block px-1.5 py-0.5 rounded-full text-[7.5px] font-black tracking-wider uppercase bg-gold-950/20 text-gold-400 border border-gold-900/25">Follow-Up</span>
                  </div>
                </div>
                <div className="flex items-start space-x-3 text-left">
                  <span className="text-[8px] text-slate-500 font-bold uppercase mt-1 shrink-0 w-12">12:30 PM</span>
                  <div className="space-y-0.5 flex-1">
                    <p className="font-semibold text-slate-200">Call with Priya Mehta</p>
                    <span className="inline-block px-1.5 py-0.5 rounded-full text-[7.5px] font-black tracking-wider uppercase bg-gold-950/20 text-gold-400 border border-gold-900/25">Call</span>
                  </div>
                </div>
                <div className="flex items-start space-x-3 text-left">
                  <span className="text-[8px] text-slate-500 font-bold uppercase mt-1 shrink-0 w-12">02:00 PM</span>
                  <div className="space-y-0.5 flex-1">
                    <p className="font-semibold text-slate-200">Site Visit - Horizon Residence</p>
                    <span className="inline-block px-1.5 py-0.5 rounded-full text-[7.5px] font-black tracking-wider uppercase bg-gold-950/20 text-gold-400 border border-gold-900/25">Site Visit</span>
                  </div>
                </div>
              </div>
            </div>

            {/* My Leads List */}
            <div className="bg-[#121316] border border-white/5 p-5 flex flex-col justify-between h-[360px] text-left">
              <div className="flex justify-between items-center border-b border-white/5 pb-2 mb-3">
                <h4 className="font-serif text-xs text-slate-200">My Leads</h4>
                <button onClick={() => navigate('/leads')} className="text-[8px] text-gold-400 font-bold uppercase hover:underline">View All</button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-[10px]">
                {leads.slice(0, 4).map((l) => (
                  <div key={l._id} className="flex justify-between items-center border-b border-white/5 pb-2">
                    <div className="text-left">
                      <p className="font-semibold text-slate-200">{l.fullName}</p>
                      <p className="text-[8px] text-slate-500">{l.phone}</p>
                    </div>
                    <span className="px-1.5 py-0.5 rounded-full text-[7.5px] font-black bg-gold-950/20 text-gold-400 border border-gold-900/25">{l.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick action grid (6 buttons) */}
            <div className="bg-[#121316] border border-white/5 p-5 flex flex-col justify-between h-[360px] text-left">
              <h4 className="font-serif text-xs text-slate-200 border-b border-white/5 pb-2 mb-3">Quick Actions</h4>
              <div className="grid grid-cols-2 gap-3 flex-1 py-1">
                <button onClick={() => navigate('/leads')} className="flex flex-col items-center justify-center p-2.5 bg-slate-950 border border-white/5 hover:border-gold-400/25 transition-all text-center">
                  <PhoneCall size={14} className="text-gold-400 mb-1" />
                  <span className="text-[8px] font-bold uppercase tracking-wider">Call Lead</span>
                </button>
                <button onClick={() => navigate('/leads')} className="flex flex-col items-center justify-center p-2.5 bg-slate-950 border border-white/5 hover:border-gold-400/25 transition-all text-center">
                  <Share2 size={14} className="text-gold-400 mb-1" />
                  <span className="text-[8px] font-bold uppercase tracking-wider">Share Specs</span>
                </button>
                <button onClick={() => navigate('/followups')} className="flex flex-col items-center justify-center p-2.5 bg-slate-950 border border-white/5 hover:border-gold-400/25 transition-all text-center">
                  <Plus size={14} className="text-gold-400 mb-1" />
                  <span className="text-[8px] font-bold uppercase tracking-wider">Add Task</span>
                </button>
                <button onClick={() => navigate('/leads')} className="flex flex-col items-center justify-center p-2.5 bg-slate-950 border border-white/5 hover:border-gold-400/25 transition-all text-center">
                  <FileText size={14} className="text-gold-400 mb-1" />
                  <span className="text-[8px] font-bold uppercase tracking-wider">Add Note</span>
                </button>
                <button onClick={() => navigate('/sitevisits')} className="flex flex-col items-center justify-center p-2.5 bg-slate-950 border border-white/5 hover:border-gold-400/25 transition-all text-center col-span-2">
                  <CalendarRange size={14} className="text-gold-400 mb-1" />
                  <span className="text-[8px] font-bold uppercase tracking-wider">Schedule Visit</span>
                </button>
              </div>
            </div>

            {/* Upcoming Follow-ups list */}
            <div className="bg-[#121316] border border-white/5 p-5 flex flex-col justify-between h-[360px] text-left">
              <div className="flex justify-between items-center border-b border-white/5 pb-2 mb-3">
                <h4 className="font-serif text-xs text-slate-200">Follow-Ups</h4>
                <button onClick={() => navigate('/followups')} className="text-[8px] text-gold-400 font-bold uppercase hover:underline">View All</button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-[9px] text-slate-400">
                {followups.slice(0, 3).map((f) => (
                  <div key={f._id} className="flex justify-between items-start border-b border-white/5 pb-2">
                    <div className="text-left">
                      <p className="font-bold text-slate-200">{f.lead?.fullName || 'Prospect'}</p>
                      <p className="text-[8px] text-slate-500">{new Date(f.scheduledAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</p>
                    </div>
                    <span className="inline-flex items-center space-x-1 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                      <span>Warm</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Bottom Grid (Recent Activities, Agent Performance Area Chart) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* Activities */}
            <div className="bg-[#121316] border border-white/5 p-5 md:col-span-2 flex flex-col justify-between text-left h-[260px]">
              <h4 className="font-serif text-xs text-slate-200 border-b border-white/5 pb-2 mb-3">Recent Activity Feed</h4>
              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                {stats?.recentActivities && stats.recentActivities.length > 0 ? (
                  stats.recentActivities.map((act) => (
                    <div key={act.id} className="flex items-start space-x-3 text-xs">
                      <div className="p-1 bg-slate-900 border border-white/5 text-gold-400 shrink-0 mt-0.5">
                        <ActivityIcon size={10} />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-slate-300 text-[10px] leading-relaxed">{act.content.replace(/\*\*(.*?)\*\*/g, '$1')}</p>
                        <span className="text-[8px] text-slate-600 block font-bold">{new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-[10px] text-slate-550 text-slate-500 text-center py-10">No recent logs</p>
                )}
              </div>
            </div>

            {/* Performance */}
            <div className="bg-[#121316] border border-white/5 p-5 md:col-span-2 flex flex-col justify-between text-left h-[260px]">
              <div className="flex justify-between items-center border-b border-white/5 pb-2 mb-2">
                <h4 className="font-serif text-xs text-slate-200">My Performance (This Month)</h4>
                <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">Revenue: ₹2.45 Cr</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-[10px] py-1">
                <div>
                  <p className="text-slate-500 text-[8px] uppercase">Calls Made</p>
                  <p className="text-sm font-serif text-white font-bold">128</p>
                  <span className="text-[7.5px] text-emerald-500 font-bold">↑ 15%</span>
                </div>
                <div className="border-l border-white/5">
                  <p className="text-slate-500 text-[8px] uppercase">Site Visits</p>
                  <p className="text-sm font-serif text-white font-bold">18</p>
                  <span className="text-[7.5px] text-emerald-500 font-bold">↑ 10%</span>
                </div>
                <div className="border-l border-white/5">
                  <p className="text-slate-500 text-[8px] uppercase">Bookings</p>
                  <p className="text-sm font-serif text-white font-bold">3</p>
                  <span className="text-[7.5px] text-emerald-500 font-bold">↑ 50%</span>
                </div>
              </div>
              <div className="flex-1 w-full h-24 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={agentLineChartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="#5b5e68" fontSize={8} tickLine={false} axisLine={false} />
                    <YAxis stroke="#5b5e68" fontSize={8} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#121316', borderColor: '#c5a880', fontSize: 10 }} />
                    <Line type="monotone" dataKey="bookings" stroke="#c5a880" strokeWidth={1.5} dot={{ fill: '#c5a880', r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </>
      )}

      {/* Quick Add Lead Modal (matches clean luxury aesthetic) */}
      {addLeadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#121316] border border-gold-400/30 p-6 w-full max-w-md space-y-5 rounded-none text-left shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <h3 className="font-serif text-md text-white font-light">New Prospect Registration</h3>
              <button 
                onClick={() => setAddLeadOpen(false)}
                className="text-slate-500 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={newLeadName}
                  onChange={(e) => setNewLeadName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-slate-950 border border-white/5 p-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Phone Number</label>
                <input 
                  type="text" 
                  required
                  value={newLeadPhone}
                  onChange={(e) => setNewLeadPhone(e.target.value)}
                  placeholder="e.g. +919988776655"
                  className="w-full bg-slate-950 border border-white/5 p-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Lead Source</label>
                  <select 
                    value={newLeadSource}
                    onChange={(e) => setNewLeadSource(e.target.value)}
                    className="w-full bg-slate-950 border border-white/5 p-2.5 text-slate-300 focus:outline-none focus:border-gold-500"
                  >
                    <option value="Website">Website Form</option>
                    <option value="Facebook Ads">Facebook Lead Ads</option>
                    <option value="MagicBricks">MagicBricks</option>
                    <option value="99acres">99acres</option>
                    <option value="Manual Input">Manual Input</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Location Preference</label>
                  <input 
                    type="text" 
                    value={newLeadLocation}
                    onChange={(e) => setNewLeadLocation(e.target.value)}
                    placeholder="e.g. Whitefield"
                    className="w-full bg-slate-950 border border-white/5 p-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-3 text-[10px] font-bold uppercase tracking-wider">
                <button 
                  type="button"
                  onClick={() => setAddLeadOpen(false)}
                  className="px-4 py-2 border border-white/10 hover:border-white/20 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-gold-500 hover:bg-gold-600 text-gold-950 font-black shadow-md shadow-gold-500/10"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
