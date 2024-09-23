from typing import Dict, List
import matplotlib.pyplot as plt
import networkx as nx
import requests

import json
from .package import Package


def save(data: Dict[str, Package]):
    with open("data.json", "w") as f:
        json_string = json.dumps([ob.__dict__ for ob in data])
        json.dump(data, f, ensure_ascii=False)


def load() -> Dict[str, Package]:
    with open("data.json") as data_file:
        data_loaded = json.load(data_file)
        data = {}
        for key, p in data_loaded:
            next = Package(**p)
            data[key] = next
        return data


def scrape_all_data_long():
    x = scrape_all_data(10)
    save(x)


def scrape_package(name: str) -> Package | None:
    # print(f"scraping package named {name}")
    url = f"https://registry.npmjs.org/{name}"
    # print(url)
    response = requests.get(url)
    if response.status_code == 200:
        r_dict = response.json()

        latest_version = r_dict.get("dist-tags", {}).get("latest")

        # some packages have no dependencies. represent this as an empty dict
        dependencies: Dict[str, str] = (
            r_dict.get("versions", {}).get(latest_version, {}).get("dependencies", {})
        )

        p = Package(
            r_dict.get("_id"), r_dict.get("description"), latest_version, dependencies
        )
        # print("scraped " + p.id.__str__())
        return p
    print("errrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrror")
    return None


def create_graph():
    G = nx.MultiDiGraph()

    data = scrape_all_data()

    for package in data.values():
        main_package = package.id

        G.add_node(main_package, label=main_package)
        for dependency, _ in package.dependencies:
            G.add_node(dependency, label=dependency)
            G.add_edge(dependency, main_package)

    pos = nx.spring_layout(G)
    nx.draw(G, pos, with_labels=False, node_size=500, node_color="lightblue")

    labels = nx.get_node_attributes(G, "label")
    nx.draw_networkx_labels(G, pos, labels, font_size=10)

    # nx.draw_networkx_nodes(
    #     G, pos, nodelist=[main_package], node_color="red", node_size=700
    # )

    plt.savefig("graph.png")


def scrape_all_data(max=1000) -> Dict[str, Package]:
    print()
    to_search = get_popular_packages()
    return scrape_data(to_search, max)


def scrape_data(to_search: List[str], max=100) -> Dict[str, Package]:
    data = {}
    # print(to_search)

    count = 1
    while count < max:
        count += 1
        if len(to_search) == 0:
            break
        # print("\n\n-------------------------------------------------")
        print("to_search = " + to_search.__str__())
        # print("\ndata = " + data.keys().__str__())
        next_id = to_search.pop()
        print("count = " + count.__str__() + "next = " + next_id)
        if next_id not in data:
            next_package = scrape_package(next_id)
            # print("next_package = " + next_package.__str__())
            if next_package is None:
                return {}
            data[next_id] = next_package
            for d in next_package.dependencies:
                if d not in data:
                    to_search.append(d)
    return data

    # count = 1
    # limit = 100
    #
    # for id in to_search_copy:
    #     name, package = to_search.pop(name)
    #
    #     p = scrape_data(name)
    #     data.append(p)
    #     count++
    #
    # for package_name in package_names:
    #     url = f"https://registry.npmjs.org/{package_name}"
    #     response = requests.get(url)
    #     if response.status_code == 200:
    #         r_dict = response.json()
    #
    #         latest_version = r_dict.get("dist-tags", {}).get("latest")
    #
    #         dependencies = (
    #             r_dict.get("versions", {})
    #             .get(latest_version, {})
    #             .get("dependencies", None)
    #         )
    #
    #         p = Package(
    #             r_dict.get("_id"), r_dict.get("description"), latest_version, dependencies
    #         )
    #         data.append(p)
    #     else:
    #         print(
    #             f"Failed to fetch data for {package_name}, status code: {response.status_code}"
    #         )
    #
    # return data


