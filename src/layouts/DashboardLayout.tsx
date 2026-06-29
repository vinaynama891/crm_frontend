import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  PhoneCall, 
  MessageSquare, 
  CalendarRange, 
  Clock5, 
  Activity as ActivityIcon, 
  BarChart3, 
  UserPlus, 
  ShieldAlert, 
  Settings as SettingsIcon, 
  HelpCircle, 
  Search, 
  Bell, 
  LogOut, 
  Menu, 
  X,
  ChevronDown,
  Layers
} from 'lucide-react';

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, label, active }) => (
  <Link
    to={to}
    className={`flex items-center space-x-3 px-4 py-3 text-xs tracking-wider uppercase transition-all duration-200 ${
      active 
        ? 'bg-[#181512] text-gold-400 border-l-2 border-gold-500 font-bold shadow-md shadow-gold-950/20' 
        : 'text-slate-400 hover:bg-slate-900/40 hover:text-slate-200'
    }`}
  >
    <span className={active ? 'text-gold-400' : 'text-slate-500 group-hover:text-slate-300'}>{icon}</span>
    <span>{label}</span>
  </Link>
);

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, organization, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const menuItems = [
    { to: '/dashboard', icon: <LayoutDashboard size={16} />, label: 'Dashboard', roles: ['ADMIN', 'SALES_MANAGER', 'SALES_AGENT'] },
    { to: '/leads', icon: <Users size={16} />, label: 'Leads', roles: ['ADMIN', 'SALES_MANAGER', 'SALES_AGENT'] },
    { to: '/properties', icon: <Building2 size={16} />, label: 'Properties', roles: ['ADMIN', 'SALES_MANAGER', 'SALES_AGENT'] },
    { to: '/followups', icon: <Clock5 size={16} />, label: 'Follow-Ups', roles: ['ADMIN', 'SALES_MANAGER', 'SALES_AGENT'] },
    { to: '/sitevisits', icon: <CalendarRange size={16} />, label: 'Site Visits', roles: ['ADMIN', 'SALES_MANAGER', 'SALES_AGENT'] },
    { to: '/reports', icon: <BarChart3 size={16} />, label: 'Reports', roles: ['ADMIN', 'SALES_MANAGER'] },
    { to: '/team', icon: <UserPlus size={16} />, label: 'Agents', roles: ['ADMIN', 'SALES_MANAGER'] },
    { to: '/settings', icon: <SettingsIcon size={16} />, label: 'Settings', roles: ['ADMIN'] },
  ];

  const allowedMenuItems = menuItems.filter(item => 
    organization && item.roles.includes(organization.role)
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#0b0c0e] text-slate-100 font-sans">
      
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-[#0e0f12] border-r border-white/5 p-5 space-y-6 shrink-0 relative z-30">
        
        {/* Brand/Logo Section (Matches Monogram "A" in image) */}
        <div className="flex items-center space-x-3 px-2 py-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
          <span className="font-serif text-2xl font-bold tracking-widest text-white flex items-center gap-2">
            A <span className="text-gold-400 font-sans font-light text-[10px] tracking-[0.25em] uppercase border-l border-white/10 pl-2">ESTATEFLOW</span>
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1">
          {allowedMenuItems.map((item) => (
            <SidebarLink 
              key={item.to} 
              to={item.to} 
              icon={item.icon} 
              label={item.label} 
              active={location.pathname === item.to || location.pathname.startsWith(item.to + '/')} 
            />
          ))}
        </nav>

        {/* User Info & Dropdown Trigger */}
        {user && (
          <div className="border-t border-white/5 pt-4 relative">
            <div 
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center justify-between p-2 hover:bg-slate-900/40 cursor-pointer transition-colors"
            >
              <div className="flex items-center space-x-3 truncate">
                <img 
                  src={user.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user.fullName}`} 
                  alt="Avatar" 
                  className="w-10 h-10 rounded-full border border-gold-500/20"
                />
                <div className="flex-1 text-left truncate">
                  <h5 className="font-medium text-xs text-slate-200 truncate">{user.fullName}</h5>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-0.5">{organization?.role.replace('_', ' ') || 'User'}</p>
                </div>
              </div>
              <ChevronDown size={14} className="text-slate-500" />
            </div>

            {profileDropdownOpen && (
              <div className="absolute bottom-16 left-0 right-0 bg-[#121316] border border-white/5 shadow-2xl p-2 z-50">
                <button
                  onClick={logout}
                  className="flex items-center space-x-2.5 w-full px-3 py-2 text-xs text-red-400 hover:bg-red-950/20 transition-all uppercase tracking-wider"
                >
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        )}
      </aside>

      {/* Header & Main Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-[#0b0c0e]/80 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Hamburger for mobile */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-400 hover:bg-slate-900/40 rounded-lg"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="md:hidden flex items-center space-x-1.5">
              <span className="font-serif text-lg font-bold tracking-widest text-white flex items-center gap-1.5">
                A <span className="text-gold-400 font-sans font-light text-[9px] tracking-widest border-l border-white/10 pl-1.5">ESTATEFLOW</span>
              </span>
            </div>
            
            {/* Search Input bar (matches style in image) */}
            <div className="hidden md:flex items-center space-x-2.5 bg-slate-950 border border-white/5 px-3 py-1.5 w-64">
              <Search size={14} className="text-slate-500" />
              <input 
                type="text" 
                placeholder="Search leads, tasks..." 
                className="bg-transparent text-xs text-slate-300 placeholder-slate-600 focus:outline-none w-full"
              />
            </div>
          </div>

          <div className="flex items-center space-x-5">
            {/* Notifications Bell */}
            <div className="relative">
              <button 
                onClick={() => setNotificationOpen(!notificationOpen)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors relative"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-gold-500 rounded-full flex items-center justify-center text-[8px] font-black text-[#1c140c] call-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {notificationOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-[#121316] border border-white/5 shadow-2xl p-4 z-50">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-3">
                    <h4 className="font-serif text-xs text-slate-200">Alerts</h4>
                    <button 
                      onClick={markAllAsRead}
                      className="text-[9px] text-gold-400 font-bold uppercase tracking-wider hover:underline"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="max-h-64 overflow-y-auto space-y-3 pr-1">
                    {notifications.length === 0 ? (
                      <p className="text-[10px] text-slate-550 text-slate-500 text-center py-4">No notifications yet</p>
                    ) : (
                      notifications.map((notif) => (
                        <div 
                          key={notif.id} 
                          onClick={() => markAsRead(notif.id)}
                          className={`p-2.5 border border-white/5 rounded-none cursor-pointer transition-colors text-left ${notif.read ? 'bg-[#0f1013]/40' : 'bg-gold-950/10 border-gold-900/30'}`}
                        >
                          <div className="flex justify-between items-start">
                            <h5 className="font-semibold text-xs text-slate-200">{notif.title}</h5>
                            <span className="text-[8px] text-slate-500 uppercase">{new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">{notif.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Help Question Icon */}
            <button className="text-slate-400 hover:text-white transition-colors">
              <HelpCircle size={18} />
            </button>

            {/* Org context selector (Matches drop-down in right-hand corner of header) */}
            {organization && (
              <div className="flex items-center space-x-2 border-l border-white/10 pl-5">
                <div className="w-8 h-8 rounded-full bg-gold-950/30 border border-gold-500/20 flex items-center justify-center font-serif text-xs text-gold-400 font-semibold uppercase">
                  {organization.name.charAt(0)}
                </div>
                <div className="hidden lg:block text-left">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate max-w-[120px]">{organization.name}</h4>
                  <p className="text-[8px] text-slate-600 font-bold uppercase tracking-wider">Workspace</p>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Mobile Navigation Menu Dropdown */}
        {mobileMenuOpen && (
          <nav className="md:hidden bg-[#0c0d0f] border-b border-white/5 px-4 py-3 flex flex-col space-y-1 relative z-40">
            {allowedMenuItems.map((item) => (
              <SidebarLink 
                key={item.to} 
                to={item.to} 
                icon={item.icon} 
                label={item.label} 
                active={location.pathname === item.to || location.pathname.startsWith(item.to + '/')} 
              />
            ))}
          </nav>
        )}

        {/* Dashboard Main Content view */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

    </div>
  );
};
