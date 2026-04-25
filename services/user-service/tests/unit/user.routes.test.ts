import request from 'supertest';
import { app } from '../../src/app';

describe('user-service routes', () => {
  it('GET /health should return service status', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body.service).toBe('user-service');
    expect(response.body.status).toBe('ok');
  });

  it('should create, list and update a user', async () => {
    const createResponse = await request(app)
      .post('/user/create')
      .send({ email: 'alice@bebras.org', name: 'Alice' });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body.email).toBe('alice@bebras.org');
    expect(createResponse.body.name).toBe('Alice');
    expect(createResponse.body.id).toBeDefined();

    const userId = createResponse.body.id as string;

    const listResponse = await request(app).get('/user/getAll');

    expect(listResponse.status).toBe(200);
    expect(Array.isArray(listResponse.body)).toBe(true);
    expect(listResponse.body.some((user: { id: string }) => user.id === userId)).toBe(true);

    const updateResponse = await request(app)
      .put('/user/update')
      .send({ id: userId, name: 'Alice Updated' });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.name).toBe('Alice Updated');
    expect(updateResponse.body.id).toBe(userId);
  });
});
