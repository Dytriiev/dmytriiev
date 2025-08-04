import {CanActivate} from "../../core/interfaces";
import {Injectable, SetMetadata} from "../../core/decorators";
import {Reflector} from "../../core/providers";
import {ExecutionContext} from "../../core/utils";

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) =>
  SetMetadata(ROLES_KEY, roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
/**параметр ctx из runGuards(use-guards.ts) ->
 *  const ctx = new ExpressExecutionContext(controllerClass, handler, req, res)
 * ctx.getHandler() метод (execution-context.ts)
 * ctx.getClass() класс контроллер(execution-context.ts)
 * allowed - массив с ролями если они оределены так @Roles(['admin', 'moderator'])
 *  т.е. кому разрешен метод/класс
 * role-рольуказанная в запросе, если есть в allowed то возвр true */
  canActivate(ctx: ExecutionContext) {

    const allowed = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [ctx.getHandler(), ctx.getClass()],
    );

    if (!allowed || allowed.length === 0) return true;

    const { headers } = ctx.switchToHttp().getRequest();;

    const role = headers['x-role'] as string;

    return !!role && allowed.includes(role);
  }
}