import { container } from '@container';

export function provide(type: any) {
  return (target: any) => {
    container.bind<typeof target>(type, 'to', target, []);
  };
}
