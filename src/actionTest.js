const core = require('@actions/core');
const github = require('@actions/github');
const simpleGit = require('simple-git');

async function run() {
  try {
    const git = simpleGit();

    // 현재 브랜치 정보 확인
    const pushedBranch = github.context.ref.replace('refs/heads/', '');
    console.log(`Pushed to branch: ${pushedBranch}`);

    // 최신 커밋 정보 확인
    const log = await git.log();
    const latestCommit = log.latest;

    // 이전 커밋이 존재하는지 확인 (HEAD~1)
    if (log.total > 1) {
      const prevCommit = await git.revparse(['HEAD~1']);
      console.log(`Comparing commits ${prevCommit} to ${latestCommit.hash}`);

      console.log('latestCommit : ', latestCommit);

      // 두 커밋 간 인터페이스 파일 비교 (예: .ts 파일만 가져오기)
      const interfaceFiles = await git.diffSummary(['--name-only', '--', '*.ts'], prevCommit, latestCommit.hash);

      console.log('Interface files changed:');
      interfaceFiles.files.forEach(file => {
        console.log(file.file);
      });
    } else {
      console.log("No previous commit found to compare with.");
    }

  } catch (error) {
    core.setFailed(`Action failed with error: ${error.message}`);
  }
}

run();
