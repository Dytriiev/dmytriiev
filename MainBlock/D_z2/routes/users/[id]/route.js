
import path from 'node:path'
import * as service from '../../../services/users.service.js'

export const GET = async (req, res) => {
  const id = path.parse(req.url).base
  const data={ id }
  const user = await service.getUserById(data)

  res.writeHead(200,{'Content-Type': 'application/json'});
  res.end(JSON.stringify(user))
}

export const PUT = async (req,res) => {

  const id = path.parse(req.url).base
  let body = ''
  req.on('data', chunk => body += chunk)
  req.on('end', async () => {
    let dataUpdata = {}
    if(body){
      const bodyParse = JSON.parse(body)
      dataUpdata = {
        id ,
        ...bodyParse
      }
    }
    const user = await service.updateUser(dataUpdata)
    if(!user.updatedUser){
      res.statusCode = 404
      res.end('user not found')
    }
    
    res.writeHead(200,{'Content-Type': 'application/json'});
    res.end(JSON.stringify(user.updatedUser))
  })
}


export const DELETE = async (req,res) => {
  const id = path.parse(req.url).base
  const data={ id }
  const  user = await service.deleteUser(data)
  if(!user.deletedUser){
    res.end('user not found')
  }
  res.end(JSON.stringify(user.deletedUser)) 
}


