const msw = require('msw');
const rest = msw.rest;

// GitHub API 요청 모킹
export const handlers = [
  rest.get('https://api.github.com/repos/:owner/:repo/issues', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        { id: 1, title: 'Mock issue #1' },
        { id: 2, title: 'Mock issue #2' },
      ])
    );
  }),
];
