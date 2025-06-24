import * as model from '../models/model.user.js'

async  function getAllUsers() {
  const users = await model.getAllUsers();
  console.log(users)
  if(!users){
    return {
      message: 'Not any users',
      time: new Date().toISOString()
    }
  } else
    return {
      message: `Hello, ${users.map(user=>user.name)}!`,
      time: new Date().toISOString()
    };
}

async function getUserById(data){
  const user = await model.findUser(data)
  if(!user){
    return{
      message:` User with id ${data.id} does not exist`
    }
  } else{
    return user
    // {
    //      message:`User: ${user.name} was found!`,
    //      time: new Date().toISOString() 
    // }
  }
}

async function createUser(data){
  const newUser = await model.createUser(data)
  const userStr = JSON.stringify(newUser)
  return newUser
  //  {
  //     message: `User ${data.name} was created `,
  //     newUser: `NewUser ${userStr}`,
  //     time : new Date().toISOString()
  // }
}
/////////////////////////////////////////
async function deleteUser(data){

  // console.log(data)
  const {deletedUser,newUsers} = await model.deleteUser(data)

  console.log(deletedUser)
  if(deletedUser){
    //     let usersStr = JSON.stringify(users)
    //  let resultStr = JSON.stringify(deletedUser)
    return {
      deletedUser,
      message:`User ${deletedUser}  was deleted`,
      newUsers:`NewUsers ${newUsers}`, 
      time: new Date().toISOString()
    }
  } else {
    return {
      deletedUser,    
      message:'User not found',
      time: new Date().toISOString()
    }}
}
////////////////////////////////////////
async function updateUser(data){
  const updatedUser = await model.updateUser(data)
  //  console.log(updatedUser)
  if(updatedUser){
    return{
      updatedUser,
      message: `User ${updatedUser} was updated`,
      time: new Date().toISOString
    }
  } else {
    return{
      message:'User not found',
      time: new Date().toISOString()
    }
  }
}


export {
  getAllUsers,
  getUserById,
  createUser,
  deleteUser,
  updateUser
}