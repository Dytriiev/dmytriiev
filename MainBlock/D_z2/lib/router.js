import { users } from "../routes/users/route.js";
import { userId } from "../routes/users/[id]/route.js";

const endPoints = {
    '/users': users,
    patternUsers: /^\/users\/(\d+)$/,
     userId,
    // '/comments': comments,

}

export async function router(req,res){
        const url = String(req.url).toLocaleLowerCase()
        console.log(url)
        if( url === '/users'){
            // console.log(url)
            return endPoints['/users'](req,res)
        }
        if(url.match(endPoints.patternUsers)){
            return endPoints.userId(req,res)
        }
        
        
        else{
            res.statusCode = 404
           res.end(`\r \n Not found: ${url}  ${res.statusCode}`) 
        }

}