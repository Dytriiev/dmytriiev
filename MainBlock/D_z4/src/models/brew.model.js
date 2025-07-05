import {nanoid} from 'nanoid'


export class BrewModel {
  static scope = 'singleton'
  #store = new Map()

  //  api/brews |  api/brews?method=aeropress&ratingMin=4  
  //  api/brews?method=aeropress |  api/brews?retingMin=4 
  async get(method,ratingMin){
    const brews =  this.#store.values()
    if(!method && !ratingMin){
      return Array.from(brews)
    }
    let brewArr = []

    for(const brew of brews){  
      if(method && ratingMin){
        if(!brew.Rating){
          if(brew.Method === method){
            brewArr = [...brewArr, brew]
          }
        }else if(brew.Method === method && brew.Rating >= ratingMin) {
          brewArr = [...brewArr,brew]
        }   
      } else  if(!method && ratingMin){
        if(brew.Rating >= ratingMin) { 
          brewArr = [...brewArr,brew]
        }
      } else if(method && !ratingMin){ 
        if(brew.Method === method){
          brewArr = [...brewArr, brew]
        }  
      }
    } return brewArr
  }

  //  api/brews/:id
  async find(id){
    console.log(id)
    const result = this.#store.get(id)
    console.log(result)
    return  result
  }   

  //  api/brews/:id
  async remove(id){
    return this.#store.delete(id)
  }  

  //    api/brews
  async create(body){
    const id = nanoid(6)
    const result = {...body,id}
    this.#store.set(id,body)
    console.log(result)
    return result
  }

  //   api/brews/:id
  async update(id,body){
    if(!this.#store.has(id)) return null
    const exBrew = await this.#store.get(id)
    if(exBrew){
      this.#store.delete(id)
      const newBrew = Object.assign(exBrew,body)
      this.#store.set(id,newBrew)
      return newBrew
    } else return null
  } 
}