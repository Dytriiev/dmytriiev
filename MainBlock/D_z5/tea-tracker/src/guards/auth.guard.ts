import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
// import { Observable } from 'rxjs';
import type { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/decorators/public';

export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );
    console.log('isPublic:', isPublic)
     if (isPublic) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest();
    const isReqPublic = request.headers['x-api-key'];
    if (!isReqPublic || isReqPublic !== 'im_rd_student') {
      throw new UnauthorizedException( 'Unauthorized ');
    }
    return true;
  }
}
