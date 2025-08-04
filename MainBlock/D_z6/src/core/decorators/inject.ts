
export function Inject(data?: any) {
  return function (target: any, name:any | undefined, idx: number) {
console.log('Inject target:',target)
console.log(target.constructor)
console.log(name)
console.log(idx)    
if(name === undefined){
    const inject = Reflect.getMetadata('self-paramtypes', target) ?? [];
    if(data){ inject[idx] = data}
     Reflect.defineMetadata('self-paramtypes', inject,target)
  };
}
}