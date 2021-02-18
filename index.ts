import * as fs from 'fs';
import { tmpdir } from 'os';
import * as path from 'path';

import { clone, listFiles } from 'isomorphic-git';
import * as http from 'isomorphic-git/http/node';

type Fname2Content = Map<string, string>;

export const acquireGithubWiki = (url: string, to_dir: string | undefined,
                                  callback: (error?: Error, fname2content?: Fname2Content) => void) => {
    const dir: string = to_dir == null ? path.join(tmpdir(), url.slice(url.lastIndexOf('/') + 1)) : to_dir;


    clone({
        fs,
        http,
        url,
        dir,
        corsProxy: 'https://cors.isomorphic-git.org',
        ref: 'master',
        singleBranch: true,
        depth: 10,
    }).then(() =>
        listFiles({fs, dir})
            .then((files: string[]) => callback(void 0,
                new Map<string, string>(files
                    .filter((fname: string) => fname.endsWith('.md') && !fname.startsWith(`.github${path.sep}`))
                    .map((fname: string) => [
                        fname, fs.readFileSync(path.join(dir, fname), {encoding: 'utf8'})
                    ]) as any
                ))
            )
            .catch(callback))
        .catch(callback);
};


if (require.main === module) {
    acquireGithubWiki('https://github.com/isomorphic-git/isomorphic-git', void 0, (err, fname2html) => {
        if (err != null) throw err;
        console.info((fname2html as Fname2Content).keys());
    });
}
