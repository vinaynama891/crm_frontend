import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  avatarUrl?: string;
}

interface Organization {
  id: string;
  name: string;
  slug: string;
  role: 'ADMIN' | 'SALES_MANAGER' | 'SALES_AGENT';
  memberId: string;
}

interface AuthContextType {
  user: User | null;
  organization: Organization | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (params: {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
    companyName: string;
  }) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session on app load
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('estateflow_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/auth/me');
        setUser(res.data.user);
        setOrganization(res.data.organization);
        
        // Ensure cached org is synced
        localStorage.setItem('estateflow_org_id', res.data.organization.id);
      } catch (error) {
        console.error('[AuthContext] Session restore failed:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user: loggedUser, organization: loggedOrg } = res.data;

      localStorage.setItem('estateflow_token', token);
      localStorage.setItem('estateflow_org_id', loggedOrg.id);

      setUser(loggedUser);
      setOrganization(loggedOrg);
    } catch (error: any) {
      const msg = error.response?.data?.error || 'Login failed. Please check credentials.';
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (params: {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
    companyName: string;
  }) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/signup', params);
      const { token, user: registeredUser, organization: registeredOrg } = res.data;

      localStorage.setItem('estateflow_token', token);
      localStorage.setItem('estateflow_org_id', registeredOrg.id);

      setUser(registeredUser);
      setOrganization(registeredOrg);
    } catch (error: any) {
      const msg = error.response?.data?.error || 'Signup failed. Please try again.';
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('estateflow_token');
    localStorage.removeItem('estateflow_org_id');
    setUser(null);
    setOrganization(null);
    setLoading(false);
  };

  const updateUser = (updates: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        organization,
        isAuthenticated: !!user,
        loading,
        login,
        signup,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
