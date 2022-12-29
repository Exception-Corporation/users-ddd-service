export interface IAuthentication {
  sign<T>(data: T, propertiesToIgnore?: Array<keyof T>): Promise<string>;
  verify(token: string): Promise<object | string>;
}
