import path from 'node:path'
import * as service from '../../../services/users.service.js'



export async function userId(req,res){
  let body = ''
  const id = path.parse(req.url).base
  const method = req.method
  let user = {}
  const data={ id }
  let dataUpdata = {}
  let statusCode = 200

  req.on('data', chunk => body += chunk)
  req.on('end', async ()=> {
    if(body){
      const bodyParse = JSON.parse(body)
      dataUpdata = {
        id ,
        ...bodyParse
      }
    }
        
    switch(method){
    case 'GET':
      user = await service.getUserById(data)
      break

    case 'DELETE':
      user = await service.deleteUser(data)
      console.log(user)
      if(!user.deletedUser){statusCode = 404}
      break

    case 'PATCH':
      user = await service.updateUser(dataUpdata) 
      if(!user.updatedUser){statusCode = 404} 
      //  console.log(user)
      break
    default :
      statusCode = 405
         
    }

    res.writeHead(statusCode,{'Content-Type': 'application/json'});
    res.end(JSON.stringify(user))
  })
};
