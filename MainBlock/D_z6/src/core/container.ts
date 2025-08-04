import 'reflect-metadata';

export class Container {
  #registered = new Map();
  #singletons = new Map();

  resolve<T>(token: new (...args: any[]) => T): T {
    if (this.#singletons.has(token)) return this.#singletons.get(token);
    const cs = this.#registered.get(token);
    if(!cs) {
      throw new Error(`Token ${token.name} is not registered.`);
    }

    const deps: any[] = Reflect.getMetadata("design:paramtypes", token) || [];
console.log('deps ', deps)
/////////////////////////////////////////////////////
const inject : any[] = Reflect.getMetadata('self-paramtypes',token) || []
console.log('self-paramtypes', inject)
const resdeps = deps.concat(inject)
/////////////////////////////////////////////////////
    const resolved = new cs(...resdeps.map(d => {
      if(d === token) {
        throw new Error(`Circular dependency detected for token ${token.name}.`);
      }

      return this.resolve(d)
    }));

    this.#singletons.set(token, resolved);
    return resolved;
  }

  register<T extends Function>(token: T, member: T): void {
    if (this.#registered.has(token)) {
      // throw new Error(`Token ${token.name} is already registered.`);
      return
    }

    this.#registered.set(token, member);
  }
}

export const container = new Container();