const core = require('@actions/core');
const github = require('@actions/github');
const simpleGit = require('simple-git');

console.log('Hello World!');

async function run() {
  try {
    const git = simpleGit();

    // GitHub Context에서 PR 정보를 가져옴
    const pullRequest = github.context.payload.pull_request;

    // 브랜치 존재 여부 확인
    if (!baseBranch || !headBranch) {
      throw new Error('Base branch or head branch does not exist.');
    }

    // 두 브랜치의 최신 커밋 ID 가져오기
    await git.fetch();
    const baseBranchCommit = await git.revparse([`origin/${baseBranch}`]);
    const headBranchCommit = await git.revparse([`origin/${headBranch}`]);

    // 커밋 ID가 유효한지 확인
    if (!baseBranchCommit || !headBranchCommit) {
      throw new Error('Failed to retrieve commit IDs for the branches.');
    }

    console.log(`Base branch commit: ${baseBranchCommit}`);
    console.log(`Head branch commit: ${headBranchCommit}`);

    // 인터페이스 추출 (예: .ts 파일만 가져오기)
    const diff = await git.diffSummary([
      "--name-only",
      "--",
      "*.ts"
    ], baseBranchCommit, headBranchCommit);

    // 동일한 경우 처리
    if (!diff.files || diff.files.length === 0) {
      console.log('No git history was changed between the branches.');
    } else {
      console.log('git diff exist');
      return diff.files.map(file => {
        console.log('commit : ', file.file);
        return file.file;
      });
    }
  } catch (error) {
    core.setFailed(`Action failed with error: ${error.message}`);
  }
}

run();
