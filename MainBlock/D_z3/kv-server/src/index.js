import express from 'express';

const app = express()

app.use(express.json())


const { REDIS_URL  } = process.env
// const REDIS_URL = 'http://localhost:4000'
const port = process.env.PORT || 3000




app.post('/kv/', async(req,res)=>{
  const data = req.body
  console.log(data)
  if(!data.key){
    return res.status(206).end('not enough data') 
  }
  console.log(`${REDIS_URL}/redis/post`)
  const r = await fetch(`${REDIS_URL}/redis/post`,{
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!r.ok) {
    res.statusCode = 500;
    return res.end(JSON.stringify({ error: 'Failed to set value' }));
  }
  res.end(JSON.stringify({ ok: true }));
  
})

app.get('/kv/:key',async(req,res)=>{
  const key = req.params.key
  console.log(key)
  const r = await fetch(`${REDIS_URL}/redis/get?key=${key}`)
  const data = await r.json()
  console.log(data)
  res.end(JSON.stringify(data))
})

app.listen(port, () => {
  console.log(`kv server listening on port ${port}`)})

