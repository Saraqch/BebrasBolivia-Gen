import request = require('supertest');
import { app } from '../../../src/app';

export interface IntegrationContext {
  api: ReturnType<typeof request>;
  traceId: string;
}

export const createIntegrationContext = (): IntegrationContext => {
  const traceId = `it-auth-${Date.now()}-${Math.random().toString(16).slice(2)}`;

  return {
    api: request(app),
    traceId,
  };
};

export const traceHeaders = (traceId: string): Record<string, string> => ({
  'x-trace-id': traceId,
});
