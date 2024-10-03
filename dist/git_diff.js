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
exports.getGitDiff = getGitDiff;
const core_1 = __importDefault(require("@actions/core"));
const github_1 = __importDefault(require("@actions/github"));
const simple_git_1 = __importDefault(require("simple-git"));
function getGitDiff() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const git = (0, simple_git_1.default)();
            // GitHub 컨텍스트에서 필요한 정보 가져오기
            const pullRequest = github_1.default.context.payload.pull_request;
            const baseBranch = pullRequest === null || pullRequest === void 0 ? void 0 : pullRequest.base.ref; // 머지 타겟 브랜치 (ex: main)
            const headBranch = pullRequest === null || pullRequest === void 0 ? void 0 : pullRequest.head.ref; // 원본 브랜치
            if (!pullRequest) {
                throw new Error("It's not a pull request event. Quit the action.");
            }
            // 두 브랜치의 최신 커밋 로그 가져오기
            yield git.fetch();
            yield git.checkout(baseBranch);
            yield git.checkout(headBranch);
            // 두 브랜치의 커밋 차이 확인
            const commitLogs = yield git.log([`${baseBranch}..HEAD`]);
            if (commitLogs.total === 0) {
                console.log(`${headBranch} branch history & ${baseBranch} branch history is same.`);
                return;
            }
            console.log(`Total ${commitLogs.total} of git diff exists`);
            // 각 커밋의 메타 정보 출력
            return commitLogs.all.map(commit => {
                console.log(`-------------------------`);
                console.log(`Commit hash: ${commit.hash}`);
                console.log(`Message: ${commit.message}`);
                console.log(`Author: ${commit.author_name} <${commit.author_email}>`);
                console.log(`Date: ${commit.date}`);
                return commit;
            });
        }
        catch (error) {
            core_1.default.setFailed(`Action failed with error: ${error === null || error === void 0 ? void 0 : error.message}`);
        }
    });
}
