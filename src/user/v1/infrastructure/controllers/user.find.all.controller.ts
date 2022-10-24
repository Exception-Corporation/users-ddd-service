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
    const { pageSize, page, searchBy } = req.query;

    let searching;

    try {
      searching = JSON.parse(searchBy?.toString() || '{}');
    } catch (error) {
      searching = '{}';
    }

    try {
      const response = await FindAllUsersUseCase.getInstance(
        UserRepository
      ).execute({
        searchBy: searching || {},
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
