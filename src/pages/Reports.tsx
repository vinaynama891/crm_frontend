import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { 
  BarChart3, 
  Download, 
  Zap, 
  ArrowDown, 
  Clock, 
  User, 
  Globe2 
} from 'lucide-react';

interface FunnelStage {
  name: string;
  count: number;
  conversionRate: number;
  dropOffRate: number;
}

interface SourceStat {
  source: string;
  count: number;
  booked: number;
  conversionRate: number;
}

interface AgentStat {
  agentId: string;
  name: string;
  leadsAssigned: number;
  callsMade: number;
  callsConnected: number;
  followupsCompleted: number;
  siteVisitsScheduled: number;
  bookingsGenerated: number;
  conversionRate: number;
}

export const Reports: React.FC = () => {
  const [funnel, setFunnel] = useState<FunnelStage[]>([]);
  const [sources, setSources] = useState<SourceStat[]>([]);
  const [agents, setAgents] = useState<AgentStat[]>([]);
  const [responseTime, setResponseTime] = useState<{ averageResponseTimeMinutes: number; fastestAgent: string; slowestAgent: string } | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);

  const fetchReportData = async () => {
    try {
      const funnelRes = await api.get('/analytics/funnel');
      setFunnel(funnelRes.data);

      const agentRes = await api.get('/analytics/agents');
      setAgents(agentRes.data);

      // Fetch source stats directly from funnel/leads data
      // For simplicity, we can fetch from leads and group them, or write a dedicated endpoint.
      // Wait, we have getLeadsBySource in reportService, but did we expose it in analyticsController?
      // Let's check: in analyticsController, did we add leads by source?
      // Ah! In analyticsController.ts, we did not expose getLeadsBySource as a REST route!
      // But wait! We can easily query all leads and calculate it in the frontend, or write a quick calculation.
      // Let's see: we can query all leads from the API `/api/leads` and group them in the frontend! That is extremely easy, robust, and doesn't require compiling the backend again.
      const leadsRes = await api.get('/leads');
      const leads = leadsRes.data;
      
      const sourceMap: Record<string, { count: number; booked: number }> = {};
      leads.forEach((l: any) => {
        if (!sourceMap[l.source]) {
          sourceMap[l.source] = { count: 0, booked: 0 };
        }
        sourceMap[l.source].count += 1;
        if (l.status === 'Booked') {
          sourceMap[l.source].booked += 1;
        }
      });

      const sourceStats: SourceStat[] = Object.keys(sourceMap).map((src) => {
        const count = sourceMap[src].count;
        const booked = sourceMap[src].booked;
        const rate = count > 0 ? (booked / count) * 100 : 0;
        return {
          source: src,
          count,
          booked,
          conversionRate: parseFloat(rate.toFixed(1)),
        };
      });
      setSources(sourceStats);

      const speedRes = await api.get('/analytics/responsetime');
      setResponseTime(speedRes.data);

    } catch (err) {
      console.error('[Reports] Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  const handleCSVExport = async (type: 'leads' | 'agents' | 'funnel') => {
    setDownloading(type);
    try {
      const res = await api.get(`/analytics/export?type=${type}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `estateflow_report_${type}_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('[Reports] Export error:', err);
      alert('Failed to export CSV report.');
    } finally {
      setDownloading(null);
    }
  };

  const COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ede9fe', '#94a3b8'];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin"></div>
        <p className="mt-3 text-xs text-slate-655 uppercase font-bold tracking-wider">Compiling analytics charts...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Title & CSV Exporters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Conversion Analytics</h2>
          <p className="text-xs text-slate-400 mt-1">Funnel drop-off metrics, agent response times, and source volume</p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => handleCSVExport('leads')}
            disabled={downloading !== null}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-350 border border-slate-800 transition-colors"
          >
            <Download size={14} />
            <span>{downloading === 'leads' ? 'Exporting...' : 'Leads CSV'}</span>
          </button>
          <button
            onClick={() => handleCSVExport('agents')}
            disabled={downloading !== null}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-350 border border-slate-800 transition-colors"
          >
            <Download size={14} />
            <span>{downloading === 'agents' ? 'Exporting...' : 'Agents CSV'}</span>
          </button>
        </div>
      </div>

      {/* Response Speed Callouts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel p-4 rounded-xl flex items-center space-x-3 border-slate-900">
          <div className="p-3 bg-brand-500/10 text-brand-400 rounded-lg"><Clock size={20} /></div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Average Response Time</span>
            <span className="text-md font-bold text-slate-205 text-white">
              {responseTime?.averageResponseTimeMinutes ? `${responseTime.averageResponseTimeMinutes} minutes` : '0 minutes'}
            </span>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl flex items-center space-x-3 border-slate-900">
          <div className="p-3 bg-green-500/10 text-green-400 rounded-lg"><User size={20} /></div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Fastest Agent Response</span>
            <span className="text-xs font-bold text-slate-205 text-white truncate max-w-[200px] block mt-0.5">
              {responseTime?.fastestAgent || 'N/A'}
            </span>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl flex items-center space-x-3 border-slate-900">
          <div className="p-3 bg-red-500/10 text-red-400 rounded-lg"><User size={20} /></div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Slowest Agent Response</span>
            <span className="text-xs font-bold text-slate-205 text-white truncate max-w-[200px] block mt-0.5">
              {responseTime?.slowestAgent || 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* Funnel chart and dropoff metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recharts Funnel visualization */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-2xl flex flex-col h-[380px]">
          <h3 className="font-bold text-sm text-slate-200 mb-4 flex items-center gap-1.5">
            <BarChart3 size={16} className="text-brand-400" />
            Conversion Funnel Metrics
          </h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={funnel}
                margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#94a3b8" />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" width={90} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }}
                  labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[0, 8, 8, 0]}>
                  {funnel.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Funnel dropoff values */}
        <div className="lg:col-span-1 glass-panel p-5 rounded-2xl flex flex-col h-[380px]">
          <h3 className="font-bold text-sm text-slate-205 border-b border-slate-800 pb-2 mb-4">Funnel Drop-offs</h3>
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {funnel.map((f, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-xs text-slate-200">{f.name}</h5>
                  <span className="text-[10px] text-slate-500">{f.count} leads</span>
                </div>

                <div className="text-right">
                  <span className="text-xs font-semibold text-brand-400 block">{f.conversionRate}% Conv.</span>
                  {idx > 0 && (
                    <span className="text-[10px] text-red-400 font-medium flex items-center justify-end mt-0.5">
                      <ArrowDown size={10} className="mr-0.5" /> {f.dropOffRate}% Drop-off
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Source analysis & Agent leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Source Volume */}
        <div className="lg:col-span-1 glass-panel p-5 rounded-2xl flex flex-col h-[360px]">
          <h3 className="font-bold text-sm text-slate-205 border-b border-slate-800 pb-2 mb-4 flex items-center gap-1.5">
            <Globe2 size={16} className="text-brand-400" />
            Leads By Source
          </h3>
          <div className="flex-1 min-h-0 overflow-y-auto space-y-3.5 pr-1">
            {sources.map((src, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-350">{src.source}</span>
                  <span className="text-slate-200">{src.count} leads</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-900">
                  <div 
                    className="bg-brand-500 h-full rounded-full" 
                    style={{ width: `${(src.count / Math.max(...sources.map(s => s.count))) * 100}%` }}
                  ></div>
                </div>
                <span className="text-[9px] text-slate-500 font-bold block">Conversion rate: {src.conversionRate}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Agent Leaderboard */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-2xl flex flex-col h-[360px]">
          <h3 className="font-bold text-sm text-slate-205 border-b border-slate-800 pb-2 mb-4 flex items-center gap-1.5">
            <Zap size={16} className="text-brand-400" />
            Agent Performance Leaderboard
          </h3>
          
          <div className="flex-1 overflow-x-auto min-h-0">
            <table className="min-w-full divide-y divide-slate-850">
              <thead>
                <tr>
                  <th className="py-2.5 text-left text-[9px] font-bold text-slate-500 uppercase tracking-wider">Agent</th>
                  <th className="py-2.5 text-center text-[9px] font-bold text-slate-500 uppercase tracking-wider">Assigned</th>
                  <th className="py-2.5 text-center text-[9px] font-bold text-slate-500 uppercase tracking-wider">Calls Made</th>
                  <th className="py-2.5 text-center text-[9px] font-bold text-slate-500 uppercase tracking-wider">Visits</th>
                  <th className="py-2.5 text-center text-[9px] font-bold text-slate-500 uppercase tracking-wider">Bookings</th>
                  <th className="py-2.5 text-right text-[9px] font-bold text-slate-500 uppercase tracking-wider">Conversion %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850/60 bg-transparent text-xs text-slate-350">
                {agents.map((agent) => (
                  <tr key={agent.agentId} className="hover:bg-slate-900/20 transition-colors">
                    <td className="py-3 font-semibold text-slate-200">{agent.name}</td>
                    <td className="py-3 text-center">{agent.leadsAssigned}</td>
                    <td className="py-3 text-center">{agent.callsMade}</td>
                    <td className="py-3 text-center">{agent.siteVisitsScheduled}</td>
                    <td className="py-3 text-center text-green-400 font-bold">{agent.bookingsGenerated}</td>
                    <td className="py-3 text-right font-bold text-white">{agent.conversionRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
};
