export interface Server<T> {
  getApp(): { app: T; initialize: () => Promise<void> };
}
