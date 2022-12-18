import { IsNumber, IsOptional, IsString } from 'class-validator';
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

  @IsNumber()
  public age!: number;

  @IsString()
  @IsOptional()
  public role?: UserRoleType;

  @IsString()
  public phone!: string;

  @IsString()
  public password!: string;
}
