import fs from 'fs';
import path from 'path';

const dirname = import.meta.dirname
const newUrl = path.join(dirname,'Bd')
const fileUrl = path.join(newUrl,'database.json')

export async function writeFileUsers(users){
  await fs.promises.writeFile(fileUrl, JSON.stringify(users))
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


async function readFileUsers(){
  try {
    const data =  await fs.promises.readFile(fileUrl,{encoding :'utf8', flag:'r'})
    // console.log(`File:${data}`)
    return JSON.parse(data)
  } catch (error) {

    console.log(' ERRORRR')
    if(error.code == 'ENOENT'){
      const initialData = JSON.stringify([], null, 2);
      return await  createInitialFile(initialData)
              
    }
  }
}

async function createUser(data){

  const usersExist = await readFileUsers()
  // console.log(usersExist)
  let newUser = {}
  if(!usersExist.length){
    newUser = {
      id: 1,
      ...data
    }
        
  } else {
    newUser = {
      id:(+usersExist[usersExist.length-1].id + 1).toString(),
      ...data
    }

  }
  const users = [...usersExist, newUser]
  await writeFileUsers(users)
  // console.log(users)
  return newUser
}

async function getAllUsers() {
  const users = await read()
  return users
}


async function deleteUser(data) {
  const users = await read()
  const deletedUser = users.find( user => user.id == data.id)
  if(!deletedUser){
    console.log('User not found')
  }
  const newUsers =  users.filter(user => user.id !== data.id)
  await writeFileUsers(newUsers)
  return {
    deletedUser,
    newUsers
  }
}

async function updateUser(data) {
  if(!data){
    return {}
  }
  const users = await read()
  const updateUser = users.find( u => u.id == data.id)
  // console.log(updateUser)
  // console.log(data)
  if(!updateUser){
    console.log('User not found')
    return
  }
    
  const updatedUser = Object.assign(updateUser,data)

  // console.log(users)
  await writeFileUsers(users)
  return  updatedUser
}   

async function findUser(data){
  console.log(data)
  const users = await read()
  if(!users){
    return {}
  }
  console.log(users)
  const user = users.find(user=> user.id === data.id)
  console.log(user)
  return user
    
}


export {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
  findUser
}