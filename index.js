"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const os_1 = require("os");
const git = __importStar(require("isomorphic-git"));
const path = __importStar(require("path"));
git.plugins.set('fs', fs);
exports.acquireGithubWiki = (url, to_dir, callback) => {
    const dir = to_dir || path.join(os_1.tmpdir(), url.slice(url.lastIndexOf('/') + 1));
    git
        .clone({
        dir, url,
        corsProxy: 'https://cors.isomorphic-git.org',
        ref: 'master',
        singleBranch: true,
        depth: 10
    })
        .then(() => git
        .listFiles({ fs, dir })
        .then((files) => callback(void 0, new Map(files
        .filter((fname) => fname.endsWith('.md') && !fname.startsWith(`.github${path.sep}`))
        .map((fname) => [
        fname, fs.readFileSync(path.join(dir, fname), { encoding: 'utf8' })
    ]))))
        .catch(callback))
        .catch(callback);
};
if (require.main === module) {
    exports.acquireGithubWiki('https://github.com/isomorphic-git/isomorphic-git', void 0, (err, fname2html) => {
        if (err != null)
            throw err;
        console.info(fname2html.keys());
    });
}
