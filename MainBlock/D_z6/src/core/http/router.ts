import express from 'express';
import {container} from '../container';
import {Type} from "../types";
import {get} from "../utils";
import {GuardsMiddleware} from "./guards.middleware";
import {HandlerMiddleware} from "./handler.middleware";
import {FiltersMiddleware} from "./filters.middleware";
import {asyncHandler} from "./async.handler";

export function Factory(modules: any[]) {

  const app = express();

  app.use(express.json());

  const router = express.Router();
  const globalGuards: Array<Type> = [];
  const globalPipes: Array<Type>  = [];
  const globalFilters: Array<Type>  = [];

  const listen = (port: number, callback?: () => void) => {
 function Start(modules:any[]){ 
      for (const mod of modules) {
        const meta = get('mini:module', mod);
        if (!meta) continue;
console.log(`meta`, meta)

        for (const Ctl of meta.controllers ?? []) {
          container.register(Ctl, Ctl)
          const prefix = get('mini:prefix', Ctl) ?? '';
          const routes = get('mini:routes', Ctl) ?? [];
console.log('Routes', routes)
          const instance = container.resolve(Ctl) as InstanceType<typeof Ctl>;
console.log('instance :',instance)  
 
          routes.forEach((r: any) => {
            const handler = instance[r.handlerName] as (...args: any[]) => Promise<any>;

            const path = prefix + r.path;

            (router as any)[r.method](
              path,
              asyncHandler(GuardsMiddleware(Ctl, handler, globalGuards)),
              asyncHandler(HandlerMiddleware(instance, handler, globalPipes)),
              asyncHandler(FiltersMiddleware(Ctl, handler, globalFilters)),
            );
          });
        }
//////////////////////////////////////////////////        
        if(meta.imports){
console.log('Meta imports', meta.imports)          
          Start(meta.imports)
        }
///////////////////////////////////////////////////        
      }
    }
    Start(modules)
    app.listen(port, callback);
  }

  app.use(router);

  return {
    get: container.resolve,
    listen,
    use: (path: string, handler: express.RequestHandler) => {
      app.use(path, handler);
    },
    useGlobalGuards: (guards: any[]) => {
      globalGuards.push(...guards);
    },
    useGlobalPipes: (pipes: any[]) => {
      globalPipes.push(...pipes);
    },
    useGlobalFilters: (filters: any[]) => {
      globalFilters.push(...filters);
    },
    useGlobalInterceptors: (interceptors: any[]) => {
      throw new Error('Interceptors are not implemented yet');
    },
  }
}