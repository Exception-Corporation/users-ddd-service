import { injectable } from '@container';
import { Logger } from '@/shared/domain/logger';

@injectable()
export abstract class RouterC<T> {
  constructor(protected logger: Logger) {}
  abstract getRoutes(): T;
}
