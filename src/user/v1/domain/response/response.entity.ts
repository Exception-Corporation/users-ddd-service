import { Entity } from '@/shared/domain/class/entity';
import { ResponseContain } from '@/user/v1/domain/response/value-objects/response.contain';
import { ResponseStatus } from '@/user/v1/domain/response/value-objects/response.status';
import { ResponseSuccess } from '@/user/v1/domain/response/value-objects/response.success';

export type ResponsePrimitive = ReturnType<Response['toPrimitives']>;

export class Response extends Entity {
  constructor(
    private success: ResponseSuccess,
    private status: ResponseStatus,
    private contain: ResponseContain
  ) {
    super();
  }

  static fromPrimitives(succes: boolean, status: number, contain: object) {
    return new Response(
      new ResponseSuccess(succes),
      new ResponseStatus(status),
      new ResponseContain(contain)
    );
  }

  toPrimitives() {
    return {
      success: this.success.valueOf(),
      status: this.status.valueOf(),
      contain: this.contain.valueOf()
    };
  }
}
