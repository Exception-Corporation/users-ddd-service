import { inject } from 'inversify';
import { provide } from '@/shared/infrastructure/d-injection/decorators/provider';
import { TYPES } from '@/user/v1/infrastructure/d-injection/types';
import { UseCase } from '@/shared/infrastructure/use-cases/UseCase';
import { UserRepository } from '@/user/v1/domain/repositories/user.repository';
import {
  Response,
  ResponsePrimitive
} from '@/user/v1/domain/response/response.entity';
import { QueryParams } from '@/shared/domain/interfaces/QueryParams';
import HttpStatus from '@/shared/domain/errors/lib/HttpStatus';

@provide(TYPES.FindAllUsersUseCase)
export class FindAllUsersUseCase extends UseCase {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly userRepository: UserRepository
  ) {
    super();
  }

  async execute(query: QueryParams): Promise<Response> {
    let users = await this.userRepository.findAll(query);
    const size = users.length;

    users = users.splice((query.page - 1) * query.pageSize, query.pageSize);

    const totalPages = size / users.length;
    const floor = Math.floor(totalPages);

    let response: ResponsePrimitive = {
      success: true,
      status: HttpStatus.OK,
      contain: {
        page: query.page,
        itemsByPage: query.pageSize,
        usersSize: users.length,
        totalUsers: size,
        totalPages:
          users.length < query.pageSize
            ? query.page
            : floor < totalPages
            ? floor + 1
            : floor,
        users: users.map((user) => user.toPrimitives())
      }
    };

    return Response.fromPrimitives(
      response.success,
      response.status,
      response.contain
    );
  }
}
