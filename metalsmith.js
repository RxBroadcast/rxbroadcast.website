const Metalsmith = require("metalsmith");
const superstatic = require("superstatic").server;
const watch = require("metalsmith-watch");

const metalsmith = new Metalsmith(__dirname);
const server = superstatic({
    port: 8000,
    cwd: __dirname,
    config: {
        public: "./build"
    }
});

metalsmith.source("website")
    .use(watch({
        log: _ => { }
    }))
    .build((err, files) => {
        if (err) {
            console.error(err);
            return;
        }

        server.listen(e => {
            if (e) {
                console.error("Server error");
                console.error(e);
                return;
            }

            console.log("Server started on port 8000");
        });
    });
