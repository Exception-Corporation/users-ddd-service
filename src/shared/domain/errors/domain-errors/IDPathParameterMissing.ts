import { DomainError } from "@/shared/domain/errors/lib/DomainError";
import { DomainErrorCode } from "@/shared/domain/errors/lib/DomainErrorCode";

export class IDPathParameterMissing extends DomainError {
  public domainErrorCode = DomainErrorCode.ID_PATH_PARAMETER_MISSING;

  constructor(id: number) {
    super(`Missing ID: [${id}] path paramter`, "badRequest");
  }
}
