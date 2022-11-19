export type ControllerParams = {
  path: string;
  http: 'post' | 'put' | 'patch' | 'delete' | 'get' | 'option';
  roles?: Array<string>;
};

export function Controller({ path, http, roles }: ControllerParams) {
  return (target: Function) => {
    target.prototype.path = path;
    target.prototype.http = http;
    target.prototype.roles = roles || [];
  };
}
