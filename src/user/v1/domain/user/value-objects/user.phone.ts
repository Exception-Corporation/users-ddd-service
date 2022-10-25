import { ValueObject } from '@/shared/domain/interfaces/value.object';
import { ValueObjectError } from '@/shared/domain/errors/domain-errors/ValueObjectError';

export class UserPhone implements ValueObject<string> {
  constructor(private userPhone: string) {
    this.validate();
  }

  valueOf(): string {
    return this.userPhone;
  }

  fromPrimitive(value: string): ValueObject<string> {
    return new UserPhone(value);
  }

  validate(): void {
    /*if (this.userPhone) {
      throw new ValueObjectError('User-phone not valid');
    }*/
  }

  equals(object: ValueObject<string>): boolean {
    return this.valueOf() == object.valueOf();
  }
}
