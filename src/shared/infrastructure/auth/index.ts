import { JSONWebTokenAuth } from '@/shared/infrastructure/auth/json-web-token.auth';
import { IAuthentication } from '@/shared/domain/auth/authentication.interface';

export const AuthenticationService: IAuthentication =
  JSONWebTokenAuth.getInstance();
