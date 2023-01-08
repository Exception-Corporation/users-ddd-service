import { interfaces } from 'inversify';
import {
  IDependencyContainer,
  Class,
  Scope,
  ToValue
} from '@/shared/domain/container/dependency.container';
import { AppContainer } from '@/shared/infrastructure/container/inversify/container';

export type BindingSyntax<T> = interfaces.BindingToSyntax<T>;
export type BindingInWhenOnSyntax<T> = interfaces.BindingInWhenOnSyntax<T>;

/*InversifyContainer is an implementation of the IDependencyContainer interface
 that uses Inversify as the dependency injection library */
export class InversifyContainer implements IDependencyContainer {
  /*We create a private static instance of InversifyContainer to implement
   the Singleton pattern .*/
  private static instance?: IDependencyContainer;

  // We create a private object to store the different scopes available in Inversify.
  private scopes: Record<Scope, keyof interfaces.BindingInSyntax<any>> = {
    request: 'inRequestScope',
    singleton: 'inSingletonScope',
    transient: 'inTransientScope'
  };

  // We create a private object to store the different binding options available in Inversify.
  private toValues: Record<
    ToValue,
    <T>(
      binding: BindingSyntax<T>,
      constructor: Class<T>,
      params: Array<any>
    ) => BindingInWhenOnSyntax<T>
  >;

  // We make the constructor private to implement the Singleton pattern.
  private constructor() {
    this.toValues = {
      to: <T>(binding: BindingSyntax<T>, Constructor: Class<T>) =>
        binding.to(Constructor),

      dynamic: <T>(
        binding: BindingSyntax<T>,
        Constructor: Class<T>,
        params: Array<any>
      ) => binding.toDynamicValue(this.mapParams(Constructor, params)),

      self: <T>(binding: BindingSyntax<T>) => binding.toSelf(),

      constant: <T>(
        binding: BindingSyntax<T>,
        Constructor: Class<T>,
        params: Array<any>
      ) =>
        binding.toConstantValue(
          new Constructor(...params)
        ) as BindingInWhenOnSyntax<T>,

      /* We need to cast the factory and provider functions to any to avoid TypeScript errors
        caused by the fact that we are using the "as any" type for the params parameter. */
      factory: (<T extends interfaces.Factory<T>>(
        binding: BindingSyntax<T>,
        Constructor: Class<T>,
        params: Array<any>
      ) => binding.toFactory(this.mapParams(Constructor, params))) as any,

      provider: (<T extends interfaces.Provider<T>>(
        binding: BindingSyntax<T>,
        Constructor: Class<T>,
        params: Array<any>
      ) => binding.toProvider(this.mapParams(Constructor, params))) as any
    };
  }

  // We create a public static method to get the singleton instance of InversifyContainer.
  static getInstance(): IDependencyContainer {
    if (this.instance) return this.instance;

    this.instance = new InversifyContainer();
    return this.instance;
  }

  /**
   * The bind method is used to register a dependency with Inversify and associate it with an implementation.
   *
   * @param serviceIdentifier - A unique identifier for the dependency being registered.
   * @param toValue - The value that the dependency will be bound to. This can be a class, factory function, or constant value.
   * @param constructor - The class constructor for the dependency being registered. This is only used if toValue is set to "dynamic" or "factory".
   * @param params - An array of parameters to pass to the constructor when creating an instance of the dependency. This is only used if toValue is set to "dynamic" or "factory".
   * @param scope - The scope of the dependency. This determines the lifetime of the dependency.
   * @returns A BindingInWhenOnSyntax object that can be used to further configure the binding.
   */
  bind<T>(
    serviceIdentifier: string | symbol,
    toValue: ToValue,
    constructor: Class<T>,
    params: Array<any>,
    scope?: Scope
  ): BindingInWhenOnSyntax<T> {
    // We use the toValues object to get the correct binding function based on the value of toValue.
    let binding = this.toValues[toValue](
      AppContainer.bind<T>(serviceIdentifier), // We use the AppContainer from Inversify to create a new binding.
      constructor,
      params
    );

    if (scope) binding[this.scopes[scope]]();

    return binding;
  }

  /**
   * The get method is used to get a dependency that has been registered with Inversify.
   *
   * @param serviceIdentifier - The unique identifier for the dependency being retrieved.
   * @returns The instance of the dependency being retrieved.
   */
  get<T>(serviceIdentifier: string | symbol): T {
    return AppContainer.get<T>(serviceIdentifier);
  }

  /**
   * The getAll method is used to get all the instances of a dependency that has been registered with Inversify.
   *
   * @param serviceIdentifier - The unique identifier for the dependency being retrieved.
   * @returns An array of instances of the dependency being retrieved.
   */
  getAll<T>(serviceIdentifier: string | symbol): Array<T> {
    return AppContainer.getAll<T>(serviceIdentifier);
  }

  /**
   * The resolve method is used to get an instance of a class, with its dependencies injected.
   *
   * @param constructor - The class constructor for the class being resolved.
   * @returns An instance of the class being resolved, with its dependencies injected.
   */
  resolve<T>(constructor: Class<T>): T {
    return AppContainer.resolve<T>(constructor);
  }

  /**
   * Maps the given params to the correct values using the given context.
   *
   * @param constructor The class constructor to be called with the mapped params.
   * @param params The array of params to be mapped.
   *
   * @returns A function that receives a context and returns an instance of the given constructor with the mapped params.
   */
  private mapParams<T>(constructor: Class<T>, params: Array<any>) {
    // Return a function that maps the params and returns a new instance of the constructor with the mapped params.
    return (context: interfaces.Context) =>
      new constructor(
        ...params.map((param) =>
          typeof param == 'symbol' ? context.container.get(param) : param
        )
      );
  }
}
