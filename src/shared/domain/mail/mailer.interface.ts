export interface IMailer<T> {
  send(config: T): Promise<void>;
}
