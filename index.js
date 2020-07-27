const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');
const http = require('http');
const hasha = require('hasha');

try {
    // `who-to-greet` input defined in action metadata file
    const algorithm = core.getInput('hash-type');
    var hashes = {};
    var numAwaiting = 0;
    if (github.payload.release === undefined) {
        core.setFailed("This action must be run on a release event.");
        return;
    }
    for (const asset of github.payload.release.assets) {
        numAwaiting++;
        http.get(asset.url, (res) => {
            hasha.fromStream(res, {algorithm: algorithm}).then((hash) => {
                hashes[asset.name] = hash;
                if (--numAwaiting == 0) {
                    var result = "";
                    for (const k in hashes) result += k + "  " + hashes[k] + "\n";
                    core.setOutput("hashes", result);
                    if (core.getInput("file-name") != "") fs.writeFileSync(core.getInput("file-name"), result, {encoding: "ascii"});
                }
            });
        });
    }
} catch (error) {
    core.setFailed(error.message);
}