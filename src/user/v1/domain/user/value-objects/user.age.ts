import { ValueObject } from "@/shared/domain/interfaces/value.object";
import { ValueObjectError } from "@/shared/domain/errors/domain-errors/ValueObjectError";

export class UserAge implements ValueObject<number> {
  constructor(private userAge: number) {
    this.validate();
  }

  valueOf(): number {
    return this.userAge;
  }

  fromPrimitive(value: number): ValueObject<number> {
    return new UserAge(value);
  }

  validate(): void {
    if (isNaN(this.userAge)) {
      throw new ValueObjectError("User-age not valid");
    }
  }

  equals(object: ValueObject<number>): boolean {
    return this.valueOf() == object.valueOf();
  }
}
