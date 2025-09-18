export type ResolutionType<T extends (...args: unknown[]) => unknown> = T extends (
  ...args: unknown[]
) => Promise<infer R>
  ? R
  : unknown;

export type ValueOf<T> = T[keyof T];
