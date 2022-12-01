import glob from 'glob';
import path from 'path';
import { IAutoFiles } from '@/shared/domain/auto-files/auto.files.interface';
import { importAll } from '@/shared/infrastructure/utils/import.all';

export class RequireContext implements IAutoFiles<any> {
  getFiles(directory: string, filters: Array<string> = []) {
    return importAll(
      glob.sync(directory).map(function (file) {
        return require(path.resolve(file));
      })
    ).filter((obj: any) => {
      try {
        if (this._isClass(obj)) obj = new obj();

        return !filters.find((filter) => obj[filter] === undefined);
      } catch (_e: any) {
        return false;
      }
    });
  }

  private _isClass(definition: any) {
    return (
      typeof definition === 'function' &&
      /^class\s/.test(Function.prototype.toString.call(definition))
    );
  }
}
