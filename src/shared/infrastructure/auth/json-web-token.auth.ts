import { inject, injectable } from '@container';
import jwt from 'jsonwebtoken';
import { TYPES } from '@/shared/infrastructure/d-injection/types';
import config from '@/shared/infrastructure/config';
import { IDates } from '@/shared/domain/dates/dates.interface';
import { InternalError } from '@/shared/domain/errors/domain-errors/InternalError';
import { IAuthentication } from '@/shared/domain/auth/authentication.interface';
import { GlobalFunctions } from '@/shared/infrastructure/utils/global.functions';

@injectable()
export class JSONWebTokenAuth implements IAuthentication {
  private secretKey: string;
  private expirationTime: number;

  constructor(@inject(TYPES.IDates) private dateService: IDates<unknown>) {
    this.secretKey = config.authentication.accessTokenPrivateKey;
    this.expirationTime = config.authentication.accessTokenExpiresIn;
  }

  async sign<T>(
    data: T,
    propertiesToIgnore: Array<keyof T> = []
  ): Promise<string> {
    try {
      const newData = GlobalFunctions.getNewParams<any>(
        data,
        propertiesToIgnore
      );

      const token = await jwt.sign(
        {
          ...newData,
          exp: this.dateService.getData(
            newData.exp ? newData.exp : this.expirationTime,
            'hours'
          )
        },
        this.secretKey
      );

      return token;
    } catch (error: any) {
      throw new InternalError(error.toString());
    }
  }

  async verify(token: string): Promise<object | string> {
    try {
      const verifyResult = await jwt.verify(token, this.secretKey as string);

      return verifyResult;
    } catch (error: any) {
      throw new InternalError(error.toString());
    }
  }
}
