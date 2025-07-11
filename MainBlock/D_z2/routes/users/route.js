// import * as service from '../../services/users.service.js'

// export default async function users(req,res){
//   let body = ''
//   req.on('data', chunk => body += chunk)
//   req.on('end', async ()=> {
//     let statusCode = 200
//     const method = req.method
//     let data = {}
//     let userData = {}

//     switch(method){
//     case 'GET':
//       data = await service.getAllUsers()
//       // console.log(data)
//       break
//     case 'POST':
//       // console.log(req.body)
//       userData = JSON.parse(body)
//       data = await service.createUser(userData) 
//       statusCode = 201
//       break
//     default:
          
//       statusCode = 405
//     }


//     res.writeHead(statusCode,{'Content-Type': 'application/json'});
//     res.end(JSON.stringify(data))
//   })
// };

import * as service from '../../services/users.service.js'

export const GET = async (req, res) => {
  const data = await service.getAllUsers()
  console.log(data)
  res.writeHead(200,{'Content-Type': 'application/json'});
  res.end(JSON.stringify(data))
  
}
export const POST = async (req,res) => {
  let body = ''
  req.on('data', chunk => body += chunk)
  
  req.on('end', async ()=>{
    const userData = JSON.parse(body)
    const data = await service.createUser(userData) 
    res.writeHead(201,{'Content-Type': 'application/json'});
    res.end(JSON.stringify(data))  
  })
}