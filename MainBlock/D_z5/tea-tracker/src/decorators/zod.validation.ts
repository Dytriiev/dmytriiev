// src/decorators/zod-validated-body.decorator.ts
import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { Request } from 'express';
import { z } from 'zod';

export const ZBody = (schema: z.ZodSchema) => {
  return createParamDecorator((_undefined: never, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const result = schema.safeParse(request.body);

    if (!result.success) {
      const errRes: string[] = [];
      result.error.issues.map((iss) => errRes.push(iss.message));
      throw new BadRequestException(JSON.stringify(errRes));
    }

    return result.data;
  })();
};
