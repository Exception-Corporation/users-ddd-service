export interface IRequestAdapter {
  validateData<T extends object>(
    request: T,
    properties?: Array<string>
  ): Promise<T>;
}
