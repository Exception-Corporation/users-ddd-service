import { ValueObject } from "@/shared/domain/interfaces/value.object";
import { ValueObjectError } from "@/shared/domain/errors/domain-errors/ValueObjectError";

export class ResponseStatus implements ValueObject<number> {
  constructor(private status: number) {
    this.validate();
  }

  valueOf(): number {
    return this.status;
  }

  fromPrimitive(value: number): ValueObject<number> {
    return new ResponseStatus(value);
  }

  validate(): void {
    if (!this.status) {
      throw new ValueObjectError("Response-status not valid");
    }
  }

  equals(object: ValueObject<number>): boolean {
    return this.valueOf() == object.valueOf();
  }
}
