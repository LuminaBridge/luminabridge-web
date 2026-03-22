import { createContext, useContext, useEffect, useState } from 'react';
import { useAuthStore } from '@stores/auth';
import type { Tenant } from '@types';

interface TenantContextType {
  tenant: Tenant | null;
  loading: boolean;
  refreshTenant: () => Promise<void>;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(false);
  const { token } = useAuthStore();

  const fetchTenant = async () => {
    if (!token) {
      setTenant(null);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/v1/tenant', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setTenant(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch tenant:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenant();
  }, [token]);

  const refreshTenant = async () => {
    await fetchTenant();
  };

  return (
    <TenantContext.Provider value={{ tenant, loading, refreshTenant }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};
