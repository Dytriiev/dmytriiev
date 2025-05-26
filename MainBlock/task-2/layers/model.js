const fs = require('fs')

let usersStart= [
    { id:1, name: 'Robot Dreams Student' },
    { id:2, name: 'Den'}
]

function writeFile(users){
 fs.writeFile('Bd/text.txt', JSON.stringify(users),(err,data)=>{
 if(err){
    console.log('ERROR writing')
 }
 })
}
// writeFile(usersStart)

async function readUser(){
    // const data = fs.readFileSync('Bd/text.txt',{encoding :'utf8', flag:'r'})
    // return JSON.parse(data)
    try {
      const data =  await fs.promises.readFile('Bd/text.txt',{encoding :'utf8', flag:'r'})
        console.log(`USERS:${data}`)
        return JSON.parse(data)
    } catch (error) {
        console.log(' ERRORRR')
    }
 }
    


async function getAllUsers() {
    const data =  await readUser()
    return data
}


async function findUser(data){
    console.log(data)
    const users = await readUser()
    if(!users){
        return 
    }
    console.log(users)
    const user = users.find(user=> user.id === +data.id)
        return user
    
}

async function createUser(data){

    const usersExist = await readUser()
    let newUser = {}
    if(!usersExist.length){
         newUser = {
            id: 1,
            ...data
        }
        
    } else {
     newUser = {
        id:usersExist[usersExist.length-1].id + 1,
        ...data
    }

}
    users = [...usersExist, newUser]
    writeFile(users)
    console.log(users)
    return users
}


async function deleteUser(data){
    const usersExist = await readUser()
   const deletedUser = usersExist.find(user=> user.id === +data.id)
  let users = usersExist.filter(user=> user.id !== +data.id)
    writeFile(users)
   console.log(users)
   return {
    deletedUser,
    users
}
}

module.exports = { getAllUsers ,createUser, deleteUser, findUser};