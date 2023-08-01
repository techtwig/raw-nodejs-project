const Router = require('router')

const router = Router()

router.get("/", async function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write("Hello World");
    res.end();
});

router.get("/users", async function (req, res) {
    // const data = await dbClient.table("users").find({name: "Maruf Islam"});
    // const d = await data.toArray();

    res.writeHead(200, {'Content-Type': 'application/json'});
    // res.write(JSON.stringify(d[0]));
    res.write("{}");
    res.end();
});

module.exports = router