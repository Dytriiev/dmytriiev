import express from 'express';

const app = express()

app.use(express.json())

const port = process.env.PORT || 4000

const store = new Map()

function r(json, res, status) { res.status(status).end(JSON.stringify(json)); }

app.post('/redis/post', async (req,res)=>{

  const data = req.body
  console.log(data)
  if(!data.key){
    return res.status(206).end('not enough data') 
  }
  const{key,value} = data
  store.set(key,value)
  console.log(store.entries())
  
  const status = 201
  r({'oK':true},res,status)
})

app.get('/redis/get', async(req,res)=>{
  const key = req.query.key
  if (!key) {
    return res.status(400).json({ error: "Parameter 'key' is required" })};
  const value = await store.get(key)
  let status = 200
  if(!value){
    status = 404
    return r({'key':`${key} not found`},res,status)
  }
  r({'value':value},res,status)
})

app.use((req, res) => {
  res.status(404).end('not found')
});


app.listen(port, () => {
  console.log(`redis-like server listening on port ${port}`)})
 
