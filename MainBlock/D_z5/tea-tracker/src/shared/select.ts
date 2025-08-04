import { GetTeaDto, PaginateQuery, ResPag } from "src/dto";
import { Tea } from "src/entities";

export const Select = (query:PaginateQuery, brews: Tea[], resPag: ResPag) => {
        const limit = query.limit ?? '10';
        const page = query.page ?? '1';
        const minRating = query.minRating;

          let brewArr: GetTeaDto[] = [];
          const size = Math.min(brews.length, +limit);
          console.log('size:', size);
          const skip: number = +limit * (+page - 1);
          if (skip >= brews.length) {
            return 'page is empty';
          }
          console.log('skip:', skip);
          const start = 0 + skip;
          const end = Math.min((size + skip), brews.length)
          console.log('end:', end)
          for (let i = start; i < end; i++) {
            const brew = brews[i];
            console.log('brew[i]:', brew);
            if (!brew.Rating || !minRating) {
              brewArr = [...brewArr, brews[i]];
            } else if (minRating && brew.Rating >= +minRating) {
              brewArr = [...brewArr, brews[i]];
            }
          }
          resPag.data = brewArr;
          resPag.meta = {
            total: brews.length,
            page: +page,
            limit: +limit,

          };
    return resPag
}