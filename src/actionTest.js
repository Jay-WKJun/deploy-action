const core = require('@actions/core');
const github = require('@actions/github');
const simpleGit = require('simple-git');

async function run() {
  try {
    const git = simpleGit();

    // GitHub Context에서 PR 정보를 가져옴
    const pullRequest = github.context.payload.pull_request;
    
    // 머지하려는 브랜치와 머지 대상 브랜치 이름
    const baseBranch = pullRequest.base.ref;  // 머지 타겟 브랜치 (ex: main)
    const headBranch = pullRequest.head.ref;  // 머지하려는 원본 브랜치 (ex: feature/new-feature)
    
    console.log(`Comparing changes between ${headBranch} and ${baseBranch}`);
    
    // 두 브랜치 간의 커밋 차이 가져오기
    await git.fetch();
    
    // 차이가 있는 커밋들 가져오기
    const commitsDiff = await git.log([`${baseBranch}..${headBranch}`]);

    console.log(`Commits between ${headBranch} and ${baseBranch}:`);
    commitsDiff.all.forEach(commit => {
      console.log(`Commit: ${commit.hash}, Message: ${commit.message}, Author: ${commit.author_name}`);
    });

  } catch (error) {
    core.setFailed(`Action failed with error: ${error.message}`);
  }
}

run();
