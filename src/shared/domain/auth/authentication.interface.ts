export interface IAuthentication {
  sign(data: object, propertiesToIgnore?: Array<string>): Promise<string>;
  verify(token: string): Promise<object | string>;
}
