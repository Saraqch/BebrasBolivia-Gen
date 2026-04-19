import { createAppSnapshot } from './app';

export interface BootstrapResult {
  app: ReturnType<typeof createAppSnapshot>;
  status: 'ready';
}

export const bootstrap = (): BootstrapResult => {
  return {
    app: createAppSnapshot(),
    status: 'ready',
  };
};
