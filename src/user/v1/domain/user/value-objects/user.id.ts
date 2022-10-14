import { ValueObject } from "@/shared/domain/interfaces/value.object";

export class UserId implements ValueObject<number> {
  constructor(private userId: number) {
    this.validate();
  }

  valueOf(): number {
    return this.userId;
  }

  fromPrimitive(value: number): ValueObject<number> {
    return new UserId(value);
  }

  validate(): void {
    if (!this.userId) {
      throw new Error("User-id not valid");
    }
  }

  equals(object: ValueObject<number>): boolean {
    return this.valueOf() == object.valueOf();
  }
}
