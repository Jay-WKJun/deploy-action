import core from '@actions/core';
import { getGitDiff } from "./git_diff";
import { gatherCommitsByEmail } from "./utils";
import { upsertCommentInPullRequest } from './github';

async function run() {

  // const githubToken = core.getInput('GITHUB_TOKEN');
  console.log('process.env', process.env);
  const githubToken = process.env.GITHUB_TOKEN ?? '';
  const githubRepository = process.env.GITHUB_REPOSITORY ?? '';
  const githubRef = process.env.GITHUB_REF ?? '';
  // const commentTitle = core.getInput('GIT_DIFF_COMMENT_TITLE');
  console.log('githubToken',githubToken);
  // console.log('commentTitle',commentTitle);

  console.log('accessToken : ', process.env.ACCESS_TOKEN);

  // git diff를 가져옴
  const gitDiffs = await getGitDiff();
  if (!gitDiffs) return;

  // git diff 내용을 이메일 별로 그룹화
  const gitDiffMap = gatherCommitsByEmail(gitDiffs);
  const commentBody = Array.from(gitDiffMap.entries()).map(([email, commits]) => {
    const commitStrings = commits.map(({ author_name, message, hash }) => {
      return `- [${message} <${author_name}>](https://github.com/${githubRepository}/pull/${githubRef}/${hash})`
    });

    return `### ${email}\n${commitStrings.join('\n')}`
  }).join('\n\n');

  // git diff를 PR 코멘트로 업데이트
  upsertCommentInPullRequest({
    githubToken,
    commentBody,
    commentTitle: '추가됨',
  });
}

run();
