export interface IRequestAdapter {
  build<T extends object>(request: T, properties?: Array<string>): Promise<T>;
}
