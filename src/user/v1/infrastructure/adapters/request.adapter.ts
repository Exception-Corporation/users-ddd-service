import { injectable } from 'inversify';
import { validate } from 'class-validator';
import { IRequestAdapter } from '@/shared/domain/interfaces/request.adapter';
import { DTOPropertiesError } from '@/shared/domain/errors/domain-errors/DTOPropertiesError';

@injectable()
export class RequestAdapter implements IRequestAdapter {
  public async validateData<T extends object>(
    request: T,
    properties: Array<string> = []
  ): Promise<T> {
    if (!request) {
      throw new DTOPropertiesError(['user']);
    }

    if (!Object.keys(request)) {
      throw new DTOPropertiesError(properties);
    }
    const errors = await validate(request);

    if (errors.length) {
      throw new DTOPropertiesError(properties);
    }

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
