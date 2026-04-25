export interface LoginFixturePayload {
  email: string;
  password: string;
}

export const validLoginPayload = (): LoginFixturePayload => ({
  email: 'integration.auth@bebras.org',
  password: `it-secret-${Date.now()}`,
});

export const invalidLoginPayload = (): Partial<LoginFixturePayload> => ({
  email: 'integration.auth@bebras.org',
});
