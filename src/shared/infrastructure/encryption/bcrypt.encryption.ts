import { IEncrypt } from "@/shared/domain/interfaces/encrypt.interface";
import bcrypt from "bcrypt";

export class BcrypEncryption implements IEncrypt {
  private static instance: IEncrypt | undefined;
  constructor() {}

  static getInstance() {
    if (this.instance) return this.instance;
    this.instance = new BcrypEncryption();
    return this.instance;
  }

  async encrypt(toEncrypt: string, saltRounds: number): Promise<string> {
    const newEncriptValue = await bcrypt.hash(toEncrypt, saltRounds);
    return newEncriptValue;
  }

  async verifyEncrypValues(
    normalValue: string,
    encryptValue: string
  ): Promise<boolean> {
    const verifyValues = await bcrypt.compare(normalValue, encryptValue);
    return verifyValues;
  }
}
