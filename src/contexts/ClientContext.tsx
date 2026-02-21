import { createContext, useContext, type ReactNode } from 'react';

export interface Client {
  id: string;
  name: string;
  domain: string;
  settings: {
    aiProvider: 'vertex' | 'anthropic';
    modelPreference: string;
    dataResidency: 'us' | 'eu';
  };
}

interface ClientContextValue {
  client: Client | null;
  isLoading: boolean;
}

const ClientContext = createContext<ClientContextValue | null>(null);

export function ClientProvider({ children, client }: { children: ReactNode; client: Client }) {
  return (
    <ClientContext.Provider value={{ client, isLoading: false }}>
      {children}
    </ClientContext.Provider>
  );
}

export function useClientContext() {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error('useClientContext must be used within ClientProvider');
  }
  return context;
}
