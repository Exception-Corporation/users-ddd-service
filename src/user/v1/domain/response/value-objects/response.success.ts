import { ValueObject } from "@/shared/domain/interfaces/value.object";
import { ValueObjectError } from "@/shared/domain/errors/domain-errors/ValueObjectError";

export class ResponseSuccess implements ValueObject<boolean> {
  constructor(private success: boolean) {
    this.validate();
  }

  valueOf(): boolean {
    return this.success;
  }

  fromPrimitive(value: boolean): ValueObject<boolean> {
    return new ResponseSuccess(value);
  }

  validate(): void {
    if (this.success == undefined) {
      throw new ValueObjectError("Response-success not valid");
    }
  }

  equals(object: ValueObject<boolean>): boolean {
    return this.valueOf() == object.valueOf();
  }
}
