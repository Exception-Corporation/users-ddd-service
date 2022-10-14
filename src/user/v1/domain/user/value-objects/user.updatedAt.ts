import { ValueObject } from "@/shared/domain/interfaces/value.object";

export class UserUpdatedAt implements ValueObject<string | number> {
  constructor(private userUpdatedAt: string | number) {
    this.validate();
  }

  valueOf(): string | number {
    return this.userUpdatedAt;
  }

  fromPrimitive(value: string | number): ValueObject<string | number> {
    return new UserUpdatedAt(value);
  }

  validate(): void {
    if (!this.userUpdatedAt) {
      throw new Error("User-UpdatedAt not valid");
    }
  }

  equals(object: ValueObject<string | number>): boolean {
    return this.valueOf() == object.valueOf();
  }
}
