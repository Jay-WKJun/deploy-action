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
exports.upsertCommentInPullRequest = upsertCommentInPullRequest;
const github_1 = __importDefault(require("@actions/github"));
function upsertCommentInPullRequest(_a) {
    return __awaiter(this, arguments, void 0, function* ({ commentBody, commentTitle = 'Generated Comment', githubToken, }) {
        // Octokit 인스턴스 생성
        const octokit = github_1.default.getOctokit(githubToken);
        // GitHub Context에서 PR 정보 가져오기
        const { owner, repo } = github_1.default.context.repo;
        const pullRequest = github_1.default.context.payload.pull_request;
        const pullRequestNumber = pullRequest === null || pullRequest === void 0 ? void 0 : pullRequest.number;
        if (pullRequestNumber == null) {
            throw new Error("It's not a pull request event. Quit the action.");
        }
        // PR 코멘트들을 모두 조회
        const { data: comments } = yield octokit.rest.issues.listComments({
            owner,
            repo,
            issue_number: pullRequestNumber,
        });
        // 기존 코멘트 확인
        const existingComment = comments.find((comment) => { var _a; return (_a = comment.body) === null || _a === void 0 ? void 0 : _a.includes(commentTitle); });
        if (existingComment) {
            // 기존 코멘트 업데이트
            yield octokit.rest.issues.updateComment({
                owner,
                repo,
                comment_id: existingComment.id,
                body: `[${commentTitle}]\n-----------\n${commentBody}`,
            });
            console.log(`Comment is updated ${existingComment.id}`);
        }
        else {
            // 새로운 코멘트 생성
            yield octokit.rest.issues.createComment({
                owner,
                repo,
                issue_number: pullRequestNumber,
                body: `[${commentTitle}]\n-----------\n${commentBody}`,
            });
            console.log("New comment has been created");
        }
    });
}
