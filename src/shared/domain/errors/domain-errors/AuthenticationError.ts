import { DomainError } from '@/shared/domain/errors/lib/DomainError';
import { DomainErrorCode } from '@/shared/domain/errors/lib/DomainErrorCode';

export class AuthenticationError extends DomainError {
  public domainErrorCode = DomainErrorCode.DTO_PROPERTIES_ERROR;

  constructor(message: string) {
    super(`INTERNAL AUTHENTICATION ERROR: ${message}`, 'unsupported');
  }
}
