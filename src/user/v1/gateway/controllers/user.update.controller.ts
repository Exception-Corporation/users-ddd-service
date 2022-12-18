import { inject, injectable } from 'inversify';
import { TYPES } from '@/user/v1/infrastructure/d-injection/types';
import { TYPES as TYPES_SHARED } from '@/shared/infrastructure/d-injection/types';
import { BaseController } from '@/shared/infrastructure/controller/base.controller';
import { CreateUserDTO } from '@/user/v1/gateway/dtos/create.user.dto';
import { UserId } from '@/user/v1/domain/user/value-objects/user.id';
import { User, UserPrimitive } from '@/user/v1/domain/user/user.aggregate.root';
import { DTOPropertiesError } from '@/shared/domain/errors/domain-errors/DTOPropertiesError';
import { UserPassword } from '@/user/v1/domain/user/value-objects/user.password';
import { UpdateUserUseCase } from '@/user/v1/application/update-user/use.case';
import { FindUserUseCase } from '@/user/v1/application/find-user-by/use.case';
import { AuthenticationError } from '@/shared/domain/errors/domain-errors/AuthenticationError';
import { IEncrypt } from '@/shared/domain/encryption/encrypt.interface';
import {
  Controller,
  Context
} from '@/shared/infrastructure/controller/decorators/controller';
import { GuardWithJwt } from '@/shared/infrastructure/http-framework/middlewares/security/security.decorator';
import { ALL_ROLES } from '@/shared/infrastructure/http-framework/shared/roles';

@Controller({
  http: 'put',
  path: '/update/:id'
})
@GuardWithJwt(ALL_ROLES)
@injectable()
export class UserUpdateController extends BaseController {
  constructor(
    @inject(TYPES.FindUserUseCase)
    private readonly findUseCase: FindUserUseCase,
    @inject(TYPES.UpdateUserUseCase)
    private readonly updateUseCase: UpdateUserUseCase,
    @inject(TYPES_SHARED.IEncrypt)
    private readonly encryptionService: IEncrypt
  ) {
    super();
  }

  async execute(ctx: Context) {
    try {
      const id = Number(ctx.params.id);
      const owner = Boolean(ctx.query.owner) || false;
      const { user: userDTO, auth } = ctx.body;

      if (!userDTO) throw new DTOPropertiesError(['user']);

      const user = await this.getUser(id);
      const verifyPassword = userDTO?.verifyPassword || '';
      const wrongPassword = await this.isWrongPassword(
        verifyPassword,
        user,
        owner,
        auth
      );
      if (wrongPassword)
        throw new AuthenticationError(
          'Wrong password: The current password is incorrect',
          true
        );

      const updateUser = this.getUpdateUser(user, userDTO);
      const response = await this.updateUseCase.execute(
        updateUser,
        new UserPassword(user.password)
      );
      const { status, success, contain } = response.toPrimitives();

      return { status, response: { success, ...contain } };
    } catch (error: any) {
      return this.mapperException(error, ctx.body, 'Users v1');
    }
  }

  private async getUser(id: number) {
    return (
      await this.findUseCase.getUserToUpdate(new UserId(id))
    ).toPrimitives();
  }

  private async isWrongPassword(
    verifyPassword: string,
    user: any,
    owner: boolean,
    auth: any
  ) {
    return (
      !(await this.encryptionService.verifyEncrypValues(
        verifyPassword,
        user.password
      )) &&
      owner &&
      auth.id == user.id
    );
  }

  private getUpdateUser(user: any, userDTO: any) {
    return User.fromPrimitives({
      id: user.id,
      createdAt: Date.now().toString(),
      updatedAt: Date.now().toString(),
      active: userDTO.active || user.active,
      age: userDTO.age || user.age,
      firstname: userDTO.firstname || user.firstname,
      lastname: userDTO.lastname || user.lastname,
      username: userDTO.username || user.username,
      phone: userDTO.phone || user.phone,
      email: userDTO.email || user.email,
      password: userDTO.password || user.password,
      role: userDTO.role || user.role
    });
  }
}
