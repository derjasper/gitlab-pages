# GitLab pages hack

This node app connects to a GitLab isntance and serves the contents of a branch as web server.

## Setup

* `npm install`
* Rename `config.json.sample` to `config.json` and fill in parameters
* `node index.js`
* All files from the `gh-pages` branches of your projects are available under `/namespace/projects/...`
