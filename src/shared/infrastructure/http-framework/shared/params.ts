import { FastifyRequest, FastifyReply } from 'fastify';

/*import {
  Request as ExpressRequest,
  Response as ExpressResponse
} from 'express';*/

export type Request = FastifyRequest;

export type Response = FastifyReply;
