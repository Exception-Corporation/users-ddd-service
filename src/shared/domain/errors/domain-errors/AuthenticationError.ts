import { DomainError } from '@/shared/domain/errors/lib/DomainError';
import { DomainErrorCode } from '@/shared/domain/errors/lib/DomainErrorCode';

export class AuthenticationError extends DomainError {
  public domainErrorCode = DomainErrorCode.INVALID_CREDENTIALS;

  constructor(message: string, wrongPassword?: boolean) {
    super(
      wrongPassword ? message : `INTERNAL AUTHENTICATION ERROR: ${message}`,
      'unsupported'
    );
  }
}
