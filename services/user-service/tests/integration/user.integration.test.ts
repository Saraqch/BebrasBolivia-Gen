import { createIntegrationContext } from './fixtures/integrationContext';
import { createUserPayload, updateUserPayload } from './fixtures/userFixtures';

describe('user-service integration', () => {
  it('should create, list and update a user using reusable fixtures', async () => {
    const context = createIntegrationContext();

    const createResponse = await context.api.post('/user/create').send(createUserPayload(context.runId));

    expect(createResponse.status).toBe(201);
    expect(createResponse.body.id).toBeDefined();

    const userId = createResponse.body.id as string;

    const listResponse = await context.api.get('/user/getAll');

    expect(listResponse.status).toBe(200);
    expect(listResponse.body.some((user: { id: string }) => user.id === userId)).toBe(true);

    const updateResponse = await context.api
      .put('/user/update')
      .send(updateUserPayload(userId, context.runId));

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.id).toBe(userId);
    expect(updateResponse.body.name).toContain('Integration User Updated');
  });
});
