import { ValueObject } from "@/shared/domain/interfaces/value.object";
import { ValueObjectError } from "@/shared/domain/errors/domain-errors/ValueObjectError";

export class UserFirstName implements ValueObject<string> {
  constructor(private userFirstName: string) {
    this.validate();
  }

  valueOf(): string {
    return this.userFirstName;
  }

  fromPrimitive(value: string): ValueObject<string> {
    return new UserFirstName(value);
  }

  validate(): void {
    if (!this.userFirstName) {
      throw new ValueObjectError("User-first-name not valid");
    }
  }

  equals(object: ValueObject<string>): boolean {
    return this.valueOf() == object.valueOf();
  }
}
