import type { DefaultLogFields, ListLogLine }  from 'simple-git';

type Commit = DefaultLogFields & ListLogLine;

export function gatherCommitsByEmail(gitDiffs: Commit[]) {
  const commitMap = new Map<string, Commit>();

  gitDiffs.forEach((commit) => {
    commitMap.set(commit.author_email, commit);
  });

  return commitMap;
}
