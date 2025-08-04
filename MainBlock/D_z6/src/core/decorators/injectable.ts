import {container} from "../container";

export function Injectable() {
  return function (target: any) {
    console.log('Injectable target:',target)
    container.register(target, target)
  };
}