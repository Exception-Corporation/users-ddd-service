import { DomainErrorCode } from '@/shared/domain/errors/lib/DomainErrorCode';

export abstract class DomainError {
  public abstract domainErrorCode: DomainErrorCode;

  constructor(
    public message: string,
    public type:
      | 'badRequest'
      | 'unauthorized'
      | 'forbidden'
      | 'notFound'
      | 'unsupported'
      | 'invalid'
  ) {}
}
