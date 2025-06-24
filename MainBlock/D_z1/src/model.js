import fs from 'fs';
import path from 'path';
import { madeAt,period } from './helpers/dateParse.js';

const dirname = import.meta.dirname
const newUrl = path.join(dirname,'Bd')
const fileUrl = path.join(newUrl,'database.json')

export async function writeFilePract(practices){
  await fs.promises.writeFile(fileUrl, JSON.stringify(practices))
}

async function createInitialFile(params) {
  await fs.promises.mkdir(newUrl, {recursive:true})
  console.log('DIR was created')

  try {
    await fs.promises.writeFile(fileUrl,params)
    return []
  } catch (error) {
    console.log(error.message)
  }   
}

async function read() {
  try {
    const data =  await fs.promises.readFile(fileUrl,{encoding :'utf8', flag:'r'})
    return JSON.parse(data)
  } catch (error) {
    console.log('File is empty')
  }

}


async function readFilePract(){
  try {
    const data =  await fs.promises.readFile(fileUrl,{encoding :'utf8', flag:'r'})
    return JSON.parse(data)
  } catch (error) {

    console.log(' ERRORRR')
    if(error.code == 'ENOENT'){
      const initialData = JSON.stringify([], null, 2);
      return await  createInitialFile(initialData)
              
    }
  }
}

export async function createPract(data){

  const practicesExist = await readFilePract()
  let newPractices = {}
  if(!practicesExist.length){
    newPractices = {
      id: 1,
      ...data
    }
        
  } else {
    newPractices = {
      id:practicesExist[practicesExist.length-1].id + 1,
      ...data
    }

  }
  const practices = [...practicesExist, newPractices]
  await writeFilePract(practices)
  return 
}

export async function showL() {
  const list = await readFilePract()
  return list
}

export async function make(id){
  const practices = await read()
  const pract = practices.find(p=>p.id == id)
  if(!pract){
    console.log('No such practic')
    return
  }
  const data = madeAt()
  if(!pract.done){
    pract.done = []
    pract.done.push(data)
  }else{
    pract.done.push(data)
  }
  await writeFilePract(practices)
}

export async function deletePract(id) {
  const practices = await read()
  const delPract = practices.find( p => p.id == +id)
  if(!delPract){
    console.log('No such practic')
    return
  }
  const newPractices =  practices.filter(pract => pract.id !== +id)
  await writeFilePract(newPractices)
}

export async function updatePr(objData) {
  if(!objData){return}
  const practices = await read()
  const updatePract = practices.find( p => p.id == +objData.id)
  console.log(updatePract)
  console.log(objData)
  if(!updatePract){
    console.log('No such practic')
    return
  }
    
  Object.assign(updatePract,objData)

  console.log(practices)
  await writeFilePract(practices)
  return true
}

export async function statsPr() {
  const practices = await read()
  const arrStats = period(practices)
  console.table(arrStats)
  return true
}