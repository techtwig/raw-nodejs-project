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
            await routes.post[req.url](req, res);
        } else {
            if (!routes.get.hasOwnProperty(req.url)) {
                res.write("Not found");
                res.end();
                return;
            }
            await routes.get[req.url](req, res);
        }
        res.end();
    }
};
