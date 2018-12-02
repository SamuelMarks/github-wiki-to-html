github-wiki-to-html
===================
GitHub wiki to HTML.

## Install

    npm i -S https://api.github.com/repos/SamuelMarks/github-wiki-to-html/tarball

## Usage

```typescript
import { acquireGithubWiki } from 'github-wiki-to-html';

acquireGithubWiki('https://github.com/isomorphic-git/isomorphic-git', void 0, (err, fname2html) => {
    if (err != null) throw err;
    console.info(fname2html);
});
```
