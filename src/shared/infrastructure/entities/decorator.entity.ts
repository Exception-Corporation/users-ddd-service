export function EntityModel() {
  return (target: Function) => {
    target.prototype.entityModel = true;
  };
}
