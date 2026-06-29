import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, KeyRound, AlertTriangle } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Password123');
  };

  return (
    <div>
      <h3 className="text-xl font-bold text-slate-100 tracking-tight text-center">
        Welcome Back
      </h3>
      <p className="text-xs text-slate-400 text-center mt-1">
        Sign in to manage your real estate sales pipeline
      </p>

      {error && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start space-x-2 text-xs text-red-400">
          <AlertTriangle size={16} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
            Email Address
          </label>
          <div className="mt-1.5 relative rounded-xl shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <Mail size={16} />
            </div>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 text-sm"
              placeholder="agent@company.com"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
            Password
          </label>
          <div className="mt-1.5 relative rounded-xl shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <Lock size={16} />
            </div>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 text-sm"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-semibold text-white bg-brand-600 hover:bg-brand-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </div>
      </form>

      {/* Demo Credentials Section */}
      <div className="mt-6 border-t border-slate-800/80 pt-4">
        <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2.5">
          <KeyRound size={14} className="text-brand-400" />
          <span>Demo Accounts (Password: Password123)</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleFillDemo('admin@estateflow.com')}
            className="p-2 rounded-xl text-left bg-slate-950/50 hover:bg-slate-950 border border-slate-800/60 transition-colors"
          >
            <div className="text-[10px] font-bold text-brand-400 uppercase">ADMIN ROLE</div>
            <div className="text-[11px] text-slate-300 font-medium truncate mt-0.5">admin@estateflow.com</div>
          </button>
          <button
            type="button"
            onClick={() => handleFillDemo('agent1@estateflow.com')}
            className="p-2 rounded-xl text-left bg-slate-950/50 hover:bg-slate-950 border border-slate-800/60 transition-colors"
          >
            <div className="text-[10px] font-bold text-brand-400 uppercase">AGENT ROLE</div>
            <div className="text-[11px] text-slate-300 font-medium truncate mt-0.5">agent1@estateflow.com</div>
          </button>
        </div>
      </div>

      <div className="mt-6 text-center text-xs">
        <span className="text-slate-500">New to EstateFlow? </span>
        <Link to="/signup" className="text-brand-400 font-semibold hover:underline">
          Create organization
        </Link>
      </div>
    </div>
  );
};
