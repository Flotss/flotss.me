import { Collaborator, Commit, Language, PullRequest, Repo } from '@/types/types';
import { createIfNotExists } from '@/utils/RepoUtils';
import { PrismaClient } from '@prisma/client';
import assert from 'assert';
import { GithubError, RateLimitError, RepoNotFoundError } from './exception/GithubErrors';

const headers: any = {
  Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
};
export const owner: string = 'Flotss';

export class GithubService {
  /**
   * Asynchronous function to retrieve repositories.
   * @returns A promise that resolves to an array of repositories.
   */
  public async getRepos(): Promise<Repo[]> {
    let repos: Repo[] = [];

    // Fetch repositories
    let page = 1;
    let reposResponse: any = {
      items: [],
    };
    let total_count = 0;
    let response;

    do {
      response = await fetch(
        `https://api.github.com/search/repositories?q=user:${owner}+fork:true&page=${page}`,
        {
          headers,
        },
      );

      const data = await response.json();

      if (data.message && data.message.includes('API rate limit exceeded')) {
        throw new RateLimitError('API rate limit exceeded');
      }

      if (data.message) {
        throw new GithubError(data.message);
      }

      if (total_count == 0) {
        total_count = data.total_count;
      }

      reposResponse.items = reposResponse.items.concat(data.items);
      page++;
    } while (response.ok && reposResponse.items.length < total_count);

    assert(
      total_count === reposResponse.items.length,
      `Before Pinned : The number of repositories fetched does not match the total count {${total_count} | ${reposResponse.items.length}} ${reposResponse.toString()}`,
    );

    // Use Promise.all to wait for all promises to resolve
    const pinnedRepos = await this.getPinnedRepos();
    await Promise.all(
      reposResponse.items.map(async (rep: any) => {
        repos.push({ ...rep, pinned: pinnedRepos.includes(rep.name) } as Repo);
      }),
    );

    assert(
      total_count === repos.length,
      'After Pinned : The number of repositories fetched does not match the total count',
    );

    createIfNotExists(repos);
    repos = await GithubService.setDescriptions(repos);

    assert(
      total_count === repos.length,
      'The number of repositories fetched does not match the total count',
    );

    return repos;
  }

  private static async setDescriptions(repos: Repo[]): Promise<Repo[]> {
    const prisma = new PrismaClient();

    // GET ALL DESCRIPTIONS
    const descriptions = await prisma.repoDB.findMany();

    // Set descriptions
    repos.forEach(async (repo) => {
      const description = descriptions.find((d) => d.repoId === repo.id);
      if (description) {
        repo.description = description.description ?? repo.description;
      }
    });

    return repos;
  }

  private async setDescription(repo: Repo): Promise<Repo> {
    const prisma = new PrismaClient();

    // GET ALL DESCRIPTIONS
    const description = await prisma.repoDB.findFirst({
      where: {
        repoId: repo.id,
      },
    });

    // Set descriptions
    if (description) {
      repo.description = description.description ?? repo.description;
    }

    return repo;
  }

  private async getPinnedRepos(): Promise<string[]> {
    // Fetch pinned repositories GraphQL query
    const query = {
      query: `{
        user(login: "${owner}") {
          pinnedItems(first: 6, types: REPOSITORY) {
            nodes {
              ... on Repository {
                name
              }
            }
          }
        }
      }`,
    };

    try {
      const response = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        },
        body: JSON.stringify(query),
      });

      if (response.status === 401) {
        throw new Error('Bad credentials. Please check your GitHub token.');
      }

      const data = await response.json();

      if (data.errors) {
        console.error(data.errors);
        throw new Error('Error fetching data from GitHub GraphQL API.');
      }

      return data.data.user.pinnedItems.nodes.map((repo: any) => repo.name);
    } catch (error) {
      /* empty */
    }

    return [];
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

    repo.collaborators = await (
      await this.getCollaborators(repoName)
    ).sort(
      // IF owner is first, return -1, else return 1
      (a, b) => (a.login === owner ? -1 : b.login === owner ? 1 : 0),
    );
    repo.languages = await this.getLanguages(repoName);
    repo.pullRequests = await this.getPullRequests(repoName);
    repo.readme = await this.getReadme(repoName);

    repo = await this.setDescription(repo);

    return repo;
  }

  private async getRepoData(repoName: string): Promise<Repo> {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repoName}`, {
      headers,
    });

    const reponseJson: any = await response.json();

    if (!reponseJson || reponseJson.message == 'Not Found') {
      throw new RepoNotFoundError('Repository not found');
    }
    if (reponseJson.message && reponseJson.message.includes('API rate limit exceeded')) {
      throw new RateLimitError('API rate limit exceeded');
    }

    return reponseJson as Repo;
  }

  public async getCollaborators(repoName: string): Promise<Collaborator[]> {
    // Retrieve collaborators
    const collaboratorsResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repoName}/collaborators`,
      { headers },
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
      `https://api.github.com/repos/${owner}/${repoName}/languages`,
      { headers },
    );
    if (languagesResponse.ok) {
      const languagesJson: unknown = await languagesResponse.json();
      let languages = languagesJson as any;

      const total = Object.values(languages).reduce(
        (acc: number, value: unknown) => acc + (value as number),
        0,
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
      `https://api.github.com/repos/${owner}/${repoName}/pulls`,
      { headers },
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

    let pageEnd = false;
    while (!pageEnd) {
      const url = `https://api.github.com/repos/${owner}/${repoName}/commits?page=${page}&per_page=${per_page}`;
      const response = await fetch(url, { headers });

      if (response.status === 404) {
        throw new RepoNotFoundError('Repository not found');
      }

      const data: unknown = await response.json();

      const commitsResponse: any[] = Array.isArray(data) ? data : [];

      if (commitsResponse.length === 0) {
        pageEnd = true;
        continue;
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
      `https://raw.githubusercontent.com/${owner}/${repoName}/main/README.md`,
      { headers },
    );
    if (readmeResponse.ok) {
      return await readmeResponse.text();
    } else {
      return '';
    }
  }

  public async getUser(name: string): Promise<any> {
    const response = await fetch(`https://api.github.com/users/${name}`, { headers });
    const user = await response.json();
    return user;
  }
}
