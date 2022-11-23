import { ValueObject } from '@/shared/domain/interfaces/value.object';
import { ValueObjectError } from '@/shared/domain/errors/domain-errors/ValueObjectError';

// value object
export class EventId implements ValueObject<string> {
  constructor(private value: string) {
    this.validate();
  }

  fromPrimitive(value: string): ValueObject<string> {
    this.validate();
    return new EventId(value);
  }

  validate(): void {
    if (!this.value)
      throw new ValueObjectError(`EVENT_ID_NOT_VALID: ${this.value}`);
  }

  valueOf(): any {
    return this.value.valueOf();
  }

  equals(object: ValueObject<string>): boolean {
    return object == this;
  }
}
