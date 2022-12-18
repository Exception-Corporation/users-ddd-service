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

  /**
   * Verifies that all elements in the given array have unique values for the specified properties.
   * Throws an error if there are duplicate values.
   *
   * @param array The array to check for duplicate values.
   * @param properties The properties to check for duplicate values.
   */
  static verifyDuplicateValues<T>(array: T[], properties: (keyof T)[]) {
    const values = array.map((obj) => {
      const value: any = {};
      properties.forEach((property) => {
        value[property] = obj[property];
      });

      return JSON.stringify(value);
    });

    if (new Set(values).size !== values.length) {
      throw new InternalError(
        `Duplicate objects in the array with this values: [${properties.join(
          ','
        )}]`
      );
    }
  }
}
