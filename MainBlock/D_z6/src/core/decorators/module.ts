export function Module(metadata: { controllers?: any[]; providers?: any[];exports?:any[];
  imports?:any[]
 }) {
  return function (target: any) {
console.log('Module target:',target)
console.log('Module metadata:',metadata)
    Reflect.defineMetadata('mini:module', metadata, target);
  };
}