import { z } from 'zod';
import {ArgumentMetadata} from "../../core/types";
import {PipeTransform} from "../../core/decorators";

export class ZodValidationPipe implements PipeTransform<any, any> {
  constructor(
    private readonly schema: z.ZodSchema
  ) {}
// value это аргумент transformed получаемый в use-pipes.ts при вызове
//  pipeInstance.transform(transformed, meta)
  transform(value: unknown, meta: ArgumentMetadata) {
    try {
      return this.schema.parse(value);        // ✅ OK – повертаємо чисті дані
    } catch (err) {
      /*  ↳ у продакшн-коді краще кидати свій HttpError із статусом 400   */
      throw new Error(
        `Validation failed for ${meta.type}${meta.data ? ` (${meta.data})` : ''}`
      );
    }
  }
}