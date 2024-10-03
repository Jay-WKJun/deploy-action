import core from '@actions/core';
import github from '@actions/github';

interface UpdateCommentInPullRequestProps {
  githubToken: string;
  commentTitle: string;
  commentBody: string;
}

export async function upsertCommentInPullRequest({
  commentBody,
  commentTitle = 'Generated Comment',
  githubToken,
}: UpdateCommentInPullRequestProps) {
  // Octokit 인스턴스 생성
  const octokit = github.getOctokit(githubToken);

  // GitHub Context에서 PR 정보 가져오기
  const { owner, repo } = github.context.repo;
  const pullRequest = github.context.payload.pull_request;
  const pullRequestNumber = pullRequest?.number;
  if (pullRequestNumber == null) {
    throw new Error("It's not a pull request event. Quit the action.");
  }

  // PR 코멘트들을 모두 조회
  const { data: comments } = await octokit.rest.issues.listComments({
    owner,
    repo,
    issue_number: pullRequestNumber,
  });

  // 기존 코멘트 확인
  const existingComment = comments.find(
    (comment) => comment.body?.includes(commentTitle)
  );

  if (existingComment) {
    // 기존 코멘트 업데이트
    await octokit.rest.issues.updateComment({
      owner,
      repo,
      comment_id: existingComment.id,
      body: `[${commentTitle}]\n-----------\n${commentBody}`,
    });
    console.log(`Comment is updated ${existingComment.id}`);
  } else {
    // 새로운 코멘트 생성
    await octokit.rest.issues.createComment({
      owner,
      repo,
      issue_number: pullRequestNumber,
      body: `[${commentTitle}]\n-----------\n${commentBody}`,
    });
    console.log("New comment has been created");
  }
}
