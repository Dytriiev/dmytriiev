import test from 'node:test'
import assert from 'node:assert';

test('test find user by id', async () => {
  const data = {'id':'1','name':'Den','color':'red','age':50}
  const res = await fetch('http://localhost:3500/users/1')
  assert.strictEqual(res.status, 200);
  const resJson = await res.json()
  assert.deepStrictEqual(resJson, data);
});

test('create user', async ()=>{
  const newUser = {'name':'Glib','color':'white'}
  const responce = await fetch('http://localhost:3500/users',{
    method:'POST',
    headers:{
      'Content-Type': 'application/json',
    },
    body:JSON.stringify(newUser)
  })
  assert.strictEqual(responce.status,201)
  const resJson = await responce.json()
  assert.strictEqual(newUser.name,resJson.name)
    
})