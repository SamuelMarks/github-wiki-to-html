"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.acquireGithubWiki = void 0;
const fs = __importStar(require("fs"));
const os_1 = require("os");
const path = __importStar(require("path"));
const isomorphic_git_1 = require("isomorphic-git");
const http = __importStar(require("isomorphic-git/http/node"));
const acquireGithubWiki = (url, to_dir, callback) => {
    const dir = to_dir == null ? path.join(os_1.tmpdir(), url.slice(url.lastIndexOf('/') + 1)) : to_dir;
    isomorphic_git_1.clone({
        fs,
        http,
        url,
        dir,
        corsProxy: 'https://cors.isomorphic-git.org',
        ref: 'master',
        singleBranch: true,
        depth: 10,
    }).then(() => isomorphic_git_1.listFiles({ fs, dir })
        .then((files) => callback(void 0, new Map(files
        .filter((fname) => fname.endsWith('.md') && !fname.startsWith(`.github${path.sep}`))
        .map((fname) => [
        fname, fs.readFileSync(path.join(dir, fname), { encoding: 'utf8' })
    ]))))
        .catch(callback))
        .catch(callback);
};
exports.acquireGithubWiki = acquireGithubWiki;
if (require.main === module) {
    exports.acquireGithubWiki('https://github.com/isomorphic-git/isomorphic-git', void 0, (err, fname2html) => {
        if (err != null)
            throw err;
        console.info(fname2html.keys());
    });
}
