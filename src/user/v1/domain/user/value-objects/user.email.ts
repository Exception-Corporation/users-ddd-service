import { ValueObject } from '@/shared/domain/interfaces/value.object';
import { ValueObjectError } from '@/shared/domain/errors/domain-errors/ValueObjectError';

export class UserEmail implements ValueObject<string> {
  constructor(private userEmail: string) {
    this.validate();
  }

  valueOf(): string {
    return this.userEmail;
  }

  fromPrimitive(value: string): ValueObject<string> {
    return new UserEmail(value);
  }

  validate(): void {
    const emailRegex =
      /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
    if (!this.userEmail || !emailRegex.test(this.userEmail)) {
      throw new ValueObjectError('User-email not valid');
    }
  }

  equals(object: ValueObject<string>): boolean {
    return this.valueOf() == object.valueOf();
  }
}
