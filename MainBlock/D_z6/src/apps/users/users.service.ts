import {Injectable} from "../../core/decorators";

export interface User { id: number; name: string; }

@Injectable()
export class UsersService {
  #data: User[] = [{ id: 1, name: 'Den' }];
  findAll() { return this.#data; }
  findOne(id: number) { return this.#data.find(b => b.id === id); }
  create(name: string) {
    const user = { id: Date.now(), name };
    this.#data.push(user); return user;
  }
}