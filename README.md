## STOP POSSIBLE POSTGRES INSTANCE (MACOS)

- brew services stop postgresql

## COMMAND TO INITIALIZE TYPEORM WITH POSTGRESQL

- npx typeorm init --database postgres --express

## USED COMMANDS

- yarn db:migration:generate migrations/initalUserTable
- db:migrate

# Challenge

![Image text](https://github.com/IrlandaCV/irlanda_castillo_vega_SkydropXNodeJS/blob/main/src/shared/infrastructure/layouts/workflow.png?raw=true)

## 💻 I'm a dev, how do I get started?

Prerequisites:

- [Node.js](https://nodejs.org/es/download): version v16.14.0
- [TypeScript](https://www.typescriptlang.org):
- [Yarn](https://www.yarnpkg.com/): version 1.22.17
- [Docker](https://docs.docker.com/get-docker/): version 20.10.8
- [Docker-compose](https://docs.docker.com/compose/install/): version 1.29.2

## ENDPOINTS

### Import the postman json

- [GET] `http://localhost:4000/api/v1/users/getAll` Get all the users
- [GET] `http://localhost:4000/api/v1/users/get/:id` Get one user by id
- [POST] `http://localhost:4000/api/v1/users/` Create new normal user
- [POST] `http://localhost:4000/api/v1/users/login` Get a token to authenticate in other services
- [POST] `http://localhost:4000/api/v1/users/login` Get a token to authenticate in other services
- [PUT] `http://localhost:4000/api/v1/users/update/:id` Update a user by id
- [DELETE] `http://localhost:4000/api/v1/users/delete/:id` Delete a user by id

Now:

# Create a .env file with the .env.example text

# Steps to follow in sequential order

```bash
git clone git@github.com:IrlandaCV/irlanda_castillo_vega_SkydropXNodeJS.git
cd irlanda_castillo_vega_SkydropXNodeJS
yarn
yarn containers:up # run the docker-compose
yarn containers:down # remove the containers
yarn yarn prod #compile typescript to javascript and run the api in production mode
yarn dev #run the api in development mode with nodemon
```

You are now good ready to go!! 👯

### Docker

We use Docker as a utility tool, mainly for running a PostgresDB, which is the Database that we have deploy in Postgresdb atlas. In the `docker-compose.yml` you have three services:

- `postgres-test`: A Postgres database that we use for starting the API in development mode and running the integration tests locally.
- `postgres`: A Postgres database that we use for starting the API in production mode.
- `pgadmin`: A system managment to use the UI with postgres.
- `redis`: A cache database that we use for starting the API in production mode.
- `redis-commander`: A system managment to use the UI with redis.
- `rabbitmq`: Messaging service for an event-driven architecture.

### Project management

- [Challenge](http://localhost:4000)
- [Github repo](https://github.com/IrlandaCV/irlanda_castillo_vega_SkydropXNodeJS)
- [Github Actions](https://github.com/IrlandaCV/irlanda_castillo_vega_SkydropXNodeJS/actions)
- TODO: Software Architecture
- Clean Architecture
- Hexagonal Architecture
- Onion Architecture
- Object Oriented
- DDD: Domain Driven Design
- TODO: PostgresDB

## 🛠 Which technologies are you using?

- Node
  - Validations with [Class Validator & Class Transformer]
  - Mainly used as dependency injection container
- TypeScript

## 🏘 How is the code organized?

The architecture follows the principles from Hexagonal Architecture, and the final implementation is inspired by [this](https://github.com/CodelyTV/php-ddd-example) and [this](https://github.com/CodelyTV/typescript-ddd-skeleton) repositories from [CodelyTV](https://codely.tv/).

All the main code of the application lives under `src`

### `labels/shared or any module`

Under this directory lives all the main application. This root directory contains all the modules of the app, and inside of each module you can find the classic division `domain/application/infrastructure`.

- **Domain**: All the classes needed for modeling the business.
- **Application** (AKA Application) (Use-Cases): These are specific use cases which orchestrates several domain elements to perform its job.
- **Infrastructure**: All the elements that are coupled to a certain Database/Library/Framework.

For example:

```
TODO: place a simple tree when the project has evolved
```

### 🕴 Dependency Injection, Dependency Inversion

Instead of depending on a certain implementation, we depend on an abstraction (an interface). This allows us to create a more decoupled architecture and facilitates testing.

It's the **D** from the [SOLID](https://en.wikipedia.org/wiki/SOLID) principles.

You can read more about dependency inversion [here](https://en.wikipedia.org/wiki/Dependency_inversion_principle).

- Do not import third-parties or side effect methods into the domain/use cases layer
- Instead, create an interface that represent that interaction

### Dependency injection container

For wiring up all the dependencies, we are using the native NodeJs dependency container. This is the only thing that we are coupled to, specially from the application layer.

A special thing that we have to take into account, is when injecting interfaces.

The interfaces are a compile-time thing of Typescript, so when we need to inject a certain implementation we need to specify an identifier for that interface with a token.

```typescript
interface AccountRepository {
  save(account: Account): Promise<void>;
}
```

## ✅ Tests

- We are using [Jest](https://jestjs.io/) and [supertest](https://github.com/visionmedia/supertest) for acceptance tests.

### CI/CD

- The CI and CD are in Github Actions
- We run the precommit script before each commit using Husky.
- The CI runs for both acceptance/unitary and integration tests with a real database.
- After all tests passed, then the API is re-deployed

## 📲 Contact

The project was mainly developed by [Edgar Castillo Vega](vayne.edgar271@gmail.com)
