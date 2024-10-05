import core from '@actions/core';
import { getGitDiff } from "./git_diff";
import { gatherCommitsByEmail } from "./utils";
import { upsertCommentInPullRequest } from './github';

async function run() {
  // const githubToken = core.getInput('GITHUB_TOKEN');
  const githubToken = process.env.GITHUB_TOKEN ?? '';
  const commentTitle = core.getInput('GIT_DIFF_COMMENT_TITLE');
  console.log('githubToken',githubToken);
  console.log('commentTitle',commentTitle);

  // git diff를 가져옴
  const gitDiffs = await getGitDiff();
  if (!gitDiffs) return;

  // git diff 내용을 이메일 별로 그룹화
  const gitDiffMap = gatherCommitsByEmail(gitDiffs);

  // git diff를 PR 코멘트로 업데이트
  upsertCommentInPullRequest({
    githubToken,
    commentBody: JSON.stringify(gitDiffMap),
    commentTitle,
  });
}

run();
