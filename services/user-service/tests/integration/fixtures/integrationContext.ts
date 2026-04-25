import request from 'supertest';
import { app } from '../../../src/app';

export interface IntegrationContext {
  api: ReturnType<typeof request>;
  runId: string;
}

export const createIntegrationContext = (): IntegrationContext => ({
  api: request(app),
  runId: `it-user-${Date.now()}-${Math.random().toString(16).slice(2)}`,
});
