import { Request, Response } from 'express';
import { BaseController } from '@/shared/infrastructure/controller/base.controller';
import { CreateUserDTO } from '@/user/v1/infrastructure/dtos/create.user.dto';
import { UserRepository } from '@/user/v1/infrastructure/repositories';
import { UserId } from '@/user/v1/domain/user/value-objects/user.id';
import { User, UserPrimitive } from '@/user/v1/domain/user/user.aggregate.root';
import { DTOPropertiesError } from '@/shared/domain/errors/domain-errors/DTOPropertiesError';
import { UserPassword } from '@/user/v1/domain/user/value-objects/user.password';
import { UpdateUserUseCase } from '@/user/v1/application/update-user/use.case';
import { FindUserUseCase } from '@/user/v1/application/find-user-by/use.case';

export class UserUpdateController extends BaseController {
  public http = 'put';
  public path: string;
  public roles: Array<string>; //Auth

  constructor() {
    super();
    this.path = '/update/:id';
    this.roles = ['standard', 'root'];
  }

  async execute(req: Request, res: Response) {
    const id = Number(req.params.id);

    const userDTO = req.body.user;

    try {
      if (!userDTO) throw new DTOPropertiesError(['user']);

      const userTo: Partial<CreateUserDTO & { active?: boolean }> = userDTO;

      const { user } = (
        await FindUserUseCase.getInstance(UserRepository).execute(
          new UserId(Number(id))
        )
      ).toPrimitives().contain as { user: UserPrimitive };

      const userPrimitive = user;

      const response = await UpdateUserUseCase.getInstance(
        UserRepository
      ).execute(
        User.fromPrimitives({
          id: id,
          createdAt: Date.now().toString(),
          updatedAt: Date.now().toString(),
          active: userTo.active || userPrimitive.active,
          age: userTo.age || userPrimitive.age,
          firstname: userTo.firstname || userPrimitive.firstname,
          lastname: userTo.lastname || userPrimitive.lastname,
          username: userTo.username || userPrimitive.username,
          email: userTo.email || userPrimitive.email,
          password: userTo.password || userPrimitive.password,
          role: userTo.role || userPrimitive.role
        }),
        new UserPassword(userPrimitive.password)
      );

      const { status, success, contain } = response.toPrimitives();

      return res.status(status).send({ success, ...contain });
    } catch (error: any) {
      return this.mapperException(res, error, req.body, 'Users v1');
    }
  }
}
