const BASE_URL = 'http://localhost:5173';

export const ROUTES = {
  sendMessage: (agentId: string): string => `${BASE_URL}/api/${agentId}/message`,
  getAgents: (): string => `${BASE_URL}/api/agents`,
};
