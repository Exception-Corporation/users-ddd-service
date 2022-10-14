import { AggregateRoot } from "@/shared/domain/class/aggregate.root";
import { UserAge } from "@/user/v1/domain/user/value-objects/user.age";
import { UserCreatedAt } from "@/user/v1/domain/user/value-objects/user.createdAt";
import { UserId } from "@/user/v1/domain/user/value-objects/user.id";
import { UserFirstName } from "@/user/v1/domain/user/value-objects/user.first.name";
import { UserLastName } from "@/user/v1/domain/user/value-objects/user.last.name";
import { UserPassword } from "@/user/v1/domain/user/value-objects/user.password";
import { UserUpdatedAt } from "@/user/v1/domain/user/value-objects/user.updatedAt";
import { UserUsername } from "@/user/v1/domain/user/value-objects/user.username";

export type UserPrimitive = ReturnType<User["toPrimitives"]>;

export class User extends AggregateRoot {
  constructor(
    private userId: UserId,
    private firstName: UserFirstName,
    private lastName: UserLastName,
    private username: UserUsername,
    private password: UserPassword,
    private age: UserAge,
    private createdAt: UserCreatedAt,
    private updatedAt: UserUpdatedAt
  ) {
    super();
  }

  static fromPrimitives(user: UserPrimitive) {
    return new User(
      new UserId(user.userId),
      new UserFirstName(user.firstName),
      new UserLastName(user.lastName),
      new UserUsername(user.username),
      new UserPassword(user.password),
      new UserAge(user.age),
      new UserCreatedAt(user.createdAt),
      new UserUpdatedAt(user.updatedAt)
    );
  }

  toPrimitives() {
    return {
      userId: this.userId.valueOf(),
      firstName: this.firstName.valueOf(),
      lastName: this.lastName.valueOf(),
      username: this.username.valueOf(),
      password: this.password.valueOf(),
      age: this.age.valueOf(),
      createdAt: this.createdAt.valueOf(),
      updatedAt: this.updatedAt.valueOf(),
    };
  }

  getUserId(): UserId {
    return this.userId;
  }

  getFirstName(): UserFirstName {
    return this.firstName;
  }

  getLastName(): UserLastName {
    return this.lastName;
  }

  getUsername(): UserUsername {
    return this.username;
  }

  getPassword(): UserPassword {
    return this.password;
  }

  getAge(): UserAge {
    return this.age;
  }
}
