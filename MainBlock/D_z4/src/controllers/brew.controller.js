

export class BrewController {
  static scope = 'scoped'; // <- вказуємо, що контролер буде інжектовано в контекст запиту
  constructor(brewService) {// <- інжектовано сервіс
    console.log('UsersController initialized');
    this.brewService = brewService;
  }


  getBrews = async (req,res,next) => {
    try {
      const{ method,ratingMin } = req.validatedQuery
      console.log(req.query)
      const brewArr = await this.brewService.getAll(method , Number(ratingMin))
      console.log(brewArr)
      res.status(200).json(brewArr)
    } catch (error) {
      console.log(error)
      next(error)
    }
  }

  getById  = async(req, res, next) => {
    try {
      const id = req.params.id
      console.log(`Controll id: ${id} `)
      const result = await this.brewService.getOne(id)
      if(!result){
        res.status(404).json('Not found')
      }
      res.status(200).json(result);
    } catch (error) {
      next(error)
    }
  }
  create = async(req, res, next) => {
    try {
      console.log(req.body)
      const result = await this.brewService.create(req.body)
      console.log(result)
      res.status(201).json(result)
    } catch (error) {
      next(error)
    }
  }
    

  update = async(req, res, next) => {
    try {
      const newBrew = await this.brewService.update(req.params.id, req.body)
      console.log(newBrew)
      res.status(200).json(newBrew)
    } catch (error) {
      next(error)
    }
  }
    

  remove = async(req, res, next) => {
    try {
      this.brewService.delete(req.params.id);
      res.status(204).end();
    } catch (error) {
      next(error)
    }  
  };
}
