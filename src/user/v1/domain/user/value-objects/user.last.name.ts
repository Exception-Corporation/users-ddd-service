import { ValueObject } from "@/shared/domain/interfaces/value.object";

export class UserLastName implements ValueObject<string> {
  constructor(private userLastName: string) {
    this.validate();
  }

  valueOf(): string {
    return this.userLastName;
  }

  fromPrimitive(value: string): ValueObject<string> {
    return new UserLastName(value);
  }

  validate(): void {
    if (!this.userLastName) {
      throw new Error("User-last-name not valid");
    }
  }

  equals(object: ValueObject<string>): boolean {
    return this.valueOf() == object.valueOf();
  }
}
