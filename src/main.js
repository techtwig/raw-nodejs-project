const http = require("http");
const {MongoClient} = require('mongodb');
const router = require('./routers/route')
const finalHandler = require('finalhandler')

function DBClient(adapter = "mongodb", options = {}) {
    this.client = new MongoClient("mongodb://127.0.0.1/nodejs_mongodb");
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


const app = {};

app.run = async function (port) {
    await dbClient.connect();
    await dbClient.registerCollection(["users"]);

    http.createServer(async function (req, res) {
        router(req, res, finalHandler(req, res));
    }).listen(port, () => {
        console.log('Server running at http://localhost:' + port);
    });
};

app.run(3000).then(r => console.log("init success", r)).catch(console.log)

const cleanup = (event) => {
    dbClient.close().catch(console.log)
    process.exit();
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

