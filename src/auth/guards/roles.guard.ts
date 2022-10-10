// roles.guards.ts
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { PayloadToken } from '../models/token.model';
import { Request } from 'express';
import { Role } from '../models/roles.model';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<Role[]>(ROLES_KEY, context.getHandler());
    // ['admin', 'customer']
    if (!roles) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as PayloadToken;

    const isAuth = roles.some((role) => role === user.role);
    if (!isAuth) throw new ForbiddenException('Your role is wrong');
    return isAuth;
  }
}
