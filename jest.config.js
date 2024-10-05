module.exports = {
  // 테스트 파일이 위치한 경로
  roots: ['<rootDir>/src'],

  // 어떤 파일 패턴을 테스트할지 설정
  testMatch: ['**/*.test.ts'],

  // 파일을 변환하기 위한 트랜스포머 설정 (TypeScript 지원)
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },

  // 모듈 파일 확장자 설정 (TypeScript 파일 포함)
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],

  // 커버리지 수집을 위한 경로
  collectCoverageFrom: ['src/**/*.ts'],

  // Jest가 설정 파일을 찾는 방식
  moduleDirectories: ['node_modules', 'src'],

  // 테스트 환경 설정 (Node.js 환경)
  testEnvironment: 'node',
};
