import { DomainError } from '@/shared/domain/errors/lib/DomainError';
import { DomainErrorCode } from '@/shared/domain/errors/lib/DomainErrorCode';

export class UserNotFound extends DomainError {
  public domainErrorCode = DomainErrorCode.USER_NOT_FOUND;

  constructor(property: string, value: string | number) {
    super(`User with ${property}: ${value} was not found`, 'notFound');
  }
}
