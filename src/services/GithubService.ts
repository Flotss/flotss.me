import {
  Collaborator,
  Commit,
  Language,
  PullRequest,
  Repo,
} from "@/types/types";
import { RateLimitError, RepoNotFoundError } from "./exception/GithubErrors";

// Define the type of repositories
type RepositoryName = {
  name: string;
};

// Define the list of repositories
// TODO : Make a backoffice to manage this list
const repositories: RepositoryName[] = [
  { name: "UpdateGenius" },
  { name: "CrazyCharlyDay" },
  { name: "ObjectAidJava" },
  { name: "NETVOD" },
  { name: "Zeldiablo" },
  { name: "TimeLineGame" },
  { name: "flotss.me" },
];

const headers: any = {
  "Content-Type": "application/json",
   Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
  "X-GitHub-Api-Version": "2022-11-28",
};

export class GithubService {
  private owner: string = "Flotss";

  /**
   * Asynchronous function to retrieve repositories.
   * @returns A promise that resolves to an array of repositories.
   */
  public async getRepos(): Promise<Repo[]> {
    let repos: Repo[] = [];

    const response = await fetch(
      `https://api.github.com/users/${this.owner}/repos`,
      { headers }
    );

    const reposResponse: any = await response.json();

    if (
      reposResponse.message &&
      reposResponse.message.includes("API rate limit exceeded")
    ) {
      throw new RateLimitError("API rate limit exceeded");
    }

    // Use Promise.all to wait for all promises to resolve
    await Promise.all(
      reposResponse.map(async (rep: any) => {
        if (repositories.some((repo) => repo.name === rep.name)) {
          repos.push(rep as Repo);
        }
      })
    );

    return repos;
  }

  /**
   * Asynchronous function to retrieve a single repository.
   * @param owner The owner of the repository.
   * @param repoName The name of the repository.
   * @returns A promise that resolves to the repository object, or null if not found.
   */
  public async getRepo(repoName: string): Promise<Repo | null> {
    let repo: Repo = {} as Repo;
    
    try {
      repo = await this.getRepoData(repoName);
    } catch (error) {
      return null;
    }

    repo.collaborators = await this.getCollaborators(repoName);
    repo.languages = await this.getLanguages(repoName);
    repo.pullRequests = await this.getPullRequests(repoName);
    repo.readme = await this.getReadme(repoName);
    repo.commits = await this.getAllCommits(repoName);

    return repo;
  }

  private async getRepoData(repoName: string): Promise<Repo> {
    const response = await fetch(
      `https://api.github.com/repos/${this.owner}/${repoName}`,
      { headers }
    );

    const reponseJson: any = await response.json();

    if (!reponseJson || reponseJson.message == "Not Found") {
      throw new RepoNotFoundError("Repository not found");
    }
    if (
      reponseJson.message &&
      reponseJson.message.includes("API rate limit exceeded")
    ) {
      throw new RateLimitError("API rate limit exceeded");
    }

    return reponseJson as Repo;
  }

  public async getCollaborators(repoName: string): Promise<Collaborator[]> {
    // Retrieve collaborators
    const collaboratorsResponse = await fetch(
      `https://api.github.com/repos/${this.owner}/${repoName}/collaborators`,
      { headers }
    );

    if (collaboratorsResponse.ok) {
      const collaboratorsJson: unknown = await collaboratorsResponse.json();
      return collaboratorsJson as Collaborator[];
    } else {
      return [];
    }
  }

  public async getLanguages(repoName: string): Promise<Language[]> {
    // Retrieve languages
    const languagesResponse = await fetch(
      `https://api.github.com/repos/${this.owner}/${repoName}/languages`,
      { headers }
    );
    if (languagesResponse.ok) {
      const languagesJson: unknown = await languagesResponse.json();
      let languages = languagesJson as any;

      const total = Object.values(languages).reduce(
        (acc: number, value: unknown) => acc + (value as number),
        0
      );

      languages = Object.keys(languages).map((key) => {
        return {
          name: key,
          percentage: Math.round(((languages[key] as number) / total) * 100),
        };
      });

      languages.sort((a: { percentage: number }, b: { percentage: number }) => {
        if (a.percentage < b.percentage) {
          return 1;
        } else if (a.percentage == b.percentage) {
          return 0;
        } else {
          return -1;
        }
      });

      return languages;
    } else {
      return [];
    }
  }

  public async getPullRequests(repoName: string): Promise<PullRequest[]> {
    // Retrieve pull requests
    const pullrequestsResponse = await fetch(
      `https://api.github.com/repos/${this.owner}/${repoName}/pulls`,
      { headers }
    );

    if (pullrequestsResponse.ok) {
      const pullrequestsJson: unknown = await pullrequestsResponse.json();
      return pullrequestsJson as PullRequest[];
    } else {
      return [];
    }
  }

  /**
   * Asynchronous function to retrieve all commits of a repository.
   * @param owner The owner of the repository.
   * @param repoName The name of the repository.
   * @returns A promise that resolves to an array of commits.
   */
  public async getAllCommits(repoName: string): Promise<any[]> {
    const per_page = 100; // Number of commits per page
    let page = 1;
    let commits: Commit[] = [];

    while (true) {
      const url = `https://api.github.com/repos/${this.owner}/${repoName}/commits?page=${page}&per_page=${per_page}`;
      const response = await fetch(url, { headers });
      const data: unknown = await response.json();
      const commitsResponse: any[] = Array.isArray(data) ? data : [];

      if (commitsResponse.length === 0) {
        break;
      }

      const commitPromises = commitsResponse.map((commit: any) => ({
        author: {
          name: commit.commit.author.name,
          date: commit.commit.author.date,
        },
        message: commit.commit.message,
        url: commit.html_url,
      }));

      const commitsToAdd = await Promise.all(commitPromises);
      commits = commits.concat(commitsToAdd);

      page++;
    }

    return commits;
  }

  public async getReadme(repoName: string): Promise<string> {
    // Retrieve README.md file
    const readmeResponse = await fetch(
      `https://raw.githubusercontent.com/${this.owner}/${repoName}/main/README.md`,
      { headers }
    );
    if (readmeResponse.ok) {
      return await readmeResponse.text();
    } else {
      return "";
    }
  }
}
