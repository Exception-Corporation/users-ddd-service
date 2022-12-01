export type ControllerParams = {
  path: string;
  http: 'post' | 'put' | 'patch' | 'delete' | 'get' | 'option';
};

export type ControllerClass = ControllerParams & {
  execute: () => any;
  middlewares: Array<any>;
};

export function Controller({ path, http }: ControllerParams) {
  return (target: Function) => {
    target.prototype.path = path;
    target.prototype.http = http;
    target.prototype.middlewares = target.prototype.middlewares || [];
  };
}
