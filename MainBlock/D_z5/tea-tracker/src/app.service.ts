import { Injectable, NotFoundException } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { GetTeaDto, PaginateQuery, ResPag, TeaDto } from './dto';
import { Tea } from './entities';
import { Select} from './shared/select'
// import { PaginateQuery } from 'nestjs-paginate';

@Injectable()
export class BrewModel {
  static scope = 'singleton';
  #store = new Map<string, Tea>();
  get(query?: PaginateQuery) {
    const brews = Array.from(this.#store.values());
    console.log('Brews:', brews);
    const resPag: ResPag = {};
    if (!brews) {
      return (resPag.data = []);
    }

    console.log('query:', query);
    if (!query || Object.keys(query).length === 0) {
      resPag.data = brews;
      console.log('resPagData:', resPag.data);
      resPag.meta = {
        total: brews.length,
        page: 0,
        limit: 0,
      };
    } else if ( query.limit && query.page) {
      return Select(query,brews,resPag)
    }
    return resPag;
  }

  //  tea/:id
  find(id: string) {
    console.log(id);
    const result = this.#store.get(id);
    console.log(result);
    if (!result) {
      throw new NotFoundException('Brew not found');
    }
    return result;
  }

  //  tea/:id
  remove(id: string) {
    const result = this.#store.delete(id);
    if (!result) {
      throw new NotFoundException('Brew not found');
    }
    return result;
  }

  //    tea
  create(body: TeaDto) {
    const id = nanoid(6);
    const result = { ...body, id };
    this.#store.set(id, result);
    console.log(result);
    return result;
  }

  //   tea/update/:id
  update(id: string, body: Partial<TeaDto>) {
    if (!this.#store.has(id)) {
      throw new NotFoundException('Brew not found');
    }
    const exBrew = this.#store.get(id);
    if (exBrew) {
      this.#store.delete(id);
      const newBrew: GetTeaDto = Object.assign(exBrew, body);
      this.#store.set(id, newBrew);
      return newBrew;
    } else return null;
  }
}
