import { ValueObject } from "@/shared/domain/interfaces/value.object";

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
      throw new Error("User-first-name not valid");
    }
  }

  equals(object: ValueObject<string>): boolean {
    return this.valueOf() == object.valueOf();
  }
}
