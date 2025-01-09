import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "./roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    console.log('RolesGuard executing');
    const requiredRoles = this.reflector.getAllAndMerge(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    console.log('Required roles:', requiredRoles);

    const { user } = context.switchToHttp().getRequest();
    console.log('User from request:', user);
    return requiredRoles.includes(user?.role);
  }
}
