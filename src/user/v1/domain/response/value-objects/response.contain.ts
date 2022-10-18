import { ValueObject } from '@/shared/domain/interfaces/value.object';
import { ValueObjectError } from '@/shared/domain/errors/domain-errors/ValueObjectError';

export class ResponseContain implements ValueObject<object> {
  constructor(private contain: object) {
    this.validate();
  }

  valueOf(): object {
    return this.contain;
  }

  fromPrimitive(value: object): ValueObject<object> {
    return new ResponseContain(value);
  }

  validate(): void {
    if (!this.contain || !Object.keys(this.contain || {})) {
      throw new ValueObjectError('Response-contain not valid');
    }
  }

  equals(object: ValueObject<object>): boolean {
    return this.valueOf() == object.valueOf();
  }
}
