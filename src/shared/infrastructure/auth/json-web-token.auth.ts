import jwt from 'jsonwebtoken';
import config from '@/shared/infrastructure/config';
import { DateLib } from '@/shared/infrastructure/dates';
import { AuthenticationError } from '@/shared/domain/errors/domain-errors/AuthenticationError';
import { IAuthentication } from '@/shared/domain/auth/authentication.interface';

export class JSONWebTokenAuth implements IAuthentication {
  private static instance: JSONWebTokenAuth | undefined;
  private secretKey: string;
  private expirationTime: number;

  private constructor() {
    this.secretKey = config.authentication.accessTokenPrivateKey;
    this.expirationTime = config.authentication.accessTokenExpiresIn;
  }

  static getInstance() {
    if (JSONWebTokenAuth.instance) return JSONWebTokenAuth.instance;

    JSONWebTokenAuth.instance = new JSONWebTokenAuth();

    return JSONWebTokenAuth.instance;
  }

  async sign(data: object): Promise<string> {
    try {
      const token = await jwt.sign(
        {
          ...data,
          exp: DateLib.getData(this.expirationTime, 'hours')
        },
        this.secretKey
      );

      return token;
    } catch (error: any) {
      throw new AuthenticationError(error.toString());
    }
  }

  async verify(token: string): Promise<object | string> {
    try {
      const verifyResult = await jwt.verify(token, this.secretKey as string);

      return verifyResult;
    } catch (error: any) {
      throw new AuthenticationError(error.toString());
    }
  }
}
