import request from 'supertest';
import { app } from '../../src/app';

describe('auth-service routes', () => {
  it('GET /health should return service status', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body.service).toBe('auth-service');
    expect(response.body.status).toBe('ok');
  });

  it('POST /auth/login should validate required fields', async () => {
    const response = await request(app).post('/auth/login').send({ email: 'dev@bebras.org' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: 'email and password are required',
      status: 'error',
    });
  });

  it('POST /auth/login should return a dev session', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'dev@bebras.org', password: '123456' });

    expect(response.status).toBe(200);
    expect(response.body.tokenType).toBe('Bearer');
    expect(response.body.expiresIn).toBe(3600);
    expect(response.body.user.email).toBe('dev@bebras.org');
    expect(response.body.accessToken).toContain('dev-token-');
  });
});
