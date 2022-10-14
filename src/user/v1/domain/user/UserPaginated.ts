import { User } from "@/user/v1/domain/user/user.aggregate.root";
import { Entity } from "@/shared/domain/class/entity";

export type UserPaginatedPrimitives = ReturnType<UserPaginated["toPrimitives"]>;

export class UserPaginated extends Entity {
  constructor(
    private Users: Array<User>,
    private pageSize: number,
    private page: number,
    private count: number
  ) {
    super();
  }

  toPrimitives() {
    return {
      Users: this.Users,
      pageSize: this.pageSize,
      page: this.page,
      count: this.count,
    };
  }

  static fromPrimitives(p: UserPaginatedPrimitives) {
    return new UserPaginated(p.Users, p.pageSize, p.page, p.count);
  }
}
