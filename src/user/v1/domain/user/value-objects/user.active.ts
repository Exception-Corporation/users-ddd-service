import { ValueObject } from '@/shared/domain/interfaces/value.object';
import { ValueObjectError } from '@/shared/domain/errors/domain-errors/ValueObjectError';

export class UserActive implements ValueObject<boolean> {
  constructor(private userActive: boolean) {
    this.validate();
  }

  valueOf(): boolean {
    return this.userActive;
  }

  fromPrimitive(value: boolean): ValueObject<boolean> {
    return new UserActive(value);
  }

  validate(): void {
    if (!this.userActive) {
      throw new ValueObjectError('User-Active not valid');
    }
  }

  equals(object: ValueObject<boolean>): boolean {
    return this.valueOf() == object.valueOf();
  }
}
