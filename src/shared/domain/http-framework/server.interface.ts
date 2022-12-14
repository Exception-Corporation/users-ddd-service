export interface Server<T> {
  getApp(): Promise<{ app: T; initialize: () => Promise<void> }>;
  getRouters(): any;
}
