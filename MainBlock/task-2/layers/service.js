// Business logic
const model = require('./model');




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
    return{
         message:`User: ${user.name} was found!`,
         time: new Date().toISOString() 
    }
}
}

async function createUser(data,){
   const users = await model.createUser(data)
   let usersStr = JSON.stringify(users)
    return {
        message: `User ${data.name} was created `,
        newUsers: `NewUsers ${usersStr}`,
        time : new Date().toISOString()
    }
}

async function deleteUser(data){

    // console.log(data)
   const {deletedUser,users} = await model.deleteUser(data)
let usersStr = JSON.stringify(users)
let resultStr = JSON.stringify(deletedUser)
   console.log(deletedUser)
if(deletedUser){
    return{
        message:`User ${resultStr}  was deleted`,
        newUsers:`NewUsers ${usersStr}`, 
        time: new Date().toISOString()
    }
} else {return {
    message:'User not found',
    time: new Date().toISOString()
}}
}

module.exports = { getAllUsers ,createUser, deleteUser, getUserById};