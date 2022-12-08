import { AppContainer } from '@/shared/infrastructure/d-injection/container';

export function provide(type: any) {
  return (target: any) => {
    AppContainer.bind<typeof target>(type).to(target);
  };
}
