import path from 'path'
import fs from 'fs'

const dynamicRouteRegex = /^\/([^/]+)\/(\d+)\/?$/
const endPoints = new Map();
const scanRoutes = async (dir) => {

  const entries = await fs.promises.readdir(dir, { withFileTypes: true})
  
  console.log(entries)
  for(const entry of entries){
    
    if(entry.isDirectory()){
      await scanRoutes(path.join(dir,entry.name ))
    } 
    else {
      if(entry.name !== 'route.js') continue
      const routePath = path.join(dir,entry.name)
      console.log(` RoutePath: ${routePath}`)
      const { default:handler } = await import(path.join('..',routePath))
      console.log(`EntryPath: ${entry.path}`)
      // щоб побачити ,що роут дійсно додаєтся необхідно закоментувати наступну строку
      // if(!handler) continue
      // я бачу в Map(3) {
      //   'routes/contents' => undefined,//file route.js иснуе , але порожній
      //   'routes/users/[id]' => [AsyncFunction: default],
      //   'routes/users' => [AsyncFunction: users]
      // }
        
      endPoints.set(entry.path,handler)
      console.log(endPoints)
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


export async function router(req,res){
  const url = String(req.url).toLocaleLowerCase()
  console.log(url)
  if(!url){
    res.statusCode = 500
    res.end('Server error')
    return
  } 
  const match = url.match(dynamicRouteRegex)
  let dinamicKey = ''

  if(match){
    const urlName = match[1]
    dinamicKey = path.join('routes', urlName,'[id]')
    console.log(dinamicKey)
    if(!endPoints.has(dinamicKey) || typeof endPoints.get(dinamicKey) !== 'function' ){
      res.statusCode = 404
      res.end('Route not found')
      return
    }
    return endPoints.get(dinamicKey)(req,res)
  } 

  const key = path.join('routes',url)   
  if(!endPoints.has(key) || typeof endPoints.get(key) !== 'function'  ){
    res.statusCode = 404
    res.end('Route not found')
    return
  }else {
          
    return endPoints.get(key)(req,res)        
  }
}



