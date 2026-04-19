export const userUiMapper = {
  toDomain: (api: Record<string, unknown>) => {
    return {
      email: String(api.email),
      id: String(api.id),
      name: String(api.name),
    };
  },
};
