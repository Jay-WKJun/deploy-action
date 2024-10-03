'use strict';

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = tslib_1.__importDefault(require("@actions/core"));
const git_diff_1 = require("./git_diff");
const utils_1 = require("./utils");
const github_1 = require("./github");
function run() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const githubToken = core_1.default.getInput('GITHUB_TOKEN');
        const commentTitle = core_1.default.getInput('GIT_DIFF_COMMENT_TITLE');
        // git diff를 가져옴
        const gitDiffs = yield (0, git_diff_1.getGitDiff)();
        if (!gitDiffs)
            return;
        // git diff 내용을 이메일 별로 그룹화
        const gitDiffMap = (0, utils_1.gatherCommitsByEmail)(gitDiffs);
        // git diff를 PR 코멘트로 업데이트
        (0, github_1.upsertCommentInPullRequest)({
            githubToken,
            commentBody: JSON.stringify(gitDiffMap),
            commentTitle,
        });
    });
}
run();
