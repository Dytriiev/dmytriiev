import {Request, Response} from "express";
import {ExpressExecutionContext} from "../utils";
import {Type} from "../types";
import {container} from "../container";

/** поле в метадате куда будут записываться guards-классы контроллеров и методов */
export const GUARDS_METADATA = Symbol('guards');

/**
 * @UseGuards(AuthGuard, RolesGuard)
 * Записує список guard-класів у метадані методу/класу.
 */
export function UseGuards(
  ...guards: Function[]   // посилання на класи Guard-ів
): ClassDecorator & MethodDecorator  {
/**key - имя метода если на него применен декоратор */
  return (target: any, key?: string | symbol) => {
    if (key) {
      //  ➜ метод
      Reflect.defineMetadata(GUARDS_METADATA, guards, target[key]);
    } else {
      //  ➜ клас-контролер
      Reflect.defineMetadata(GUARDS_METADATA, guards, target);
    }
  };
}
/**получаем в массив guards-классы контроллеров и методов и возвр этот массив
 * параметры получаем из runGuards которые получены из GuardsMiddleware, 
 * который применен в router.ts asyncHandler(GuardsMiddleware(Ctl, handler, globalGuards)),
 * где Ctl это контроллер из meta.controllers(controller- поле в @Module),
 * const handler = instance[r.handlerName] as (...args: any[]) => Promise<any>;
 * r - route из списка роутов (router.ts -> const routes = get('mini:routes', Ctl) ?? [];)
 */
const getGuards = (controllerClass:  Function, handler: Function,  globalGuards: Array<Type> = []) => {
  const controllerGuards = Reflect.getMetadata(GUARDS_METADATA, controllerClass) ?? [];
  const routeGuards =  Reflect.getMetadata(GUARDS_METADATA, handler) ?? [];

  globalGuards.push(
    ...controllerGuards,
    ...routeGuards
  );

  return globalGuards;
}


export async function runGuards(
  controllerClass: Function,
  handler: Function,
  req: Request,
  res: Response,
  globalGuards: Array<Type> = []
): Promise<boolean | string> {
  const guards = getGuards(controllerClass, handler,  globalGuards);
  
 console.log({guards})

  for (const GuardCtor of guards) {
    // інстанціюємо через IoC (підтримка @Injectable() всередині Guard-а)
    const guardInstance = container.resolve<any>(GuardCtor);

    // Створюємо context «на льоту»
    const ctx = new ExpressExecutionContext(controllerClass, handler, req, res);

    const can = await Promise.resolve( guardInstance.canActivate(ctx) );
    console.log({can, GuardCtor})
    if (!can) return GuardCtor.name;
  }
  return true;
}