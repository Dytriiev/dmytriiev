export function Controller(prefix = '') {
  return function (target: any) {
    
console.log('Controller target:',target)

    Reflect.defineMetadata('mini:prefix', prefix, target);
  };
}

export const isController = (target: any) => {
  return Reflect.hasMetadata('mini:prefix', target);
}