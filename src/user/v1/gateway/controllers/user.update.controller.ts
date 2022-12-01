import { BaseController } from '@/shared/infrastructure/controller/base.controller';
import { CreateUserDTO } from '@/user/v1/gateway/dtos/create.user.dto';
import { UserRepository } from '@/user/v1/infrastructure/repositories';
import { UserId } from '@/user/v1/domain/user/value-objects/user.id';
import { User, UserPrimitive } from '@/user/v1/domain/user/user.aggregate.root';
import { DTOPropertiesError } from '@/shared/domain/errors/domain-errors/DTOPropertiesError';
import { UserPassword } from '@/user/v1/domain/user/value-objects/user.password';
import { UpdateUserUseCase } from '@/user/v1/application/update-user/use.case';
import { FindUserUseCase } from '@/user/v1/application/find-user-by/use.case';
import { AuthenticationError } from '@/shared/domain/errors/domain-errors/AuthenticationError';
import { EncryptionService } from '@/shared/infrastructure/encryption';
import {
  Controller,
  Context
} from '@/shared/infrastructure/controller/decorators/controller';
import { GuardWithJwt } from '@/shared/infrastructure/http-framework/middlewares/security/security.decorator';

@Controller({
  http: 'put',
  path: '/update/:id'
})
@GuardWithJwt(['standard', 'root', 'visitor'])
export class UserUpdateController extends BaseController {
  constructor() {
    super();
  }

  async execute(ctx: Context) {
    const id = Number(ctx.params.id);

    const owner = Boolean(ctx.query.owner) || false;

    const { user: userDTO, auth } = ctx.body;

    try {
      if (!userDTO) throw new DTOPropertiesError(['user']);

      const userTo: Partial<
        CreateUserDTO & { active?: boolean; verifyPassword?: string }
      > = userDTO;

      const { user } = (
        await FindUserUseCase.getInstance(UserRepository).execute(
          new UserId(Number(id))
        )
      ).toPrimitives().contain as { user: UserPrimitive };

      const userPrimitive = user;

      if (
        !(await EncryptionService.verifyEncrypValues(
          userTo?.verifyPassword || '',
          user.password
        )) &&
        owner &&
        auth.id == user.id
      )
        throw new AuthenticationError(
          'Wrong password: The current password is incorrect',
          true
        );

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
          phone: userTo.phone || userPrimitive.phone,
          email: userTo.email || userPrimitive.email,
          password: userTo.password || userPrimitive.password,
          role: userTo.role || userPrimitive.role
        }),
        new UserPassword(userPrimitive.password)
      );

      const { status, success, contain } = response.toPrimitives();

      return { status, response: { success, ...contain } };
    } catch (error: any) {
      return this.mapperException(error, ctx.body, 'Users v1');
    }
  }
}
