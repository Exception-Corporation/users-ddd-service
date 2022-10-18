import { IsString } from 'class-validator';
import { UserRoleType } from '@/user/v1/domain/user/primitives/user.roles';

export class CreateUserDTO {
  @IsString()
  public firstname!: string;

  @IsString()
  public lastname!: string;

  @IsString()
  public username!: string;

  @IsString()
  public email!: string;

  @IsString()
  public age!: number;

  @IsString()
  public role!: UserRoleType;

  @IsString()
  public password!: string;
}
