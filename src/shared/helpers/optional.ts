export class Optional<T> {
  private readonly value: T | null;

  private constructor(value: T | null) {
    this.value = value;
  }

  static of<T>(value: T): Optional<T> {
    if (value === null || value === undefined) {
      throw new Error('Cannot create Optional with a null or undefined value');
    }
    return new Optional(value);
  }

  static ofNullable<T>(value: T | null | undefined): Optional<T> {
    return new Optional(value ?? null);
  }

  static empty<T>(): Optional<T> {
    return new Optional<T>(null);
  }

  isPresent(): boolean {
    return this.value !== null;
  }

  isEmpty(): boolean {
    return this.value === null;
  }

  get(): T {
    if (!this.isPresent()) {
      throw new Error('No value present');
    }
    return this.value as T;
  }

  orElse(defaultValue: T): T {
    return this.isPresent() ? (this.value as T) : defaultValue;
  }

  ifPresent(callback: (value: T) => void): void {
    if (this.isPresent()) {
      callback(this.value as T);
    }
  }

  ifEmpty(callback: () => void): void {
    if (!this.isPresent()) {
      callback();
    }
  }
}
