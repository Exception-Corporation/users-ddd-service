import { ValueObject } from "@/shared/domain/interfaces/value.object";

export class UserCreatedAt implements ValueObject<string | number> {
  constructor(private userCreatedAt: string | number) {
    this.validate();
  }

  valueOf(): string | number {
    return this.userCreatedAt;
  }

  fromPrimitive(value: string | number): ValueObject<string | number> {
    return new UserCreatedAt(value);
  }

  validate(): void {
    if (!this.userCreatedAt) {
      throw new Error("User-createdAt not valid");
    }
  }

  equals(object: ValueObject<string | number>): boolean {
    return this.valueOf() == object.valueOf();
  }
}
