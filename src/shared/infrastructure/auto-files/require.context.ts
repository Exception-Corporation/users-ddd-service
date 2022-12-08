import { IAutoFiles } from '@/shared/domain/auto-files/auto.files.interface';

declare const require: any;

export class RequireContext implements IAutoFiles<any> {
  getFiles<S>(data: S, filters: Array<string> = []) {
    return (require?.id ? this.importAll(data) : []).filter((obj: any) => {
      try {
        if (this._isClass(obj)) obj = new obj();

        return !filters.find((filter) => obj[filter] === undefined);
      } catch (_e: any) {
        return false;
      }
    });
  }

  private importAll(paths: any) {
    return paths
      .keys()
      .map(paths)
      .map((x: any) => {
        const [k]: any = Object.keys(x);
        return x[k];
      });
  }

  private _isClass(definition: any) {
    return (
      typeof definition === 'function' &&
      /^class\s/.test(Function.prototype.toString.call(definition))
    );
  }
}
