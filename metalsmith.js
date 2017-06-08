const argv = require("yargs").argv;
const htmlMinifier = require("metalsmith-html-minifier");
const Metalsmith = require("metalsmith");
const postcss = require("metalsmith-postcss");
const sass = require("metalsmith-sass");
const superstatic = require("superstatic").server;
const watch = require("metalsmith-watch");

const metalsmith = new Metalsmith(__dirname);
const server = superstatic({
    port: Number(argv.port || 8000),
    cwd: __dirname,
    config: {
        public: "./build"
    }
});

metalsmith.source("website").clean(false)
    .use(sass({
        includePaths: [ "node_modules/" ],
        outputDir: "css/",
        outputStyle: "expanded"
    }))
    .use(postcss({
        plugins: {
            autoprefixer: {},
            cssnano: {},
        },
    }))
    .use(htmlMinifier())
    .use(argv.watch && watch({
        log: _ => { }
    }))
    .build((err, files) => {
        if (err) {
            console.error(err);
            return;
        }

        if (!argv.serve) {
            return;
        }

        server.listen(function (e) {
            if (e) {
                console.error("Server error");
                console.error(e);
                return;
            }

            const {port} = this.address();
            console.log(`Server started on port ${port}`);
        });
    });
