import { IsString, IsOptional } from 'class-validator';
import { UserEmail } from '@/user/v1/domain/user/value-objects/user.email';
import { UserUsername } from '@/user/v1/domain/user/value-objects/user.username';
import { UserPassword } from '@/user/v1/domain/user/value-objects/user.password';

export class LoginUserDTO {
  @IsString()
  @IsOptional()
  public email?: string;

  @IsString()
  @IsOptional()
  public username?: string;

  @IsString()
  public password!: string;

  static toDomain({ email, username, password }: LoginUserDTO): {
    email: UserEmail | undefined;
    username: UserUsername | undefined;
    password: UserPassword;
  } {
    return {
      email: email ? new UserEmail(email) : undefined,
      username: username ? new UserUsername(username) : undefined,
      password: new UserPassword(password)
    };
  }
}