def fetch_dependencies(package_name, version="latest"):
    url = f"https://registry.npmjs.org/{package_name}/{version}"
    response = requests.get(url)
    package_data = response.json()

    dependencies = package_data.get("dependencies", {})
    return dependencies


def build_graph(package_name, version="latest"):
    G = nx.DiGraph()
    G.add_node(package_name)

    dependencies = fetch_dependencies(package_name, version)

    for dep, _ in dependencies.items():
        G.add_node(dep)
        G.add_edge(package_name, dep)

    return G


def build_big_graph(packages: Dict[str, Package]):
    G = nx.DiGraph()
    for p in packages.values():
        # print(p)
        G.add_node(p.id)

    for p in packages.values():
        for e in p.dependencies:
            G.add_edge(e, p.id)
    return G


def get_popular_packages():
    return [
        "lodash",
        "chalk",
        "request",
        "commander",
        "react",
        "express",
        "debug",
        "async",
        "fs-extra",
        "moment",
        "prop-types",
        "react-dom",
        "bluebird",
        "underscore",
        "vue",
        "axios",
        "tslib",
        "mkdirp",
        "glob",
        "yargs",
        "colors",
        "inquirer",
        "webpack",
        "uuid",
        "classnames",
        "minimist",
        "body-parser",
        "rxjs",
        "babel-runtime",
        "jquery",
        "yeoman-generator",
        "through2",
        "babel-core",
        "core-js",
        "semver",
        "babel-loader",
        "cheerio",
        "rimraf",
        "q",
        "eslint",
        "css-loader",
        "shelljs",
        "dotenv",
        "typescript",
        "@types/node",
        "@angular/core",
        "js-yaml",
        "style-loader",
        "winston",
        "@angular/common",
        "redux",
        "object-assign",
        "zone.js",
        "babel-eslint",
        "gulp",
        "gulp-util",
        "file-loader",
        "ora",
        "node-fetch",
        "@angular/platform-browser",
        "@babel/runtime",
        "handlebars",
        "eslint-plugin-import",
        "@angular/compiler",
        "eslint-plugin-react",
        "aws-sdk",
        "yosay",
        "url-loader",
        "@angular/forms",
        "webpack-dev-server",
        "@angular/platform-browser-dynamic",
        "mocha",
        "html-webpack-plugin",
        "socket.io",
        "ws",
        "babel-preset-es2015",
        "postcss-loader",
        "node-sass",
        "ember-cli-babel",
        "babel-polyfill",
        "@angular/router",
        "ramda",
        "react-redux",
        "@babel/core",
        "@angular/http",
        "ejs",
        "coffee-script",
        "superagent",
        "request-promise",
        "autoprefixer",
        "path",
        "mongodb",
        "chai",
        "mongoose",
        "xml2js",
        "bootstrap",
        "jest",
        "sass-loader",
        "redis",
        "vue-router",
        "chokidar",
        "co",
        "eslint-plugin-jsx-a11y",
        "nan",
        "optimist",
        "promise",
        "@angular/animations",
        "postcss",
        "morgan",
        "less",
        "immutable",
        "qs",
        "loader-utils",
        "fs",
        "extract-text-webpack-plugin",
        "marked",
        "mime",
        "@alifd/next",
        "meow",
        "styled-components",
        "resolve",
        "reflect-metadata",
        "babel-preset-react",
        "jsonwebtoken",
        "react-router-dom",
        "extend",
        "cookie-parser",
        "whatwg-fetch",
        "babel-preset-env",
        "babel-jest",
        "mysql",
        "joi",
        "minimatch",
        "eslint-loader",
        "react-dev-utils",
        "node-uuid",
        "es6-promise",
        "cross-spawn",
        "case-sensitive-paths-webpack-plugin",
        "uglify-js",
        "cors",
        "eslint-plugin-flowtype",
        "react-router",
        "@babel/preset-env",
        "deepmerge",
        "socket.io-client",
        "npm",
        "webpack-manifest-plugin",
        "koa",
        "isomorphic-fetch",
        "babel-cli",
        "del",
        "postcss-flexbugs-fixes",
        "compression",
        "update-notifier",
        "babel-preset-react-app",
        "jade",
        "prompt",
        "gulp-rename",
        "angular",
        "underscore.string",
        "graphql",
        "execa",
        "browserify",
        "opn",
        "validator",
        "eslint-config-react-app",
        "vuex",
        "prettier",
        "invariant",
        "jsdom",
        "@types/react",
        "redux-thunk",
        "mini-css-extract-plugin",
        "globby",
        "pg",
        "got",
        "ajv",
        "xtend",
        "ember-cli-htmlbars",
        "babel-plugin-transform-runtime",
        "nodemailer",
        "source-map-support",
        "express-session",
        "d3",
        "less-loader",
        "fsevents",
        "babel-preset-stage-0",
        "download-git-repo",
        "query-string",
        "font-awesome",
        "open",
        "passport",
        "@types/lodash",
        "grunt",
        "path-to-regexp",
        "mustache",
        "inherits",
        "tmp",
        "md5",
        "dotenv-expand",
        "crypto-js",
        "request-promise-native",
        "through",
        "connect",
        "raf",
        "react-scripts",
        "readable-stream",
        "highlight.js",
        "@babel/polyfill",
        "progress",
        "optimize-css-assets-webpack-plugin",
        "iconv-lite",
        "bunyan",
        "gulp-uglify",
        "koa-router",
        "ncp",
        "lodash.merge",
        "lru-cache",
        "moment-timezone",
        "figlet",
        "history",
        "readline-sync",
        "pluralize",
        "url",
        "log4js",
        "cli-table",
        "webpack-merge",
        "archiver",
        "babel-register",
        "eslint-config-airbnb",
        "clone",
        "jsonfile",
        "puppeteer",
        "shortid",
        "@babel/plugin-proposal-class-properties",
        "querystring",
        "serve-static",
        "tslint",
        "pug",
        "config",
        "source-map",
        "antd",
        "concat-stream",
        "element-ui",
        "lodash.get",
        "@babel/preset-react",
        "serve-favicon",
        "stylus",
        "date-fns",
        "esprima",
        "sequelize",
        "babel-plugin-transform-object-rest-spread",
        "bindings",
        "events",
        "graceful-fs",
        "normalize.css",
        "crypto",
        "cross-env",
        "mime-types",
        "event-stream",
        "hoist-non-react-statics",
        "gulp-concat",
        "terser-webpack-plugin",
        "json-loader",
        "warning",
        "bignumber.js",
        "eventemitter3",
        "webpack-cli",
        "strip-ansi",
        "cli-color",
        "form-data",
        "web3",
        "gulp-sourcemaps",
        "webpack-dev-middleware",
        "ip",
        "camelcase",
        "sw-precache-webpack-plugin",
        "merge",
        "http-proxy",
        "react-transition-group",
        "multer",
        "deep-equal",
        "browser-sync",
        "babel",
        "dateformat",
        "postcss-preset-env",
        "uglifyjs-webpack-plugin",
        "@polymer/polymer",
        "sinon",
        "eslint-config-prettier",
        "gulp-sass",
        "identity-obj-proxy",
        "ts-loader",
        "react-hot-loader",
        "sqlite3",
        "popper.js",
        "which",
        "markdown-it",
        "tar",
        "vue-template-compiler",
        "babel-plugin-transform-class-properties",
        "js-beautify",
        "log-symbols",
        "webpack-hot-middleware",
        "rollup",
        "copy-webpack-plugin",
        "nodemon",
        "boom",
        "xmldom",
        "recompose",
        "util",
        "ini",
        "pify",
        "command-line-args",
        "vinyl",
        "mz",
        "lodash.debounce",
        "html-minifier",
        "ts-node",
        "nconf",
        "recursive-readdir",
        "vue-loader",
        "@types/express",
        "datafire",
        "@types/react-dom",
        "babel-plugin-transform-decorators-legacy",
        "clean-css",
        "hoek",
        "cookie",
        "@babel/plugin-transform-runtime",
        "when",
        "babel-plugin-named-asset-import",
        "postcss-safe-parser",
        "bcrypt",
        "@material-ui/core",
        "@babel/plugin-syntax-dynamic-import",
        "nunjucks",
        "eslint-plugin-promise",
        "react-native",
        "lodash.isequal",
        "workbox-webpack-plugin",
        "acorn",
        "amqplib",
        "@svgr/webpack",
        "color",
        "ms",
        "js-cookie",
        "temp",
        "simple-git",
        "cssnano",
        "reselect",
        "yamljs",
        "ioredis",
        "koa-static",
        "react-app-polyfill",
        "react-select",
        "escape-string-regexp",
        "firebase",
        "bn.js",
        "escodegen",
        "react-bootstrap",
        "babelify",
        "helmet",
        "nopt",
        "eslint-plugin-prettier",
        "jest-resolve",
        "knex",
        "pnp-webpack-plugin",
        "gulp-if",
        "assert",
        "global",
        "npmlog",
        "backbone",
        "graphql-tag",
        "raw-loader",
        "run-sequence",
        "lodash.clonedeep",
        "@oclif/command",
        "http-proxy-middleware",
        "gulp-babel",
        "@oclif/config",
        "vinyl-fs",
        "lodash.throttle",
        "passport-local",
        "eventemitter2",
        "mqtt",
        "unique-random-array",
        "buffer",
        "redux-saga",
        "react-router-redux",
        "jszip",
        "koa-bodyparser",
        "async-validator",
        "babel-preset-stage-2",
        "node-notifier",
        "eslint-config-airbnb-base",
        "material-ui",
        "validate-npm-package-name",
        "clean-webpack-plugin",
        "hammerjs",
        "redux-logger",
        "htmlparser2",
        "html-loader",
        "filesize",
        "gulp-plumber",
        "consolidate",
        "pkginfo",
        "serialport",
        "clear",
        "should",
        "json5",
        "change-case",
        "@babel/plugin-proposal-object-rest-spread",
        "eslint-plugin-node",
        "app-root-path",
        "create-react-class",
        "postcss-import",
        "@angular/cdk",
        "webpack-bundle-analyzer",
        "JSONStream",
        "pump",
        "babylon",
        "mobx",
        "adm-zip",
        "deep-extend",
        "rc",
        "http",
        "@angular/material",
        "eslint-config-standard",
        "eslint-plugin-standard",
        "once",
        "numeral",
        "@typescript-eslint/parser",
        "prismjs",
        "hapi",
        "url-parse",
        "@babel/cli",
        "eslint-plugin-react-hooks",
        "plugin-error",
        "@typescript-eslint/eslint-plugin",
        "require-dir",
        "gulp-autoprefixer",
        "url-join",
        "istanbul",
        "echarts",
        "bower",
        "resize-observer-polyfill",
        "bcryptjs",
        "lodash.assign",
        "gm",
        "babel-plugin-add-module-exports",
        "diff",
        "argparse",
        "react-helmet",
        "stylelint",
        "string",
        "protobufjs",
        "find-up",
        "esm",
        "sprintf-js",
        "rollup-plugin-node-resolve",
        "configstore",
        "download",
        "traverse",
        "websocket",
        "codemirror",
        "bs58",
        "googleapis",
        "method-override",
        "formidable",
        "tape",
        "karma",
        "json-stringify-safe",
        "elasticsearch",
        "split",
        "safe-buffer",
        "rsvp",
        "@oclif/plugin-help",
        "github",
        "xlsx",
        "tinycolor2",
        "lodash-es",
        "@babel/plugin-proposal-decorators",
        "connect-history-api-fallback",
        "@material-ui/icons",
        "jsonschema",
        "portfinder",
        "fbjs",
        "boxen",
        "css",
        "elliptic",
        "sharp",
        "http-errors",
        "co-prompt",
        "walk",
        "restify",
        "three",
        "metalsmith",
        "json-stable-stringify",
        "webpack-node-externals",
        "requirejs",
        "regenerator-runtime",
        "xmlbuilder",
        "unzip",
        "path-exists",
        "rollup-plugin-commonjs",
        "throttle-debounce",
        "user-home",
        "cron",
        "xmlhttprequest",
        "faker",
        "systemjs",
        "inflection",
        "canvas",
        "get-stdin",
        "babel-types",
        "read-pkg-up",
        "graphql-tools",
        "@types/jest",
        "escape-html",
        "broccoli-merge-trees",
        "ssh2",
        "sax",
        "child_process",
        "leaflet",
        "wrench",
        "rx",
        "ethereumjs-util",
        "jimp",
        "enzyme",
        "prettyjson",
        "image-size",
        "bfj",
        "micromatch",
        "gulp-watch",
        "redux-actions",
        "lit-element",
        "discord.js",
        "gulp-less",
        "jshint",
        "vinyl-source-stream",
        "send",
        "mysql2",
        "@types/jquery",
        "user",
        "slash",
        "es6-shim",
        "watch",
        "debounce",
        "d3-scale",
        "babel-helper-vue-jsx-merge-props",
        "file-saver",
        "pull-stream",
        "lodash.omit",
        "koa-compose",
        "chart.js",
        "gulp-replace",
        "shallowequal",
        "cli-spinner",
        "object-path",
        "react-intl",
        "mobx-react",
        "webpack-sources",
        "flat",
        "methods",
        "jasmine",
        "jest-watch-typeahead",
        "react-dnd",
        "object-hash",
        "eslint-plugin-babel",
        "parse5",
        "friendly-errors-webpack-plugin",
        "gulp-template",
        "broccoli-funnel",
        "@emotion/core",
        "lodash.pick",
        "listr",
        "text-table",
        "babel-plugin-transform-es2015-modules-commonjs",
        "lodash.set",
        "watchify",
        "estraverse",
        "unist-util-visit",
        "@fortawesome/fontawesome-svg-core",
        "@angular/compiler-cli",
        "strip-json-comments",
        "randomstring",
        "node-emoji",
        "react-addons-css-transition-group",
        "clui",
        "babel-plugin-import",
        "tslint-react",
        "errorhandler",
        "blessed",
        "electron",
        "eslint-plugin-jest",
        "bytes",
        "deasync",
        "vue-hot-reload-api",
        "swig",
        "jest-pnp-resolver",
        "node-schedule",
        "rollup-plugin-babel",
        "figures",
        "oauth",
        "nedb",
        "detect-port",
        "liftoff",
        "@types/fs-extra",
        "get-port",
        "stylelint-config-standard",
        "gulp-imagemin",
        "husky",
        "@babel/register",
        "gulp-install",
        "gzip-size",
        "node-gyp",
        "node-forge",
        "grunt-contrib-clean",
        "pm2",
        "plist",
        "polished",
        "@fortawesome/free-solid-svg-icons",
        "ts-jest",
        "react-test-renderer",
        "grunt-contrib-watch",
        "loglevel",
        "on-finished",
        "fs-promise",
        "levelup",
        "nomnom",
        "@angular-devkit/core",
        "react-dnd-html5-backend",
        "react-motion",
        "command-line-usage",
        "readline",
        "grunt-contrib-uglify",
        "csv-parse",
        "js-base64",
        "level",
        "dayjs",
        "parseurl",
        "babel-preset-stage-1",
        "read",
        "lodash.defaults",
        "requireindex",
        "tough-cookie",
        "cli",
        "emotion",
        "map-stream",
        "fancy-log",
        "gulp-load-plugins",
        "svgo",
        "cross-fetch",
        "is-plain-object",
        "source-map-loader",
        "@octokit/rest",
        "multimatch",
        "pretty-bytes",
        "urijs",
        "i18next",
        "@babel/types",
        "html-entities",
        "cosmiconfig",
        "pino",
        "verror",
        "gulp-notify",
        "merge-stream",
        "npm-run-all",
        "stylus-loader",
        "@babel/preset-typescript",
        "grpc",
        "he",
        "supports-color",
        "vue-style-loader",
        "create-hash",
        "touch",
        "csv",
        "tslint-config-prettier",
        "lodash.camelcase",
        "log-update",
        "lodash.isplainobject",
        "apollo-client",
        "gulp-conflict",
        "@types/cordova",
        "mathjs",
        "inversify",
        "react-dropzone",
        "yargs-parser",
        "babel-traverse",
        "babel-plugin-syntax-dynamic-import",
        "raw-body",
        "@babel/runtime-corejs2",
        "sync-request",
        "@types/jasmine",
        "valid-url",
        "react-tap-event-plugin",
        "babel-plugin-transform-react-remove-prop-types",
        "draft-js",
        "cuid",
        "slug",
        "bcrypt-nodejs",
        "@babel/parser",
        "jwt-decode",
        "postcss-cssnext",
        "react-icons",
        "install",
        "basic-auth",
        "memory-fs",
        "d3-selection",
        "@angular-devkit/schematics",
        "es6-promisify",
        "react-modal",
        "redux-form",
        "lodash.uniq",
        "gulp-postcss",
        "karma-chrome-launcher",
        "fast-glob",
        "file-type",
        "child-process-promise",
        "babel-plugin-transform-react-jsx",
        "phantomjs-prebuilt",
        "@angular/platform-server",
        "brfs",
        "tar-fs",
        "clipboard",
        "nyc",
        "phantomjs",
        "vinyl-buffer",
        "clipboardy",
        "lodash.isfunction",
        "btoa",
        "rxjs-compat",
        "fork-ts-checker-webpack-plugin",
        "@types/request",
        "recast",
        "d3-array",
        "gulp-jshint",
        "base-64",
        "make-dir",
        "https",
        "sanitize-filename",
        "bip39",
        "vue-class-component",
        "needle",
        "keycode",
        "grunt-contrib-copy",
        "selenium-webdriver",
        "opener",
        "common-tags",
        "is-wsl",
        "koa-body",
        "lodash.isstring",
        "lodash.template",
        "nodegit",
        "command-exists",
        "fstream",
        "node-cache",
        "node-watch",
        "convert-source-map",
        "@types/uuid",
        "imagemin",
        "gulp-filter",
        "vue-property-decorator",
        "gaze",
        "supertest",
        "stack-trace",
        "gulp-clean-css",
        "chance",
        "gulp-typescript",
        "lowdb",
        "generic-pool",
        "assert-plus",
        "eslint-plugin-vue",
        "gulp-minify-css",
        "is-url",
        "urllib",
        "babel-generator",
        "immer",
        "sha1",
        "grunt-contrib-jshint",
        "mockjs",
        "node.extend",
        "connect-redis",
        "babel-plugin-module-resolver",
        "prompts",
        "memoize-one",
        "shell-quote",
        "hyperquest",
        "https-proxy-agent",
        "long",
        "chai-as-promised",
        "secp256k1",
        "http-server",
        "utf8",
        "type-is",
        "vorpal",
        "rollup-pluginutils",
        "finalhandler",
        "tweetnacl",
        "apollo-link",
        "coveralls",
        "d3-shape",
        "postcss-normalize",
        "showdown",
        "promise-polyfill",
        "node-pre-gyp",
        "path-is-absolute",
        "@fortawesome/react-fontawesome",
        "preact",
        "crc",
        "babel-plugin-transform-async-to-generator",
        "osenv",
        "hiredis",
        "lodash.isempty",
        "@babel/traverse",
        "serve-index",
        "lodash.map",
        "highland",
        "localforage",
        "winston-daily-rotate-file",
        "deep-diff",
        "passport-oauth",
        "passport-strategy",
        "iview",
        "dom-helpers",
        "tildify",
        "ethereumjs-tx",
        "babel-template",
        "leveldown",
        "gulp-eslint",
        "rc-util",
        "depd",
        "content-type",
        "nanoid",
        "babel-plugin-syntax-jsx",
        "bl",
        "read-pkg",
        "markdown",
        "jest-environment-jsdom-fourteen",
        "react-error-overlay",
        "serialize-javascript",
        "nprogress",
        "accepts",
        "bizcharts",
        "require-all",
        "base64-js",
        "component-emitter",
        "connect-flash",
        "koa-logger",
        "react-color",
        "findup-sync",
        "passport-oauth2",
        "dockerode",
        "enzyme-adapter-react-16",
        "etag",
        "immutability-helper",
        "grunt-cli",
        "front-matter",
        "mssql",
        "react-native-vector-icons",
        "react-virtualized",
        "fork-ts-checker-webpack-plugin-alt",
        "slugify",
        "node-dir",
        "babel-plugin-transform-regenerator",
        "keypress",
        "@types/bluebird",
        "lodash.foreach",
        "grunt-contrib-concat",
        "split2",
        "extend-shallow",
        "@phosphor/widgets",
        "xregexp",
        "awesome-typescript-loader",
        "hash-sum",
        "apollo-link-http",
        "babel-preset-stage-3",
        "restler",
        "lodash.flatten",
        "react-apollo",
        "intl",
        "babel-plugin-dynamic-import-node",
        "uglify-es",
        "react-lifecycles-compat",
        "lint-staged",
        "@babel/plugin-proposal-export-default-from",
        "normalize-wheel",
        "is-promise",
        "pako",
        "pngjs",
        "utils-merge",
        "gray-matter",
        "postcss-nested",
        "pretty-error",
        "rc-slider",
        "node-static",
        "decompress",
        "gh-pages",
        "cli-table2",
        "os",
        "reactstrap",
        "sanitize-html",
        "extract-zip",
        "gulp-shell",
        "vue-i18n",
        "@types/mocha",
        "http-status-codes",
        "hogan.js",
        "quill",
        "soap",
        "randombytes",
        "decamelize",
        "bson",
        "imagemin-pngquant",
        "arrify",
        "bytebuffer",
        "xml2json",
        "lodash.isobject",
        "columnify",
        "fluent-ffmpeg",
        "xml-js",
        "sockjs-client",
        "@emotion/styled",
        "resolve-from",
        "es6-error",
        "react-slick",
        "typeorm",
        "sprintf",
        "apollo-cache-inmemory",
        "babel-plugin-lodash",
        "hexlet-pairs",
        "pretty-ms",
        "pouchdb",
        "md5-file",
        "react-markdown",
        "is",
        "yeoman-environment",
        "progress-bar-webpack-plugin",
        "left-pad",
        "stylelint-order",
        "follow-redirects",
        "stylelint-scss",
        "koa-mount",
        "busboy",
        "sinon-chai",
        "jasmine-core",
        "loose-envify",
        "process",
        "envify",
        "bufferutil",
        "normalize-url",
        "angular-animate",
        "tv4",
        "karma-mocha",
        "karma-phantomjs-launcher",
        "ts-pnp",
        "atob",
        "connect-mongo",
        "@jupyterlab/application",
        "@babel/plugin-proposal-export-namespace-from",
        "http-status",
        "bulma",
        "cli-ux",
        "iniparser",
        "nock",
        "object.assign",
        "flux",
        "semantic-ui-react",
        "fastclick",
        "karma-jasmine",
        "fuse.js",
        "inert",
        "jwt-simple",
        "isobject",
        "jsdoc",
        "element-resize-detector",
        "react-datepicker",
        "standard",
        "react-onclickoutside",
        "react-addons-shallow-compare",
        "dot",
        "browserslist",
        "firebase-admin",
        "nib",
        "fuzzy",
        "word-wrap",
        "ansi-colors",
        "tracer",
        "yaml",
        "ansi-escapes",
        "jquery-ui",
        "raven",
        "i",
        "xhr",
        "deep-assign",
        "inquirer-autocomplete-prompt",
        "xpath",
        "fresh",
    ]
