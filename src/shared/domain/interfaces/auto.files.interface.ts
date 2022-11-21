export interface IAutoFiles<T> {
  getFiles(directory: string, regExp?: RegExp): T;
}
