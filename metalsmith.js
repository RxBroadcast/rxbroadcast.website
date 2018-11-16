const argv = require("yargs").argv;
const htmlMinifier = require("metalsmith-html-minifier");
const jsdom = require("jsdom");
const katex = require("katex");
const Metalsmith = require("metalsmith");
const minimatch = require("minimatch");
const postcss = require("metalsmith-postcss");
const sass = require("metalsmith-sass");
const superstatic = require("superstatic").server;

const { JSDOM } = jsdom;
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
    .use((files, _, done) => {
        setImmediate(done);
        Object.keys(files)
            .filter(minimatch.filter("*.html", {"matchBase": true}))
            .forEach((file) => {
                const data = files[file];
                const dom = new JSDOM(data.contents.toString());
                const {window: {document}} = dom;
                Array.from(document.querySelectorAll("[data-katex]"))
                    .forEach((el) => {
                        el.innerHTML = katex.renderToString(el.textContent);
                        el.parentNode.replaceChild(el.firstChild, el);
                    });
                data.contents = new Buffer(dom.serialize(), "utf8");
            });
    })
    .use(htmlMinifier())
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
