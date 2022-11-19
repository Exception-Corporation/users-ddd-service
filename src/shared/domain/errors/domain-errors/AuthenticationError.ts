import { DomainError } from '@/shared/domain/errors/lib/DomainError';
import { DomainErrorCode } from '@/shared/domain/errors/lib/DomainErrorCode';

export class AuthenticationError extends DomainError {
  public domainErrorCode = DomainErrorCode.INTERNAL_ERROR;

  constructor(message: string, wrongPassword?: boolean) {
    super(
      wrongPassword ? message : `INTERNAL AUTHENTICATION ERROR: ${message}`,
      'unsupported'
    );
  }
}
