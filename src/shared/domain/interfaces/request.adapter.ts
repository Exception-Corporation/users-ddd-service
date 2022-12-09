export interface IRequestAdapter<S> {
  validateData(
    request: S,
    properties?: Array<string>,
    classType?: Function
  ): Promise<S>;
}
