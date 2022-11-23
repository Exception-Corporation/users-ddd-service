import glob from 'glob';
import path from 'path';
import { IAutoFiles } from '@/shared/domain/interfaces/auto.files.interface';
import { importAll } from '@/shared/infrastructure/utils/import.all';

export class RequireContext implements IAutoFiles<any> {
  getFiles(directory: string, filters: Array<string> = []) {
    return importAll(
      glob.sync(directory).map(function (file) {
        return require(path.resolve(file));
      })
    ).filter((obj: any) => {
      if ('prototype' in obj) obj = new obj();

      return !filters.find((filter) => obj[filter] === undefined);
    });
  }
}
