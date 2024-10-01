const core = require('@actions/core');
const github = require('@actions/github');
const simpleGit = require('simple-git');

async function run() {
  try {
    const git = simpleGit();

    // GitHub 컨텍스트에서 pull request 정보 가져오기
    const pullRequest = github.context.payload.pull_request;

    // 머지 타겟 브랜치와 원본 브랜치 정보 추출
    const baseBranch = pullRequest.base.ref;  // 머지 타겟 브랜치 (ex: main)
    console.log(`Current branch: ${baseBranch}`);

    const headBranch = pullRequest.head.ref;  // 머지 하는 브랜치
    console.log(`Current branch: ${headBranch}`);

    // 최신 머지 커밋만 가져오기
    const mergeCommits = await git.log({ '--merges': null, n: 1 });
    mergeCommits.all.forEach(commit => {
      console.log('merged commit : ', commit);
    });
  } catch (error) {
    core.setFailed(`Action failed with error: ${error.message}`);
  }
}

run();
