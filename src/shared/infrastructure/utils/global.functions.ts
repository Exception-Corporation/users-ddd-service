import { InternalError } from '@/shared/domain/errors/domain-errors/InternalError';

export class GlobalFunctions {
  private constructor() {}

  static getNewParams<T>(
    obj: any,
    properties: Array<keyof T>,
    validateProperties?: Array<keyof T>
  ) {
    const newObj: any = {};

    const realProperties: Array<string> = Object.keys(
      validateProperties
        ? GlobalFunctions.cleanAllParams<T>(obj, validateProperties)
        : obj
    ); //{id: 2, name: "E"} => ["id","name"]

    realProperties.forEach((property: string) => {
      if (!properties.find((prop) => prop == property)) {
        const value = obj[property];
        newObj[property] =
          typeof value == 'object' ? Object.assign(obj[property]) : value;
      }
    });

    return newObj;
  }

  private static cleanAllParams<T>(
    obj: any,
    validateProperties: Array<keyof T>
  ): any {
    validateProperties.forEach((property) => {
      obj[property] = obj[property] || 0;
    });

    return obj;
  }

  static safeVal(data: boolean, firstValue: any, secondValue: any) {
    return data ? firstValue : secondValue;
  }

  static verifyDuplicationValues<T>(
    array: Array<T>,
    properties: Array<keyof T>
  ) {
    const newArray = array.map((obj) => {
      const newObj: any = {};

      properties.forEach((property) => {
        newObj[property] = obj[property];
      });

      return JSON.stringify(newObj);
    });

    const arrayToValidate = [...new Set([...newArray])];

    if (arrayToValidate.length !== newArray.length)
      throw new InternalError(
        'Duplicate controllers with the http and path values.'
      );
  }
}
