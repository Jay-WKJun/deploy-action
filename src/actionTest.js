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

    // 두 브랜치의 최신 커밋 ID 가져오기
    await git.fetch();
    // const baseBranchCommit = await git.revparse([`origin/${baseBranch}`]);
    // const headBranchCommit = await git.revparse([`origin/${headBranch}`]);

    const baseBranchLog = await git.log([`origin/${baseBranch}`]);
    const headBranchLog = await git.log(['HEAD']);

    const baseBranchCommit = baseBranchLog.latest.hash;
    const headBranchCommit = headBranchLog.latest.hash;

    // 커밋 ID가 유효한지 확인
    if (!baseBranchCommit || !headBranchCommit) {
      throw new Error('Failed to retrieve commit IDs for the branches.');
    }

    console.log(`Base branch commit: ${baseBranchCommit}`);
    console.log(`Head branch commit: ${headBranchCommit}`);

    // 두 브랜치 간의 차이 비교 (diff 사용)
    const diff = await git.diff([`origin/${bpBranch}..HEAD`]);

    if (!diff) {
      console.log(`${currentBranch} 브랜치와 ${bpBranch} 브랜치가 동일합니다. BP PR을 생성하지 않습니다.`);
      return;
    }

    console.log(`${diff}개의 커밋 차이가 있습니다. BP PR을 생성합니다.`);
  } catch (error) {
    core.setFailed(`Action failed with error: ${error.message}`);
  }
}

run();
