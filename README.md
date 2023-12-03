# kakao-chat-ci
🌱 Github Event를 kakao talk으로 전송하는 Git action 사이드 프로젝트

## 프로젝트 로그


## Trouble Shooting
- puppeteer `page.goto()` 호출 시, `Requesting main frame too early!` 에러 발생 (`23.12.02)
  - (해결) 버전 `v21.0.3` → `v21.5.0`으로 변경
