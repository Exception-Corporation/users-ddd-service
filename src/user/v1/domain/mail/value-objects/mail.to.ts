import { ValueObject } from '@/shared/domain/interfaces/value.object';
import { ValueObjectError } from '@/shared/domain/errors/domain-errors/ValueObjectError';

export class MailTo implements ValueObject<string> {
  constructor(private mailTo: string) {
    this.validate();
  }

  valueOf(): string {
    return this.mailTo;
  }

  fromPrimitive(value: string): ValueObject<string> {
    return new MailTo(value);
  }

  validate(): void {
    const emailRegex =
      /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
    if (!this.mailTo || !emailRegex.test(this.mailTo)) {
      throw new ValueObjectError(`Mail-to not valid: ${this.mailTo}`);
    }
  }

  equals(object: ValueObject<string>): boolean {
    return this.valueOf() == object.valueOf();
  }
}
