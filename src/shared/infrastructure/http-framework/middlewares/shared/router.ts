import { HttpMethods } from '@/shared/infrastructure/controller/decorators/controller';

type handler = (...args: Array<any>) => any;

export type Router = {
  method: HttpMethods;
  url: string;
  schema: {};
  middlewares: Array<handler>;
  handler: handler;
};
