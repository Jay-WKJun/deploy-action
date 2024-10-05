const { setupServer } = require('msw/node');
const { handlers } = require('./handlers');

// MSW 서버 설정
export const server = setupServer(...handlers);

// 테스트 실행 전/후에 서버를 시작/종료
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
