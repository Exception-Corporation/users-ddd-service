import { IsString, IsOptional } from "class-validator";

export class LoginUserDTO {
  @IsString()
  @IsOptional()
  public email?: string;

  @IsString()
  @IsOptional()
  public username?: string;

  @IsString()
  public password!: string;
}
