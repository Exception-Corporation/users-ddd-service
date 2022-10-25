import jwt from 'jsonwebtoken';
import config from '@/shared/infrastructure/config';
import { DateLib } from '@/shared/infrastructure/dates';
import { AuthenticationError } from '@/shared/domain/errors/domain-errors/AuthenticationError';
import { IAuthentication } from '@/shared/domain/auth/authentication.interface';
import { GlobalFunctions } from '@/shared/infrastructure/utils/global.functions';
import { UserPrimitive } from '@/user/v1/domain/user/user.aggregate.root';
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

  async sign(
    data: any,
    propertiesToIgnore: Array<string> = []
  ): Promise<string> {
    try {
      data = GlobalFunctions.getNewParams<any>(data, propertiesToIgnore);

      const token = await jwt.sign(
        {
          ...data,
          exp: DateLib.getData(
            data.exp ? data.exp : this.expirationTime,
            'hours'
          )
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
