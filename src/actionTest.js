const core = require('@actions/core');
const github = require('@actions/github');
const simpleGit = require('simple-git');

async function run() {
  try {
    // Git 인스턴스 생성
    const git = simpleGit();

    // GitHub 컨텍스트에서 필요한 정보 가져오기
    const pullRequest = github.context.payload.pull_request;
    const baseBranch = pullRequest.base.ref;  // 머지 타겟 브랜치 (ex: main)
    const headBranch = pullRequest.head.ref;  // 원본 브랜치

    console.log(`Merging from branch: ${headBranch} to ${baseBranch}`);

    // 두 브랜치의 최신 커밋 ID 가져오기
    await git.fetch();
    const baseBranchCommit = await git.revparse([`origin/${baseBranch}`]);
    const headBranchCommit = await git.revparse([`origin/${headBranch}`]);

    console.log(`Base branch commit: ${baseBranchCommit}`);
    console.log(`Head branch commit: ${headBranchCommit}`);

    // 두 브랜치의 커밋 차이 비교 (커밋 로그 가져오기)
    const diff = await git.diff([baseBranchCommit, headBranchCommit]);

    // 인터페이스 추출 (예: .ts 파일만 가져오기)
    const interfaceFiles = await git.diffSummary(['--name-only', '--', '*.ts'], baseBranchCommit, headBranchCommit);

    console.log('Interface files changed:');
    interfaceFiles.files.forEach(file => {
      console.log(file.file);
    });

    // 필요한 로직 추가 (ex: 파일 내용 파싱 후 비교 등)

  } catch (error) {
    core.setFailed(`Action failed with error: ${error.message}`);
  }
}

run();
