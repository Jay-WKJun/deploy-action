const core = require('@actions/core');
const github = require('@actions/github');
const simpleGit = require('simple-git');

console.log('Running actionTest.js');

async function run() {
  try {
    const git = simpleGit();

    // 푸시된 브랜치 정보 가져오기
    const pushedBranch = github.context.ref.replace('refs/heads/', '');
    console.log(`Pushed to branch: ${pushedBranch}`);

    // 머지된 브랜치인 'main'이므로, 이전 커밋과 비교
    const prevCommit = await git.revparse(['HEAD~1']);  // 이전 커밋
    const latestCommit = await git.revparse(['HEAD']);  // 현재 커밋

    console.log(`Comparing commits ${prevCommit} to ${latestCommit}`);

    // 두 커밋 간 인터페이스 파일 비교 (예: .ts 파일만 가져오기)
    const interfaceFiles = await git.diffSummary(['--name-only', '--', '*.ts'], prevCommit, latestCommit);

    console.log('Interface files changed:');
    interfaceFiles.files.forEach(file => {
      console.log(file.file);
    });

    // 필요한 로직 추가 (ex: 파일 내용 파싱 후 비교)

  } catch (error) {
    core.setFailed(`Action failed with error: ${error.message}`);
  }
}

run();
