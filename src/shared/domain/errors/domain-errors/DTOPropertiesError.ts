import { DomainError } from '@/shared/domain/errors/lib/DomainError';
import { DomainErrorCode } from '@/shared/domain/errors/lib/DomainErrorCode';

export class DTOPropertiesError extends DomainError {
  public domainErrorCode = DomainErrorCode.DTO_PROPERTIES_ERROR;

  constructor(properties: Array<string>) {
    super(
      `DTO is not correct, invalid properties: [${properties.join(',')}]`,
      'badRequest'
    );
  }
}
