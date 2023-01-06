import { injectable } from '@container';
import { ClassType, transformAndValidate } from 'class-transformer-validator';
import { IRequestAdapter } from '@/shared/domain/interfaces/request.adapter';
import { DTOPropertiesError } from '@/shared/domain/errors/domain-errors/DTOPropertiesError';

@injectable()
export class RequestAdapter implements IRequestAdapter<ClassType<unknown>> {
  public async validateData(
    request: ClassType<unknown>,
    properties: Array<string> = [],
    classType?: ClassType<any>
  ): Promise<ClassType<unknown>> {
    if (!request) {
      throw new DTOPropertiesError(['user']);
    }

    if (!Object.keys(request)) {
      throw new DTOPropertiesError(properties);
    }

    if (classType)
      await transformAndValidate(classType, request).catch((error) => {
        throw new DTOPropertiesError([
          error.toString().replace(/\n/g, '').trim()
        ]);
      });

    const invalidProperties: Array<string> = [];

    for (const property of properties) {
      if (property.includes('OR')) {
        const propertiesSplit = property.replace('OR:', '').split(',');

        let count = 0;

        propertiesSplit.forEach((propertyTo) => {
          if (!(request as any)[propertyTo]) {
            count++;
          }
        });

        if (propertiesSplit.length == count)
          invalidProperties.push(...propertiesSplit);
        continue;
      }

      if (!(request as any)[property]) invalidProperties.push(property);
    }

    if (invalidProperties.length)
      throw new DTOPropertiesError(invalidProperties);

    return request;
  }
}
