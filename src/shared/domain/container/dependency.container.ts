export type Scope = 'singleton' | 'transient' | 'request';
export type ToValue =
  | 'to'
  | 'dynamic'
  | 'factory'
  | 'constant'
  | 'self'
  | 'provider';
export type Class<T> = new (...args: any[]) => T;

export interface IDependencyContainer {
  bind<T>(
    serviceIdentifier: string | Symbol,
    toValue: ToValue,
    constructor: Class<T>,
    params: Array<any>,
    scope?: Scope
  ): any;
  get<T>(serviceIdentifier: string | symbol): T;
  getAll<T>(serviceIdentifier: string | symbol): Array<T>;
  resolve<T>(constructor: Class<T>): T;
}
