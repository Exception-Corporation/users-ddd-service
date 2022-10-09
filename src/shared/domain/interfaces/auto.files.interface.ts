export interface IAutoFiles<T> {
  getFiles(directory: string, useSubdirectories: boolean, regExp: RegExp): T;
}
