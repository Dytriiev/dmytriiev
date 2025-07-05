import {Router} from 'express';
import {z} from 'zod';
import {makeClassInvoker} from 'awilix-express';
import {BrewController} from '../controllers/brew.controller.js';
import {validate} from '../middlewares/validate.js';
import {registry} from '../openapi/registry.js';
import {BrewDTO,UpdateBrewDTO,ReqQueryDTO,ResBrewDTO} from '../dto/brew.dto.js';
import {validateParams} from '../middlewares/validateParams.js';
import { validateQuery } from '../middlewares/validateQuery.js';

const router = Router();
const ctl = makeClassInvoker(BrewController);

const paramsSchema = z.object({
  id: z.string().describe('Brew ID') // опис path-param
})

router.get(
  '/brews',
  validateQuery(ReqQueryDTO),
  ctl('getBrews')
);
registry.registerPath({
  method: 'get',
  path: '/api/brews',
  tags: ['Brews'],
  parameters: [ 
    {
      name: 'method',
      in: 'query',
      description: 'Filter by brewing method',
      required: false, 
      schema: {
        type: 'string',
        enum: ['v60', 'aeropress', 'chemex', 'espresso']
      }
    },
    {
      name: 'ratingMin',
      in: 'query',
      description: 'Minimum rating (1-5)',
      required: false,
      schema: {
        type: 'integer',
        minimum: 1,
        maximum: 5
      }
    }
  ],
  responses: {
    200: {
      description: 'Array of brews',
      content: {
        'application/json': {
          schema: z.array(BrewDTO)
        }
      }
    }
  }
});

router.get(
  '/brews/:id',
  validateParams(paramsSchema),
  ctl('getById')
);
registry.registerPath({
  method: 'get',
  path: '/api/brews/{id}',
  tags: ['Brew'],
  request: {params: paramsSchema}, // опис path-param
  responses: {
    200: {description: 'Brew', content: {'application/json': {schema: BrewDTO}}},
    404: {description: 'Brew not found'}
  }
})

router.post(
  '/brews',
  validate(BrewDTO),
  ctl('create')
);
registry.registerPath({
  method: 'post',
  path: '/api/brews',
  tags: ['Brew'],
  request: {
    body: {required: true, content: {'application/json': {schema: BrewDTO}}}
  },
  responses: {
    201: {description: 'Created', content: {'application/json': {schema: ResBrewDTO}}},
    400: {description: 'Validation error'}
  }
})

router.put(
  '/brews/:id',
  validateParams(paramsSchema),
  validate(UpdateBrewDTO),
  ctl('update')
);
registry.registerPath({
  method: 'put',
  path: '/api/brews/{id}',
  tags: ['Brew'],
  request: {
    params: paramsSchema,
    body: {required: true, content: {'application/json': {schema: UpdateBrewDTO}}}
  },
  responses: {
    200: {description: 'Updated brew', content: {'application/json': {schema: BrewDTO}}},
    400: {description: 'Validation error'},
    404: {description: 'Brew not found'}
  }
})

router.delete(
  '/brews/:id',
  validateParams(paramsSchema),
  ctl('remove')
);
registry.registerPath({
  method: 'delete',
  path: '/api/brews/{id}',
  tags: ['Brew'],
  request: {params: paramsSchema},
  responses: {
    204: {description: 'Deleted'},
    404: {description: 'User not found'}
  }
})

export {router};