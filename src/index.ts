import core from '@actions/core';
import github from '@actions/github';
import { getGitDiff } from "./git_diff";
import { gatherCommitsByEmail, getCommitUrl } from "./utils";
import { upsertCommentInPullRequest } from './github';

async function run() {
  // GitHub 이벤트 이름을 가져옴
  const eventName = github.context.eventName;

  // 이벤트가 pull_request인지 확인
  if (eventName !== 'pull_request') {
    core.setFailed('This action only runs on pull requests event.');
    return;
  }

  try {
    const githubToken = core.getInput('GITHUB_TOKEN');
    const commentTitle = core.getInput('GIT_DIFF_COMMENT_TITLE');

    // git diff를 가져옴
    const gitDiffs = await getGitDiff();
    if (!gitDiffs) return;

    // git diff 내용을 이메일 별로 그룹화
    const gitDiffMap = gatherCommitsByEmail(gitDiffs);
    const commentBody = Array.from(gitDiffMap.entries()).map(([email, commits]) => {
      const commitStrings = commits.map(({ message, hash }) => {
        return `- [${message}](${getCommitUrl(hash)})`
      });

      const authorName = commits[0].author_name;
      return `### ${email} <${authorName}>\n${commitStrings.join('\n')}`
    }).join('\n\n');

    // git diff를 PR 코멘트로 업데이트
    upsertCommentInPullRequest({
      githubToken,
      commentBody,
      commentTitle,
    });
  } catch (error: any) {
    core.setFailed(`Action failed with error: ${error?.message}`);
  }
}

run();
