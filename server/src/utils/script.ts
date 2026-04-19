export const generateId = (): string => {
  return `usr_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
};
