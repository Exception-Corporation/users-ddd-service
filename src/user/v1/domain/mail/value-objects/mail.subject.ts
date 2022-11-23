import { ValueObject } from '@/shared/domain/interfaces/value.object';
import { ValueObjectError } from '@/shared/domain/errors/domain-errors/ValueObjectError';

export class MailSubject implements ValueObject<string> {
  constructor(private mailSubject: string) {
    this.validate();
  }

  valueOf(): string {
    return this.mailSubject;
  }

  fromPrimitive(value: string): ValueObject<string> {
    return new MailSubject(value);
  }

  validate(): void {
    if (!this.mailSubject) {
      throw new ValueObjectError(`Mail-subject not valid: ${this.mailSubject}`);
    }
  }

  equals(object: ValueObject<string>): boolean {
    return this.valueOf() == object.valueOf();
  }
}
