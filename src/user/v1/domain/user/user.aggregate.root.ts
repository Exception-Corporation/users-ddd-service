import { AggregateRoot } from '@/shared/domain/class/aggregate.root';
import { UserAge } from '@/user/v1/domain/user/value-objects/user.age';
import { UserCreatedAt } from '@/user/v1/domain/user/value-objects/user.createdAt';
import { UserId } from '@/user/v1/domain/user/value-objects/user.id';
import { UserFirstName } from '@/user/v1/domain/user/value-objects/user.first.name';
import { UserLastName } from '@/user/v1/domain/user/value-objects/user.last.name';
import { UserPassword } from '@/user/v1/domain/user/value-objects/user.password';
import { UserUpdatedAt } from '@/user/v1/domain/user/value-objects/user.updatedAt';
import { UserUsername } from '@/user/v1/domain/user/value-objects/user.username';
import { UserEmail } from '@/user/v1/domain/user/value-objects/user.email';
import { UserActive } from '@/user/v1/domain/user/value-objects/user.active';
import { UserRole } from '@/user/v1/domain/user/value-objects/user.role';
import { UserPhone } from '@/user/v1/domain/user/value-objects/user.phone';

export type UserPrimitive<T = string> = Omit<
  ReturnType<User['toPrimitives']>,
  'createdAt' | 'updatedAt'
> & {
  createdAt: T;
  updatedAt: T;
};

export class User extends AggregateRoot {
  constructor(
    private id: UserId,
    private firstname: UserFirstName,
    private lastname: UserLastName,
    private username: UserUsername,
    private phone: UserPhone,
    private email: UserEmail,
    private password: UserPassword,
    private role: UserRole,
    private age: UserAge,
    private active: UserActive,
    private createdAt: UserCreatedAt,
    private updatedAt: UserUpdatedAt
  ) {
    super();
  }

  static fromPrimitives(user: UserPrimitive<Date | string>) {
    return new User(
      new UserId(user.id),
      new UserFirstName(user.firstname),
      new UserLastName(user.lastname),
      new UserUsername(user.username),
      new UserPhone(user.phone),
      new UserEmail(user.email),
      new UserPassword(user.password),
      new UserRole(user.role),
      new UserAge(user.age),
      new UserActive(user.active),
      new UserCreatedAt(user.createdAt.toString()),
      new UserUpdatedAt(user.updatedAt.toString())
    );
  }

  toPrimitives() {
    return {
      id: this.id.valueOf(),
      firstname: this.firstname.valueOf(),
      lastname: this.lastname.valueOf(),
      username: this.username.valueOf(),
      phone: this.phone.valueOf(),
      email: this.email.valueOf(),
      password: this.password.valueOf(),
      role: this.role.valueOf(),
      age: this.age.valueOf(),
      active: this.active.valueOf(),
      createdAt: this.createdAt.valueOf(),
      updatedAt: this.updatedAt.valueOf()
    };
  }

  getUserId(): UserId {
    return this.id;
  }

  getRole(): UserRole {
    return this.role;
  }

  getPhone(): UserPhone {
    return this.phone;
  }

  getFirstName(): UserFirstName {
    return this.firstname;
  }

  getLastName(): UserLastName {
    return this.lastname;
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

  getEmail(): UserEmail {
    return this.email;
  }

  getActive(): UserActive {
    return this.active;
  }
}
