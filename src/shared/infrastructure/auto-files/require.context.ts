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
      let objTo = obj;
      if ('prototype' in obj) objTo = new obj();

      let validate = true;

      filters.forEach((filter) => {
        if (objTo[filter] === undefined) validate = false;
      });

      return validate;
    });
  }
}
