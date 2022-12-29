import { FastifySchema } from '@/shared/infrastructure/http-framework/fastify/decorators/schema.decorator';

export type SchemaType = Partial<{
  description: string;
  tags: Array<string>;
  summary: string;
  headers: { [key: string]: any };
  params: { [key: string]: any };
  querystring: { [key: string]: any };
  body: { [key: string]: any };
  response: { [key: number]: any };
}>;

export const schema = FastifySchema;
