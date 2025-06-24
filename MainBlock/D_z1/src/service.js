import { parseParams, parseId } from './helpers/parsParams.js';
import { updateParse } from './helpers/updateParse.js';
import {
  createPract,
  showL,
  make,
  deletePract,
  updatePr,
  statsPr,
} from './model.js';

export async function createPracties(params) {
  console.log(`input: ${params}`);
  const data = parseParams(params);
  console.log(data);
  await createPract(data);
}
export async function showList() {
  const list = await showL();
  if (!list.length) {
    console.log('List is empty');
  } else {
    console.table(list);
    const tableArr = list.map((pract) => {
      if (pract.done) {
        pract.done = pract.done.length;
      }
      return pract;
    });
    console.table(tableArr);
  }
}

export async function makePract(data) {
  const id = parseId(data);
  return make(id);
}

export async function delPract(data) {
  const id = parseId(data);
  return deletePract(id);
}

export async function updatePract(data) {
  const objData = updateParse(data);
  return updatePr(objData);
}

export async function statsPract() {
  return statsPr();
}
