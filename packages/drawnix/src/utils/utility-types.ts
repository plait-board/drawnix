export type ResolutionType<T extends (...args: any) => any> = T extends (
  ...args: any
) => Promise<infer R>
  ? R
  : any;

export type ValueOf<T> = T[keyof T];
