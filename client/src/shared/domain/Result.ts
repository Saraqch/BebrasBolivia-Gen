export interface Result<T, E extends Error = Error> {
  ok: boolean;
  value?: T;
  error?: E;
}

export const success = <T,>(value: T): Result<T> => ({
  ok: true,
  value,
});

export const failure = <E extends Error,>(error: E): Result<never, E> => ({
  ok: false,
  error,
});
