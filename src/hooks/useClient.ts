import { useClientContext, type Client } from '../contexts/ClientContext';

export function useClient(): Client | null {
  const { client } = useClientContext();
  return client;
}
