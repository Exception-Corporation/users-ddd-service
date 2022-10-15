import { IsString } from "class-validator";

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
  public password!: string;
}
