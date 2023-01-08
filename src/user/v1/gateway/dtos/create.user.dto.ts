import { IsNumber, IsOptional, IsString } from 'class-validator';
import { UserRoleType } from '@/user/v1/domain/user/primitives/user.roles';
import { User } from '@/user/v1/domain/user/user.aggregate.root';
import { Role } from '@/shared/infrastructure/http-framework/shared/roles';

export class CreateUserDTO {
  @IsString()
  public firstname!: string;

  @IsString()
  public lastname!: string;

  @IsString()
  public username!: string;

  @IsString()
  public email!: string;

  @IsNumber()
  public age!: number;

  @IsString()
  @IsOptional()
  public role?: UserRoleType;

  @IsString()
  public phone!: string;

  @IsString()
  public password!: string;

  static toDomain(user: CreateUserDTO): User {
    return User.fromPrimitives({
      ...user,
      id: 0,
      createdAt: Date.now().toString(),
      updatedAt: Date.now().toString(),
      active: true,
      role: user.role || Role.STANDARD
    });
  }
}
