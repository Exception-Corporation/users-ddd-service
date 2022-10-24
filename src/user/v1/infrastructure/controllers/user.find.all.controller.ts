import { Request, Response } from 'express';
import { BaseController } from '@/shared/infrastructure/controller/base.controller';
import { UserRepository } from '@/user/v1/infrastructure/repositories';
import { FindAllUsersUseCase } from '@/user/v1/application/find-all-user-by/use.case';

export class UserFindAllController extends BaseController {
  public http = 'get';
  public roles?: Array<string>;
  public path: string;

  constructor() {
    super();
    this.path = '/getAll';
    this.roles = ['standard', 'root'];
  }

  async execute(req: Request, res: Response) {
    let { pageSize, page, searchBy } = req.query;

    searchBy = searchBy || '';

    try {
      const response = await FindAllUsersUseCase.getInstance(
        UserRepository
      ).execute({
        searchBy: {
          firstname: searchBy,
          lastname: searchBy,
          email: searchBy,
          username: searchBy,
          age: Number(searchBy)
        },
        pageSize: pageSize ? Number(pageSize) : 10,
        page: page ? Number(page) : 1
      });

      const { status, success, contain } = response.toPrimitives();

      return res.status(status).send({ success, ...contain });
    } catch (error: any) {
      return this.mapperException(res, error, req.body, 'Users v1');
    }
  }
}
