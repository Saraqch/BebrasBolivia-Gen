import { createIntegrationContext } from './fixtures/integrationContext';
import { expectedTeam } from './fixtures/teamFixtures';

describe('team-service integration', () => {
  it('should return team list with expected seed shape', async () => {
    const context = createIntegrationContext();

    const response = await context.api.get('/teams');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0]).toMatchObject(expectedTeam());
  });
});
