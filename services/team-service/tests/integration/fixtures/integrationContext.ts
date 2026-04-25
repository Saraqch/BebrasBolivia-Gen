import request from 'supertest';
import { app } from '../../../src/app';

export interface IntegrationContext {
  api: ReturnType<typeof request>;
}

export const createIntegrationContext = (): IntegrationContext => ({
  api: request(app),
});
