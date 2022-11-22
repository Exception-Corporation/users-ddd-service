import { ValueObject } from '@/shared/domain/interfaces/value.object';
import { ValueObjectError } from '@/shared/domain/errors/domain-errors/ValueObjectError';

export class MailHtml implements ValueObject<string> {
  constructor(private mailHtml: string) {
    this.validate();
  }

  valueOf(): string {
    return this.mailHtml;
  }

  fromPrimitive(value: string): ValueObject<string> {
    return new MailHtml(value);
  }

  validate(): void {
    if (!this.mailHtml) {
      throw new ValueObjectError(`Mail-Html not valid: ${this.mailHtml}`);
    }
  }

  equals(object: ValueObject<string>): boolean {
    return this.valueOf() == object.valueOf();
  }
}
