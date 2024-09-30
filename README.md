# deploy-action

## 문제

배포 노티시 매번 PR을 확인해서 누가 뭘 했는지 알아내서 직접 정리해야함. = 번거로움

## 해결 및 Action의 요구사항

배포가 필요한 branch 인식, 전 history와 비교해서 새로 추가된 commit을 기여자 별로 정리해서 slack 노티

- 배포 PR이 올라오면 감지 (입력 받을 수 있음)
- 누가 무엇을 했는지 commit들을 읽어 정리, Hierachy = 사람 - commit들...
- 갱신시 Slack 메시지 갱신
  - PR 본문에 Slack 스레드의 고유값을 가지고 있음.
  - PR이 갱신되면 위 Process를 다시해서 slack 스레드를 갱신
- 배포 되면 노티 정리.
