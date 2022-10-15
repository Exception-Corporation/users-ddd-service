import { DomainError } from "@/shared/domain/errors/lib/DomainError";
import { DomainErrorCode } from "@/shared/domain/errors/lib/DomainErrorCode";

export class UserNotFound extends DomainError {
  public domainErrorCode = DomainErrorCode.USER_NOT_FOUND;

  constructor(userId: string) {
    super(`User with Id ${userId} was not found`, "notFound");
  }
}
