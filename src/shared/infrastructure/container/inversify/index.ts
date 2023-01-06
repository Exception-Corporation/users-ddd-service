import { interfaces } from 'inversify';
import {
  IDependencyContainer,
  Class,
  Scope,
  ToValue
} from '@/shared/domain/container/dependency.container';
import { AppContainer } from '@/shared/infrastructure/container/inversify/container';

type BindingSyntax<T> = interfaces.BindingToSyntax<T>;
type BindingInWhenOnSyntax<T> = interfaces.BindingInWhenOnSyntax<T>;

export class InversifyContainer implements IDependencyContainer {
  private static instance?: IDependencyContainer;
  private scopes: Record<Scope, keyof interfaces.BindingInSyntax<any>>;
  private toValues: Record<
    ToValue,
    <T>(
      binding: BindingSyntax<T>,
      constructor: Class<T>,
      params: Array<any>
    ) => BindingInWhenOnSyntax<T>
  >;

  private constructor() {
    this.scopes = {
      request: 'inRequestScope',
      singleton: 'inSingletonScope',
      transient: 'inTransientScope'
    };

    this.toValues = {
      to: <T>(binding: BindingSyntax<T>, Constructor: Class<T>) =>
        binding.to(Constructor),

      dynamic: <T>(
        binding: BindingSyntax<T>,
        Constructor: Class<T>,
        params: Array<any>
      ) =>
        binding.toDynamicValue((context: interfaces.Context) => {
          params = params.map((param) =>
            typeof param == 'symbol' ? context.container.get(param) : param
          );

          return new Constructor(...params);
        }),

      self: <T>(binding: BindingSyntax<T>) => binding.toSelf(),

      constant: <T>(
        binding: BindingSyntax<T>,
        Constructor: Class<T>,
        params: Array<any>
      ) =>
        binding.toConstantValue(
          new Constructor(...params)
        ) as BindingInWhenOnSyntax<T>,

      factory: (<T extends interfaces.Factory<T>>(
        binding: BindingSyntax<T>,
        Constructor: Class<T>,
        params: Array<any>
      ) =>
        binding.toFactory((context: interfaces.Context) => {
          params = params.map((param) =>
            typeof param == 'symbol' ? context.container.get(param) : param
          );

          return new Constructor(...params);
        })) as any,

      provider: (<T extends interfaces.Provider<T>>(
        binding: BindingSyntax<T>,
        Constructor: Class<T>,
        params: Array<any>
      ) =>
        binding.toProvider((context: interfaces.Context) => {
          params = params.map((param) =>
            typeof param == 'symbol' ? context.container.get(param) : param
          );

          return new Constructor(...params);
        })) as any
    };
  }

  static getInstance() {
    if (this.instance) return this.instance;

    this.instance = new InversifyContainer();
    return this.instance;
  }

  bind<T>(
    serviceIdentifier: string | symbol,
    toValue: ToValue,
    constructor: Class<T>,
    params: Array<any>,
    scope?: Scope
  ): BindingInWhenOnSyntax<T> {
    let binding = this.toValues[toValue](
      AppContainer.bind<T>(serviceIdentifier),
      constructor,
      params
    );

    if (scope) binding[this.scopes[scope]]();

    return binding;
  }

  get<T>(serviceIdentifier: string | symbol): T {
    return AppContainer.get<T>(serviceIdentifier);
  }

  getAll<T>(serviceIdentifier: string | symbol): Array<T> {
    return AppContainer.getAll<T>(serviceIdentifier);
  }

  resolve<T>(constructor: Class<T>): T {
    return AppContainer.resolve<T>(constructor);
  }
}
