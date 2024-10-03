"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gatherCommitsByEmail = gatherCommitsByEmail;
function gatherCommitsByEmail(gitDiffs) {
    const commitMap = new Map();
    gitDiffs.forEach((commit) => {
        commitMap.set(commit.author_email, commit);
    });
    return commitMap;
}
