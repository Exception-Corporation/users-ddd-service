import { IsString } from "class-validator";

export class LoginUserDTO {
  @IsString()
  public email!: string;

  @IsString()
  public password!: string;
}
