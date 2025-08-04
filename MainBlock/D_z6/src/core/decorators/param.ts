import {ArgumentMetadata} from "../types";

export function Param(data?: string) {
  return function (target: any, name: string, idx: number) {
console.log('Param target:',target)
console.log(target.constructor)
console.log(name)
console.log(idx)    

    const ps = Reflect.getMetadata('design:paramtypes', target, name) ?? [];
    const metatype = ps[idx];
    const params: Array<ArgumentMetadata> =
      Reflect.getMetadata('mini:params', target.constructor) ?? [];
    params.push({ index: idx, metatype, type: 'param', data, name });
    Reflect.defineMetadata('mini:params', params, target.constructor);
  };
}

export function Body() {
  return function (target: any, name: string, idx: number) {

console.log('Body target',target)
console.log('Body name',name)

console.log(idx)   

    const ps = Reflect.getMetadata('design:paramtypes', target, name) ?? [];

// console.log(ps[idx]) 
// console.log(ps[name])    
 
    const metatype = ps[idx];
    const params: Array<ArgumentMetadata> =
      Reflect.getMetadata('mini:params', target.constructor) ?? [];
    params.push({ index: idx, type: 'body', metatype, name });
    Reflect.defineMetadata('mini:params', params, target.constructor);
  };
}

export function Query(data: string) {
  // target == не знаю . в kонсоли {}
  // target.constructor == class 
  // name == имя метода в котором этот параметр
  // idx == порядковый номер параметра 

  return function (target: any, name: string, idx: number) {
    const ps = Reflect.getMetadata('design:paramtypes', target, name) ?? [];
    const metatype = ps[idx];
    const params: Array<ArgumentMetadata> =
      Reflect.getMetadata('mini:params', target.constructor) ?? [];
    params.push({ index: idx, type: 'query', metatype, data, name });
 console.log('Query',params)
    Reflect.defineMetadata('mini:params', params, target.constructor);
  };
}