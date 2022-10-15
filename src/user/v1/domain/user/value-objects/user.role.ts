import { ValueObject } from "@/shared/domain/interfaces/value.object";
import { ValueObjectError } from "@/shared/domain/errors/domain-errors/ValueObjectError";
import { UserRoleType } from "@/user/v1/domain/user/primitives/user.roles";

export class UserRole implements ValueObject<UserRoleType> {
  constructor(private userRole: UserRoleType) {
    this.validate();
  }

  valueOf(): UserRoleType {
    return this.userRole;
  }

  fromPrimitive(value: UserRoleType): ValueObject<UserRoleType> {
    return new UserRole(value);
  }

  validate(): void {
    const roles: Array<UserRoleType> = ["root", "standard", "visitor"];

    if (!roles.includes(this.userRole)) {
      throw new ValueObjectError("User-role not valid");
    }
  }

  equals(object: ValueObject<UserRoleType>): boolean {
    return this.valueOf() == object.valueOf();
  }
}
