const router = require('nodejs-basic-routing');
const http = require("http");
const {MongoClient, Db} = require('mongodb');

function DBClient(adapter = "mongodb", options = {}) {
    this.client = new MongoClient("mongodb://localhost/nodejs_mongodb");
    this.collections = {};
}

DBClient.prototype.connect = async function () {
    try {
        await this.client.connect();
    } catch (e) {
        console.dir(e);
    }
}

DBClient.prototype.close = async function () {
    try {
        await this.client.close();
    } catch (e) {
        console.dir(e);
    }
}

DBClient.prototype.registerCollection = async function (collections = []) {
    try {
        const res = await Promise.all(collections.map((name) => this.client.db("nodejs_mongodb").collection(name)));
        res.forEach((ref, i) => {
            this.collections[collections[i]] = ref;
        })
    } catch (e) {
        console.dir(e);
    }
}

DBClient.prototype.table = function (tableName) {
    if (!this.collections.hasOwnProperty(tableName)) {
        throw Error("Collection not registered");
    }
    return this.collections[tableName];
}

const dbClient = new DBClient();

// const users = client.db("nodejs_mongodb").createCollection("users");
// users.insertOne({name: "Jahid Hasan", age: 24, language: "Javascript"})

router.get("/", async function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write("Hello World");
});

router.get("/users", async function (req, res) {
    const data = await dbClient.table("users").find({name: "Maruf Islam"});
    const d = await data.toArray();

    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(d[0]));
});

const app = {};

app.init = async function (port) {
    console.log(port)
    await dbClient.connect();
    await dbClient.registerCollection(["users"]);

    http.createServer(async function (req, res) {
        await router.register(req, res);
    }).listen(port, () => {
        console.log('Server running at http://localhost:' + port);
    });
};

app.init(3000).then(r => console.log("init success", r)).catch(console.log)

const cleanup = (event) => {
    dbClient.close().catch(console.log)
    process.exit();
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

