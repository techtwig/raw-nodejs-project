const util = require("util");
const routes = {
    get: {},
    post: {}
};

module.exports = {
    get: function (url, callback) {
        routes.get[url] = callback
    },
    post: function (url, callback) {
        routes.post[url] = callback
    },
    register: async function (req, res) {
        if (req.method === "POST") {
            if (!routes.post.hasOwnProperty(req.url)) {
                res.write("Not found");
                res.end();
                return;
            }
            const callback = routes.post[req.url];
            if (util.types.isAsyncFunction(callback)) {
                await callback(req, res);
            } else {
                callback(req, res);
            }
        } else {
            if (!routes.get.hasOwnProperty(req.url)) {
                res.write("Not found");
                res.end();
                return;
            }
            const callback = routes.get[req.url];
            if (util.types.isAsyncFunction(callback)) {
                await callback(req, res);
            } else {
                callback(req, res);
            }
        }
        res.end();
    }
};
