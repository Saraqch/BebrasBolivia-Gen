type LogPayload = Record<string, unknown>;

export const logger = {
  warn: (message: string, payload: LogPayload = {}): void => {
    console.warn(message, payload);
  },
  error: (message: string, payload: LogPayload = {}): void => {
    console.error(message, payload);
  },
};
