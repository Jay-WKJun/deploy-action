import { gatherCommitsByEmail, Commit } from './utils';

describe('gatherCommitsByEmail', () => {
  it('should return an empty map if no commits are provided', () => {
    const result = gatherCommitsByEmail([]);
    expect(result.size).toBe(0);
  });

  it('should group commits by author_email', () => {
    const gitDiffs: Commit[] = [
      {
        author_email: 'author1@example.com',
        author_name: 'Author One',
        body: 'Commit body 1',
        hash: 'abc123',
        message: 'First commit message',
        refs: 'refs/heads/main',
        date: '2023-10-01'
      },
      {
        author_email: 'author2@example.com',
        author_name: 'Author Two',
        body: 'Commit body 2',
        hash: 'def456',
        message: 'Second commit message',
        refs: 'refs/heads/feature',
        date: '2023-10-02'
      },
      {
        author_email: 'author1@example.com',
        author_name: 'Author One',
        body: 'Commit body 3',
        hash: 'ghi789',
        message: 'Third commit message',
        refs: 'refs/heads/main',
        date: '2023-10-03'
      }
    ];

    const result = gatherCommitsByEmail(gitDiffs);

    // 검증: 올바르게 그룹화되었는지 확인
    expect(result.size).toBe(2);
    expect(result.get('author1@example.com')).toEqual([
      gitDiffs[0],
      gitDiffs[2]
    ]);
    expect(result.get('author2@example.com')).toEqual([
      gitDiffs[1]
    ]);
  });

  it('should handle a single commit correctly', () => {
    const gitDiffs: Commit[] = [
      {
        author_email: 'author1@example.com',
        author_name: 'Author One',
        body: 'Single commit body',
        hash: 'abc123',
        message: 'Single commit message',
        refs: 'refs/heads/main',
        date: '2023-10-01'
      }
    ];

    const result = gatherCommitsByEmail(gitDiffs);
    expect(result.size).toBe(1);
    expect(result.get('author1@example.com')).toEqual([
      gitDiffs[0]
    ]);
  });
});
