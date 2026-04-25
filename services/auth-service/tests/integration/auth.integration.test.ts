import { createIntegrationContext, traceHeaders } from './fixtures/integrationContext';
import { invalidLoginPayload, validLoginPayload } from './fixtures/authFixtures';

describe('auth-service integration', () => {
  it('should reject invalid login payload', async () => {
    const context = createIntegrationContext();

    const response = await context.api
      .post('/auth/login')
      .set(traceHeaders(context.traceId))
      .send(invalidLoginPayload());

    expect(response.status).toBe(400);
    expect(response.body.status).toBe('error');
  });

  it('should create a session for valid credentials', async () => {
    const context = createIntegrationContext();

    const response = await context.api
      .post('/auth/login')
      .set(traceHeaders(context.traceId))
      .send(validLoginPayload());

    expect(response.status).toBe(200);
    expect(response.body.tokenType).toBe('Bearer');
    expect(response.body.user.email).toBe('integration.auth@bebras.org');
  });
});
