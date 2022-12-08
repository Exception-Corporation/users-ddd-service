export interface IAutoFiles<T> {
  getFiles<S>(data: S, filters?: Array<string>): T;
}
