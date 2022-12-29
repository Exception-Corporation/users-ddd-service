import { SchemaType } from '@/shared/infrastructure/http-framework/shared/schema';

export function FastifySchema(schema: SchemaType = {}) {
  return (target: Function) => {
    schema.body = transformBody(schema.body);

    schema.headers = transformBody(schema.headers);

    schema.params = transformBody(schema.params);

    schema.querystring = transformBody(schema.querystring);

    schema.response = transformResponse(schema.response);

    target.prototype.schema = schema;
  };
}

function transformBody(body: any) {
  if (!body) return;

  const result: any = {};

  for (const property in body) {
    if (validation(body[property])) continue;

    if (typeof body[property] == 'object') {
      if (Array.isArray(body[property])) {
        const data = body[property][0];
        result[property] = {
          type: 'array',
          items:
            typeof data == 'object' && !validation(data)
              ? { type: 'object', properties: transformBody(data) }
              : { type: typeof data }
        };

        continue;
      }

      result[property] = {
        type: 'object',
        properties: transformBody(body[property])
      };

      continue;
    }

    result[property] = {
      type: typeof body[property]
    };
  }

  return result;
}

function transformResponse(response: any) {
  if (!response) return;

  const result: any = {};

  for (const status in response) {
    const schema = response[status];
    result[status] = {
      description:
        Number(status) >= 200 && Number(status) <= 204
          ? 'Successful response'
          : 'Failed response',
      type: typeof schema
    };

    if (typeof schema == 'object' && !validation(schema)) {
      result[status]['properties'] = transformBody(schema);
    }
  }

  return result;
}

const validation = (data: any) => [null, undefined].includes(data);
