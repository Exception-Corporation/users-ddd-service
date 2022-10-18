import { ValueObject } from '@/shared/domain/interfaces/value.object';
import { ValueObjectError } from '@/shared/domain/errors/domain-errors/ValueObjectError';

export class UserPassword implements ValueObject<string> {
  constructor(private userPassword: string) {
    this.validate();
  }

  valueOf(): string {
    return this.userPassword;
  }

  fromPrimitive(value: string): ValueObject<string> {
    return new UserPassword(value);
  }

  validate(): void {
    if (!this.userPassword) {
      throw new ValueObjectError('User-Password not valid');
    }
  }

  equals(object: ValueObject<string>): boolean {
    return this.valueOf() == object.valueOf();
  }
}
