import request from 'supertest';
import { app } from '../../src/app';

describe('team-service routes', () => {
  it('GET /health should return service status', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body.service).toBe('team-service');
    expect(response.body.status).toBe('ok');
  });

  it('GET /teams should return seeded team list', async () => {
    const response = await request(app).get('/teams');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0]).toMatchObject({
      id: 'team-1',
      name: 'Core Team',
      status: 'pending-implementation',
    });
  });
});
