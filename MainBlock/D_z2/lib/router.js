import path from 'path'
import fs from 'fs'

const endPoints = new Map();
const scanRoutes = async (dir) => {

  const entries = await fs.promises.readdir(dir, { withFileTypes: true})
  
  for(const entry of entries){
    
    if(entry.isDirectory()){
      await scanRoutes(path.join(dir,entry.name ))
    } 
    else {
      
      if(entry.name !== 'route.js') continue
      console.log(`Dir.name ${dir}`)

      const routePath = path.join(dir,entry.name)
      console.log(` RoutePath: ${routePath}`)
      const routeModule = await import(path.join('..',routePath))
      console.log(routeModule)
      const routeObj = Object.entries(routeModule)


      let keyEndPoints = dir.split('/')
      
      if(keyEndPoints.length >= 2 && keyEndPoints.at(-1).match((/^\[.*\]$/))){
        keyEndPoints.splice(-1,1,'[param]')
        keyEndPoints = keyEndPoints.join('/')
        endPoints.set(keyEndPoints,routeObj)
      } else {
        endPoints.set(dir,routeObj)
      }
    }  
  }
  return entries
}


const watch = (dir) => { 
  fs.watch(dir,async(event, route) => {
    console.log(`NewRoute: ${route}`)
    await scanRoutes(dir)
  });
};

const dir = './routes'
await scanRoutes(dir)
watch(dir)
console.log(endPoints)

export async function router(req,res){
  const url = String(req.url).toLocaleLowerCase()
  const method = req.method
  if(!url){
    res.statusCode = 500
    res.end('Server error')
    return
  } 
  let urlKey = path.join('routes',url)
  
  if(endPoints.has(urlKey)){
    const methods = endPoints.get(urlKey)
    console.log(methods)
    const metMap = new Map(methods)
    for(const key of metMap.keys()){
      if(key === method){
         
        return metMap.get(method)(req,res)
      } 
      res.statusCode = 405
    } return res.end('Method not found')

  } else {
    const urlArr = urlKey.split('/')
    urlArr.splice(-1,1,'[param]')
    urlKey = urlArr.join('/')

    if(endPoints.has(urlKey)){
      const methods = endPoints.get(urlKey)
      const metMap = new Map(methods)
      for(const key of metMap.keys()){
        if(key === method){
         
          return metMap.get(method)(req,res)
        } 
        res.statusCode = 405
      } return res.end('Method not found')
    } else {
      res.statusCode = 404
      res.end('Route not found')
    }
  }
}


