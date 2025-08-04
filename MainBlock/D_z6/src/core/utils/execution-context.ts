import type { Request, Response } from 'express';

/** Мінімальний спільний API з NestJS */
export interface ExecutionContext {
  /** Поточний клас-контролер */
  getClass(): Function;
  /** Поточний метод-обробник */
  getHandler(): Function;

  /** Адаптер під Express / Fastify тощо */
  switchToHttp(): {
    getRequest: () => Request;
    getResponse: () => Response;
  };
}

/** Реалізація для Express-раутів 
 * применяется для runGuards в use-guards.ts
 * параметры из GuardsMiddleware, 
 * который применен в router.ts asyncHandler(GuardsMiddleware(Ctl, handler, globalGuards)),
 * где Ctl это контроллер из meta.controllers(controller- поле в @Module),
 * const handler = instance[r.handlerName] as (...args: any[]) => Promise<any>;
 * r - route из списка роутов (router.ts -> const routes = get('mini:routes', Ctl) ?? [];)
*/
export class ExpressExecutionContext implements ExecutionContext {
  constructor(
    private readonly targetClass: Function,
    private readonly targetHandler: Function,
    private readonly req: Request,
    private readonly res: Response,
  ) {}

  getClass(): Function {
    return this.targetClass;
  }

  getHandler(): Function {
    return this.targetHandler;
  }

  switchToHttp() {
    return {
      getRequest: () => this.req,
      getResponse: () => this.res,
    };
  }
}