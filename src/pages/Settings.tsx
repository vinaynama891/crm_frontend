import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Settings as SettingsIcon, 
  Key, 
  Phone, 
  MessageSquare, 
  Mail, 
  ShieldCheck, 
  RotateCcw,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export const Settings: React.FC = () => {
  const [twilioSid, setTwilioSid] = useState('');
  const [twilioToken, setTwilioToken] = useState('');
  const [twilioNumber, setTwilioNumber] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [resendApiKey, setResendApiKey] = useState('');
  const [webhookSecret, setWebhookSecret] = useState('');
  const [assignmentMode, setAssignmentMode] = useState<'ROUND_ROBIN' | 'LEAST_BUSY' | 'MANUAL'>('ROUND_ROBIN');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/settings');
      const s = res.data;
      if (s) {
        setTwilioSid(s.twilioSid || '');
        setTwilioToken(s.twilioToken || '');
        setTwilioNumber(s.twilioNumber || '');
        setWhatsappNumber(s.whatsappNumber || '');
        setResendApiKey(s.resendApiKey || '');
        setWebhookSecret(s.webhookSecret || '');
        setAssignmentMode(s.assignmentMode || 'ROUND_ROBIN');
      }
    } catch (err) {
      console.error('[Settings] Fetch settings failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      await api.put('/settings', {
        twilioSid,
        twilioToken,
        twilioNumber,
        whatsappNumber,
        resendApiKey,
        webhookSecret,
        assignmentMode,
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('[Settings] Update settings failed:', err);
      alert('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin"></div>
        <p className="mt-3 text-xs text-slate-655 uppercase font-bold tracking-wider">Fetching integration settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Integrations & Credentials</h2>
        <p className="text-xs text-slate-400 mt-1">Configure CRM automation routing, telephony APIs, and WhatsApp credentials</p>
      </div>

      {success && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-xs font-semibold text-green-400 flex items-center space-x-2">
          <CheckCircle size={16} />
          <span>Integration settings updated successfully! All API services hot-reloaded.</span>
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="space-y-6">
        
        {/* Lead Assignment Mode */}
        <div className="glass-panel p-5 rounded-2xl border-slate-900 space-y-4">
          <h3 className="font-bold text-sm text-slate-205 border-b border-slate-800 pb-2 flex items-center gap-1.5">
            <RotateCcw size={16} className="text-brand-400" />
            Lead Auto-Assignment Strategy
          </h3>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Assignment Mode</label>
            <select
              value={assignmentMode}
              onChange={(e) => setAssignmentMode(e.target.value as any)}
              className="mt-2 block w-full bg-slate-950 border border-slate-850 rounded-xl text-xs px-3 py-2.5 text-slate-200 focus:outline-none"
            >
              <option value="ROUND_ROBIN">Round Robin (Distribute evenly to agents)</option>
              <option value="LEAST_BUSY">Least Busy (Assign to agent with fewest active leads)</option>
              <option value="MANUAL">Manual Assignment (Admin assigns leads manually)</option>
            </select>
          </div>
        </div>

        {/* Twilio Telephony Settings */}
        <div className="glass-panel p-5 rounded-2xl border-slate-900 space-y-4">
          <h3 className="font-bold text-sm text-slate-205 border-b border-slate-800 pb-2 flex items-center gap-1.5">
            <Phone size={16} className="text-brand-400" />
            Twilio Telephony & Voice Bridge
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Twilio Account SID</label>
              <input
                type="text"
                value={twilioSid}
                onChange={(e) => setTwilioSid(e.target.value)}
                className="mt-2 block w-full px-3 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                placeholder="AC..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Twilio Auth Token</label>
              <input
                type="password"
                value={twilioToken}
                onChange={(e) => setTwilioToken(e.target.value)}
                className="mt-2 block w-full px-3 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                placeholder="••••••••••••••••••••••••••••••••"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Twilio Voice Number</label>
              <input
                type="text"
                value={twilioNumber}
                onChange={(e) => setTwilioNumber(e.target.value)}
                className="mt-2 block w-full px-3 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                placeholder="+1234567890"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Twilio WhatsApp Number</label>
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="mt-2 block w-full px-3 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                placeholder="+1234567890"
              />
            </div>
          </div>
        </div>

        {/* Resend Settings */}
        <div className="glass-panel p-5 rounded-2xl border-slate-900 space-y-4">
          <h3 className="font-bold text-sm text-slate-205 border-b border-slate-800 pb-2 flex items-center gap-1.5">
            <Mail size={16} className="text-brand-400" />
            Resend Email Integration
          </h3>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Resend API Key</label>
            <input
              type="password"
              value={resendApiKey}
              onChange={(e) => setResendApiKey(e.target.value)}
              className="mt-2 block w-full px-3 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
              placeholder="re_..."
            />
          </div>
        </div>

        {/* Lead Capture Webhook Settings */}
        <div className="glass-panel p-5 rounded-2xl border-slate-900 space-y-4">
          <h3 className="font-bold text-sm text-slate-205 border-b border-slate-800 pb-2 flex items-center gap-1.5">
            <ShieldCheck size={16} className="text-brand-400" />
            Lead Capture Webhook Integration
          </h3>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Webhook Secret Key (X-Webhook-Secret)</label>
            <input
              type="text"
              value={webhookSecret}
              onChange={(e) => setWebhookSecret(e.target.value)}
              className="mt-2 block w-full px-3 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
              placeholder="e.g. secret_key_abc_123"
            />
          </div>

          {/* Webhook endpoint URL callout */}
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-900 text-xs">
            <span className="text-[9px] uppercase font-bold text-brand-400 block mb-1">Your Webhook URL</span>
            <code className="text-slate-300 select-all font-mono">
              {window.location.origin.replace('3000', '5000')}/api/webhooks/leads?orgId={localStorage.getItem('estateflow_org_id')}
            </code>
          </div>
        </div>

        {/* Form actions */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-brand-600/10 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Integration Settings'}
          </button>
        </div>

      </form>
    </div>
  );
};
