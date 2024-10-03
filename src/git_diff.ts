import core from '@actions/core';
import github from '@actions/github';
import simpleGit  from 'simple-git';

export async function getGitDiff() {
  try {
    const git = simpleGit();

    // GitHub 컨텍스트에서 필요한 정보 가져오기
    const pullRequest = github.context.payload.pull_request;
    const baseBranch = pullRequest?.base.ref;  // 머지 타겟 브랜치 (ex: main)
    const headBranch = pullRequest?.head.ref;  // 원본 브랜치

    if (!pullRequest) {
      throw new Error("It's not a pull request event. Quit the action.");
    }

    // 두 브랜치의 최신 커밋 로그 가져오기
    await git.fetch();
    await git.checkout(baseBranch);
    await git.checkout(headBranch);

    // 두 브랜치의 커밋 차이 확인
    const commitLogs = await git.log([`${baseBranch}..HEAD`]);

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
  } catch (error: any) {
    core.setFailed(`Action failed with error: ${error?.message}`);
  }
}


