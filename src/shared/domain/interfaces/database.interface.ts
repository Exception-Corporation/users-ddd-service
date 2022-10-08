export interface DatabaseConnection<T> {
  connect(): any;

  getConnection(): T;
}
