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
    const headBranch = pullRequest.head.ref;  // 원본 브랜치 (ex: feature/new-feature)

    console.log(`Merging from branch: ${headBranch} to ${baseBranch}`);

    // 원본 브랜치 fetch
    await git.fetch(['origin', headBranch]);
    // 원본 브랜치 checkout
    await git.checkout(headBranch);
    // 원본 브랜치의 커밋 로그 가져오기
    const commitLog = await git.log();
    console.log(`Commits in ${headBranch}:`);
    commitLog.all.forEach(commit => {
      console.log(`Commit: ${commit.hash}, Message: ${commit.message}, Author: ${commit.author_name}`);
    });

  } catch (error) {
    core.setFailed(`Action failed with error: ${error.message}`);
  }
}

run();
