export interface IAutoFiles<T> {
  getFiles(directory: string, filters?: Array<string>): T;
}
