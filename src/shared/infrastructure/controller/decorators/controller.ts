export type ControllerParams = {
  path: string;
  http: 'post' | 'put' | 'patch' | 'delete' | 'get' | 'options';
};

export type Context = {
  body: any;
  params: any;
  query: any;
  headers: any;
  cookies: any;
  path: string;
};

export type ControllerResponse = { status: number; response: any };

export type ControllerClass = ControllerParams & {
  execute: (context: Context) => Promise<ControllerResponse>;
  middlewares: Array<any>;
};

export function Controller({ path, http }: ControllerParams) {
  return (target: Function) => {
    target.prototype.path = path;
    target.prototype.http = http;
    target.prototype.middlewares = target.prototype.middlewares || [];
  };
}
