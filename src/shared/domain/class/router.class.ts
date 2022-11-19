import { Logger } from '@/shared/domain/logger';

export abstract class RouterC<T> {
  constructor(protected logger: Logger) {}
  abstract getRoutes(): T;
}
