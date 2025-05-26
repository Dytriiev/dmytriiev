const service = require('./service');
const router = require("../helpers/router");




 router.addRoute('GET', '/users', async (req, res) => {
    const data = await service.getAllUsers();
    console.log(data)
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
});

router.addRoute('POST', '/userById', (req,res)=> {
    let body ='';
    req.on('data', chunk => body += chunk)
    req.on('end', async ()=> {
        const data = await service.getUserById(JSON.parse(body));
    res.writeHead(200,{'Content-Type': 'application/json'});
    res.end(JSON.stringify(data))
    })
    
})



 router.addRoute('POST', '/newuser', (req, res) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
        const userData = JSON.parse(body);
        const newUser = await service.createUser(userData);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        console.log(newUser)
        res.end(JSON.stringify(newUser));
    });
});


 router.addRoute('DELETE', '/deleteuser',(req,res)=> {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end',async () => {
        const delUser = JSON.parse(body);
        const deletedUser = await service.deleteUser(delUser);
        res.writeHead(200,{'Content-Type': 'application/json' });
        res.end(JSON.stringify(deletedUser))
    })
 })


module.exports = router;