import { DomainError } from '@/shared/domain/errors/lib/DomainError';
import { DomainErrorCode } from '@/shared/domain/errors/lib/DomainErrorCode';

export class InvalidCredentials extends DomainError {
  public domainErrorCode = DomainErrorCode.INVALID_CREDENTIALS;

  constructor() {
    super('Invalid credentials', 'invalid');
  }
}
