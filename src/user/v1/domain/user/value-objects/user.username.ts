import { ValueObject } from "@/shared/domain/interfaces/value.object";

export class UserUsername implements ValueObject<string> {
  constructor(private userName: string) {
    this.validate();
  }

  valueOf(): string {
    return this.userName;
  }

  fromPrimitive(value: string): ValueObject<string> {
    return new UserUsername(value);
  }

  validate(): void {
    if (!this.userName) {
      throw new Error("User-Username not valid");
    }
  }

  equals(object: ValueObject<string>): boolean {
    return this.valueOf() == object.valueOf();
  }
}
