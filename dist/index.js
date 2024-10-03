"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = __importDefault(require("@actions/core"));
const git_diff_1 = require("./git_diff");
const utils_1 = require("./utils");
const github_1 = require("./github");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
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
