export const importAll = (paths: any) =>
  paths.map((x: any) => {
    const [k]: any = Object.keys(x);
    return x[k];
  });
