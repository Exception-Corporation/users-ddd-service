export interface IAuthentication {
  sign(data: object): Promise<string>;
  verify(token: string): Promise<object | string>;
}
