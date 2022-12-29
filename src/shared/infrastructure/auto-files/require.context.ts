export class RequireContext {
  static getFiles<S>(data: S, filters: Array<string> = []) {
    return ((<any>require)?.id ? this.importAll(data) : []).filter(
      (obj: any) => {
        try {
          if (!filters.length) return true;

          if (this._isClass(obj)) obj = new obj();

          return !filters.find((filter) => obj[filter] === undefined);
        } catch (_e: any) {
          return false;
        }
      }
    );
  }

  private static importAll(paths: any) {
    return paths
      .keys()
      .map(paths)
      .map((x: any) => {
        const [k]: any = Object.keys(x);
        return x[k];
      });
  }

  private static _isClass(definition: any) {
    return (
      typeof definition === 'function' &&
      /^class\s/.test(Function.prototype.toString.call(definition))
    );
  }
}
