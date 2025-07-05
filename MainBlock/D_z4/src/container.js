import { createContainer, asClass } from 'awilix';
import { BrewModel }       from './models/brew.model.js';
import { BrewService }     from './services/brew.service.js';
import { BrewController }  from './controllers/brew.controller.js';


export const container = createContainer({ injectionMode: 'CLASSIC' })
  .register({
    brewModel: asClass(BrewModel).singleton(),
    brewService: asClass(BrewService).scoped(),
    brewController: asClass(BrewController).scoped()
  });