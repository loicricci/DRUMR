import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

export interface GitHubSnapshot {
  recentCommits: Array<{
    sha: string;
    message: string;
    date: string;
    author: string;
  }>;
  openIssueCount: number;
  lastDeployDate: string | null;
}

export async function fetchGitHubSnapshot(
  repo: string
): Promise<GitHubSnapshot> {
  const [owner, name] = repo.split("/");
  if (!owner || !name) {
    return {
      recentCommits: [],
      openIssueCount: 0,
      lastDeployDate: null,
    };
  }

  try {
    const [commitsRes, issuesRes, deploymentsRes] = await Promise.allSettled([
      octokit.repos.listCommits({
        owner,
        repo: name,
        per_page: 5,
      }),
      octokit.issues.listForRepo({
        owner,
        repo: name,
        state: "open",
        per_page: 1,
      }),
      octokit.repos.listDeployments({
        owner,
        repo: name,
        per_page: 1,
      }),
    ]);

    const recentCommits =
      commitsRes.status === "fulfilled"
        ? commitsRes.value.data.map((c) => ({
            sha: c.sha.slice(0, 7),
            message: c.commit.message.split("\n")[0],
            date: c.commit.committer?.date ?? "",
            author: c.commit.author?.name ?? "",
          }))
        : [];

    const openIssueCount =
      issuesRes.status === "fulfilled"
        ? parseInt(
            issuesRes.value.headers["x-total-count"] ?? "0",
            10
          ) || issuesRes.value.data.length
        : 0;

    const lastDeployDate =
      deploymentsRes.status === "fulfilled" &&
      deploymentsRes.value.data.length > 0
        ? deploymentsRes.value.data[0].created_at
        : null;

    return { recentCommits, openIssueCount, lastDeployDate };
  } catch {
    return {
      recentCommits: [],
      openIssueCount: 0,
      lastDeployDate: null,
    };
  }
}
