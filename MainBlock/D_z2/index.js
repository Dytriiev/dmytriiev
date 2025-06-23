import { createServer } from 'node:http'
import {router} from './lib/router.js'
import dotenv from 'dotenv'
dotenv.config()

const server = createServer((req,res)=>{
    router(req,res)
})

const PORT = process.env.PORT || 3000

server.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
});