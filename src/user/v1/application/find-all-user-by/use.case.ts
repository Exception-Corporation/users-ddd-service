import { UseCase } from '@/shared/infrastructure/use-cases/UseCase';
import { UserRepository } from '@/user/v1/domain/repositories/user.repository';
import {
  Response,
  ResponsePrimitive
} from '@/user/v1/domain/response/response.entity';
import { QueryParams } from '@/shared/domain/interfaces/QueryParams';

export class FindAllUsersUseCase extends UseCase {
  private static instance: FindAllUsersUseCase | undefined;
  constructor(private userRepository: UserRepository) {
    super();
  }

  static getInstance(userRepository: UserRepository) {
    if (!this.instance) {
      this.instance = new FindAllUsersUseCase(userRepository);
    }

    return this.instance;
  }

  async execute(query: QueryParams): Promise<Response> {
    let users = await this.userRepository.findAll(query);
    const size = users.length;

    users = users.splice((query.page - 1) * query.pageSize, query.pageSize);

    const totalPages = size / users.length;
    const floor = Math.floor(totalPages);

    let response: ResponsePrimitive = {
      success: true,
      status: 200,
      contain: {
        page: query.page,
        itemsByPage: query.pageSize,
        usersSize: users.length,
        totalUsers: size,
        totalPages: floor < totalPages ? floor + 1 : floor,
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
