import { v4 as uuidv4, validate } from 'uuid';
import { ValueObjectError } from '@/shared/domain/errors/domain-errors/ValueObjectError';
import { ValueObject } from '@/shared/domain/interfaces/value.object';

export class Identifier implements ValueObject<string> {
  constructor(private value: string) {
    this.ensureUUID(value);
    this.value = value;
  }

  private ensureUUID(uuid: string): void {
    if (!validate(uuid)) {
      throw new ValueObjectError(`UUID Not valid: ${uuid}`);
    }
  }

  static random(): Identifier {
    return new Identifier(uuidv4());
  }

  valueOf(): string {
    return this.value;
  }

  fromPrimitive(value: string): ValueObject<string> {
    return new Identifier(value);
  }

  validate(): void {}

  equals(object: ValueObject<string>): boolean {
    return this.valueOf() == object.valueOf();
  }
}
