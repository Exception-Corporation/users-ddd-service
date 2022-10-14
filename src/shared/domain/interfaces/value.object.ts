export interface ValueObject<T> {
  valueOf(): T
  fromPrimitive(value: T): ValueObject<T>
  validate(): void
  equals(object: ValueObject<T>): boolean
}
