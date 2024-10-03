const core = require('@actions/core');
const github = require('@actions/github');
const simpleGit = require('simple-git');

async function run() {
  try {
    const git = simpleGit();

    // GitHub 컨텍스트에서 필요한 정보 가져오기
    const pullRequest = github.context.payload.pull_request;
    const baseBranch = pullRequest.base.ref;  // 머지 타겟 브랜치 (ex: main)
    const headBranch = pullRequest.head.ref;  // 원본 브랜치

    // 두 브랜치의 최신 커밋 로그 가져오기
    await git.fetch();
    await git.checkout(headBranch);

    // 두 브랜치의 커밋 차이 확인
    const commitLogs = await git.log([`origin/${baseBranch}..HEAD`]);

    if (commitLogs.total === 0) {
      console.log(`${headBranch} 브랜치와 ${baseBranch} 브랜치가 동일합니다. BP PR을 생성하지 않습니다.`);
      return;
    }

    console.log(`총 ${commitLogs.total}개의 커밋 차이가 있습니다. 커밋 정보를 출력합니다:`);

    // 각 커밋의 메타 정보 출력
    commitLogs.all.forEach(commit => {
      console.log(`-------------------------`);
      console.log(`Commit hash: ${commit.hash}`);
      console.log(`Message: ${commit.message}`);
      console.log(`Author: ${commit.author_name} <${commit.author_email}>`);
      console.log(`Date: ${commit.date}`);
    });

  } catch (error) {
    core.setFailed(`Action failed with error: ${error.message}`);
  }
}

run();
