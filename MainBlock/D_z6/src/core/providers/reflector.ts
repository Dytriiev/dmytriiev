import 'reflect-metadata';
import { Injectable } from '../decorators';
import { Type } from '../types';                       // util-alias

@Injectable()
export class Reflector {
  public get<TResult = any, TKey = any>(
    metadataKeyOrDecorator: TKey,
    target: Type<any> | Function,
  ): TResult {
    const metadataKey =
      (metadataKeyOrDecorator as {KEY: string}).KEY ??
      metadataKeyOrDecorator;

    return Reflect.getMetadata(metadataKey, target);
  }
/**key - поле в метадате где необходимо искать метаданные в массиве targets в котором
 * классы и/или их методы(получены в roles.guard.ts 
 *  [ctx.getHandler(), ctx.getClass()])
 * ctx -> canActivate(ctx: ExecutionContext),
 *  на которые установлены метаданные(В случае ROLES_KEY в метаданных
 * будет массив строк по типу "user" || 'admin' || ''somerole').
 * метод возвращает первое значение("user" || 'admin' || ''somerole')
 * и начинает проверку с методов [ctx.getHandler(), ctx.getClass()] ctx.getHandler()-первый,
 * , т.к. роли на методах переопределят роли на классах
 */
  getAllAndOverride<T = any>(
    key: string | symbol,
    targets: Array<Type<any> | Function>,
  ): T | undefined {
    for (const target of targets) {
      const value = this.get(key, target);
      if (value !== undefined) return value as T;
    }
    return undefined;
  }
}