import core from '@actions/core';
import github from '@actions/github';

try {
  // 실행 중인 이벤트의 브랜치 이름을 가져옴
  const branch = github.context.ref.replace('refs/heads/', '');

  // 허용된 브랜치 리스트 (입력으로 받은 내용들)
  const subscribeBranches = core.getInput('subscribe-branches').split(',');

  // 브랜치 확인 로직
  if (subscribeBranches.includes(branch)) {
    console.log(`Action is running on subscribe branch: ${branch}`);

    // 여기서 실제 작업 로직을 추가하면 됩니다.
    // 예시로 간단한 메시지 출력
    console.log("Executing the action's core logic...");

  } else {
    // 허용되지 않은 브랜치인 경우
    console.log(`Branch ${branch} is not allowed. Action will not run.`);
    core.setOutput("result", "skipped");
  }
} catch (error) {
  core.setFailed(`Action failed with error: ${error.message}`);
}
