const http = require('http');
const {handle} = require("./layers/controller");

const server = http.createServer((req, res) => {
    handle(req, res);
    // res.end(req.url)
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
});