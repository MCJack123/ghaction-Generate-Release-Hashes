import core from "@actions/core";
import github from "@actions/github";
import fs from "fs";
import hasha from "hasha";
import fetch from "node-fetch";

const algorithm = core.getInput('hash-type');
const filename = core.getInput("file-name");
var hashes = {};
var numAwaiting = 0;

function run(assets) {
    for (const asset of assets) {
        if (filename === "" || asset.name !== filename) { // don't hash the hash file (if the file has the same name)
            numAwaiting++;
            fetch(asset.browser_download_url).then(res => res.arrayBuffer()).then(buffer => {
                hashes[asset.name] = hasha(buffer, {algorithm: algorithm});
                if (--numAwaiting === 0) {
                    let result = "";
                    for (const k in hashes) result += hashes[k] + "  " + k + "\n";
                    core.setOutput("hashes", result);
                    if (filename !== "") fs.writeFileSync(filename, result, {encoding: "ascii"});
                }
            });
        }
    }
}

try {
    if (github.context.payload.release === undefined)
        core.setFailed("This action must be run on a release event.");
    else if (core.getInput('get-assets') === 'true')
        fetch(github.context.payload.release.url).then(res => res.json()).then(data => run(data.assets));
    else run(github.context.payload.release.assets);
} catch (error) {
    core.setFailed(error.message);
}
