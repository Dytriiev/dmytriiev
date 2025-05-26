const routes = {};

function addRoute(method, path, handler) {
    const key = `${method.toUpperCase()} ${path}`;
    routes[key] = handler;
}

function handle(req, res) {
    const key = `${req.method} ${req.url}`;
    const handler = routes[key];

    if (handler) {
        handler(req, res);
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Metod Not Found' }));
    }
}

module.exports = { addRoute, handle };
