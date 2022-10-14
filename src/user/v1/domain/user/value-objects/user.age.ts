import { ValueObject } from "@/shared/domain/interfaces/value.object";

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
      throw new Error("User-age not valid");
    }
  }

  equals(object: ValueObject<number>): boolean {
    return this.valueOf() == object.valueOf();
  }
}
