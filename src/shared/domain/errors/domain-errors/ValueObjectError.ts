import { DomainError } from '@/shared/domain/errors/lib/DomainError';
import { DomainErrorCode } from '@/shared/domain/errors/lib/DomainErrorCode';

export class ValueObjectError extends DomainError {
  public domainErrorCode = DomainErrorCode.DTO_PROPERTIES_ERROR;

  constructor(message: string) {
    super(message, 'badRequest');
  }
}
