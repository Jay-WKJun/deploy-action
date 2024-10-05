import type { DefaultLogFields, ListLogLine }  from 'simple-git';

export type Commit = DefaultLogFields & ListLogLine;

export function gatherCommitsByEmail(gitDiffs: Commit[]) {
  const commitMap = new Map<string, Commit[]>();

  gitDiffs.forEach((commit) => {
    const { author_email } = commit;
    const commits = commitMap.get(author_email);
    if (!commits) {
      commitMap.set(author_email, [commit]);
    } else {
      commitMap.set(author_email, [...commits, commit]);
    }
  });

  return commitMap;
}
