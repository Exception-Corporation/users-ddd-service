export type MiddlewareResponse<T, R, N, S> = (
  req: T,
  res: R,
  next: N
) => Promise<S>;

export interface SecurityMiddleware<T, R, N, S> {
  isAuth(roles: Array<string>): MiddlewareResponse<T, R, N, S>;
}
