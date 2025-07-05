import { z } from 'zod';
import { registry } from '../openapi/registry.js';



export const BrewDTO = z.object({
  Beans:  z.string().min(3,'Назва зерен повинна містити щонайменше 3 символи')
    .max(40,'Назва зерен не повинна перевищувати 40 символів'),

  Method: z.enum(['v60', 'aeropress', 'chemex', 'espresso'], {
    errorMap: () => (
      { message: 'Оберіть один із дозволених методів: v60, aeropress, chemex, espresso' })
  }),

  Rating: z.number()
    .min(1, 'Мінімальна оцінка - 1')
    .max(5, 'Максимальна оцінка - 5')
    .optional(),
    
  Notes: z.string()
    .max(200, 'Нотатки не повинні перевищувати 200 символів')
    .optional(),
    
  BrewedAt: z.union([
    z.string().datetime({ 
      offset: true, 
      message: 'Невірний формат дати ISO 8601' 
    }),
    z.string().datetime({ 
      offset: false 
    })
  ])
    .optional()
    .default(() => new Date().toISOString())
  
})
export const ReqQueryDTO = z.object({
  method: z.enum(['v60', 'aeropress', 'chemex', 'espresso'], {
    errorMap: () => (
      { message: 'Оберіть один із дозволених методів: v60, aeropress, chemex, espresso' })
  })
    .optional(),
    
  ratingMin: z.preprocess(
    (rat) => {
      if (rat === '' || rat === undefined) return undefined
      const num = Number(rat)
      return isNaN(num) ? rat : num
    },
    z.number().min(1,'Мінімальна оцінка - 1').max(5,'Максимальна оцінка - 5').optional()
  )
})

export const UpdateBrewDTO = BrewDTO.extend({
  Beans: BrewDTO.shape.Beans.optional(),
  Method: BrewDTO.shape.Method.optional()
})

export const ResBrewDTO = BrewDTO.extend({
  id: z.string()
})


registry.register('Brew', BrewDTO)
registry.register('UpdateBrew', UpdateBrewDTO)
registry.register('ReqQueryDto', ReqQueryDTO)
registry.register('ResBrewDto', ResBrewDTO)
