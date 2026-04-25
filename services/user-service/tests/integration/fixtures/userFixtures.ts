export const createUserPayload = (seed: string): { email: string; name: string } => ({
  email: `integration.user.${seed}@bebras.org`,
  name: `Integration User ${seed}`,
});

export const updateUserPayload = (id: string, seed: string): { id: string; name: string } => ({
  id,
  name: `Integration User Updated ${seed}`,
});
