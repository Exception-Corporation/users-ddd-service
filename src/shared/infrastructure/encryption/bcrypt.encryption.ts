import { injectable } from '@container';
import { IEncrypt } from '@/shared/domain/encryption/encrypt.interface';
import bcrypt from 'bcrypt';

@injectable()
export class BcrypEncryption implements IEncrypt {
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
