export interface IEncrypt {
  encrypt(toEncrypt: string, saltRounds: number): Promise<string>;
  verifyEncrypValues(
    normalValue: string,
    encryptValue: string
  ): Promise<boolean>;
}
