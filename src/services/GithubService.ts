import { Collaborator, Commit, Language, PullRequest, Repo } from '@/types/types';
import { createIfNotExists, sortRepos } from '@/utils/RepoUtils';
import { PrismaClient } from '@prisma/client';
import assert from 'assert';
import { isValidRepoName, isValidUserName } from '@/utils/ValidationUtils';
import { GithubError, RateLimitError, RepoNotFoundError } from './exception/GithubErrors';

const headers: any = {
  Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
};
export const owner: string = 'Flotss';

export class GithubService {
  private prisma: PrismaClient = new PrismaClient();

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
      `The number of repositories fetched does not match the total count {${total_count} | ${reposResponse.items.length}} ${reposResponse.toString()}`,
    );

    // Map to sanitized Repo objects with only relevant fields
    const pinnedRepos = await this.getPinnedRepos();
    const pinnedSet = new Set(pinnedRepos);

    repos = reposResponse.items.map(
      (rep: any) =>
        ({
          id: rep.id,
          name: rep.name,
          description: rep.description ?? '',
          url: rep.html_url || rep.url || '',
          html_url: rep.html_url || rep.url || '',
          created_at: rep.created_at ?? '',
          updated_at: rep.updated_at ?? '',
          stargazers_count: rep.stargazers_count ?? 0,
          archived: Boolean(rep.archived),
          language: rep.language ?? '',
          homepage: rep.homepage ?? '',
          git_url: rep.git_url ?? '',
          ssh_url: rep.ssh_url ?? '',
          clone_url: rep.clone_url ?? '',
          svn_url: rep.svn_url ?? '',
          fork: Boolean(rep.fork),
          open_issues_count: rep.open_issues_count ?? 0,
          license: rep.license?.name || rep.license || '',
          subscribers_count: rep.subscribers_count ?? 0,
          forks_count: rep.forks_count ?? 0,
          watchers_count: rep.watchers_count ?? rep.stargazers_count ?? 0,
          private: Boolean(rep.private),
          pinned: pinnedSet.has(rep.name),
          collaborators: [],
          languages: [],
          pullRequests: [],
          commits: [],
          readme: '',
        }) as Repo,
    );

    await createIfNotExists(repos);
    repos = await this.enrichReposDb(repos);
    repos = sortRepos(repos);

    return repos;
  }

  private async enrichReposDb(repos: Repo[]): Promise<Repo[]> {
    try {
      // GET ALL REPOS IN DB
      const reposDB = await this.prisma.repoDB.findMany();
      const mapRepoDb = new Map(reposDB.map((r) => [r.repoId, r]));

      // Filter visible repos
      repos = repos.filter((repo) => mapRepoDb.get(repo.id)?.visible ?? true);

      // Set descriptions
      repos.forEach((repo) => {
        const repoDb = mapRepoDb.get(repo.id);
        const description = repoDb?.description;

        if (repoDb && description) {
          repo.description = description;
        }
      });
    } catch (dbError) {
      console.warn('Could not enrich repos from DB:', dbError);
    }

    return repos;
  }

  private async enrichRepoDb(repo: Repo): Promise<Repo> {
    try {
      // GET REPO IN DB
      const repoDb = await this.prisma.repoDB.findFirst({
        where: {
          repoId: repo.id,
        },
      });

      // Set descriptions
      if (repoDb && repoDb.description) {
        repo.description = repoDb.description;
      }
    } catch (dbError) {
      console.warn('Could not enrich repo from DB:', dbError);
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
  private sanitizeRepoName(repoName: string): string {
    if (!isValidRepoName(repoName)) {
      throw new RepoNotFoundError('Invalid repository name');
    }
    return encodeURIComponent(repoName);
  }

  private sanitizeUserName(userName: string): string {
    if (!isValidUserName(userName)) {
      throw new GithubError('Invalid username');
    }
    return encodeURIComponent(userName);
  }

  public async getRepo(repoName: string): Promise<Repo | null> {
    if (!isValidRepoName(repoName)) {
      return null;
    }

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

    repo = await this.enrichRepoDb(repo);

    return repo;
  }

  private async getRepoData(repoName: string): Promise<Repo> {
    const safeRepo = this.sanitizeRepoName(repoName);
    const safeOwner = encodeURIComponent(owner);
    const url = new URL(`https://api.github.com/repos/${safeOwner}/${safeRepo}`);

    const response = await fetch(url.toString(), {
      headers,
    });

    const reponseJson: any = await response.json();

    if (!reponseJson || reponseJson.message == 'Not Found') {
      throw new RepoNotFoundError('Repository not found');
    }
    if (reponseJson.message && reponseJson.message.includes('API rate limit exceeded')) {
      throw new RateLimitError('API rate limit exceeded');
    }

    return {
      id: reponseJson.id,
      name: reponseJson.name,
      description: reponseJson.description ?? '',
      url: reponseJson.html_url || reponseJson.url || '',
      html_url: reponseJson.html_url || reponseJson.url || '',
      created_at: reponseJson.created_at,
      updated_at: reponseJson.updated_at,
      stargazers_count: reponseJson.stargazers_count ?? 0,
      archived: Boolean(reponseJson.archived),
      language: reponseJson.language ?? '',
      homepage: reponseJson.homepage ?? '',
      git_url: reponseJson.git_url ?? '',
      ssh_url: reponseJson.ssh_url ?? '',
      clone_url: reponseJson.clone_url ?? '',
      svn_url: reponseJson.svn_url ?? '',
      fork: Boolean(reponseJson.fork),
      open_issues_count: reponseJson.open_issues_count ?? 0,
      license: reponseJson.license,
      subscribers_count: reponseJson.subscribers_count ?? 0,
      forks_count: reponseJson.forks_count ?? 0,
      watchers_count: reponseJson.watchers_count ?? reponseJson.stargazers_count ?? 0,
      private: Boolean(reponseJson.private),
      pinned: false,
      collaborators: [],
      languages: [],
      pullRequests: [],
      commits: [],
      readme: '',
    } as Repo;
  }

  public async getCollaborators(repoName: string): Promise<Collaborator[]> {
    if (!isValidRepoName(repoName)) {
      return [];
    }

    const safeRepo = this.sanitizeRepoName(repoName);
    const safeOwner = encodeURIComponent(owner);
    const url = new URL(`https://api.github.com/repos/${safeOwner}/${safeRepo}/collaborators`);

    // Retrieve collaborators
    const collaboratorsResponse = await fetch(url.toString(), { headers });

    if (collaboratorsResponse.ok) {
      const collaboratorsJson: unknown = await collaboratorsResponse.json();
      return collaboratorsJson as Collaborator[];
    } else {
      return [];
    }
  }

  public async getLanguages(repoName: string): Promise<Language[]> {
    if (!isValidRepoName(repoName)) {
      return [];
    }

    const safeRepo = this.sanitizeRepoName(repoName);
    const safeOwner = encodeURIComponent(owner);
    const url = new URL(`https://api.github.com/repos/${safeOwner}/${safeRepo}/languages`);

    // Retrieve languages
    const languagesResponse = await fetch(url.toString(), { headers });
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
    if (!isValidRepoName(repoName)) {
      return [];
    }

    const safeRepo = this.sanitizeRepoName(repoName);
    const safeOwner = encodeURIComponent(owner);
    const url = new URL(`https://api.github.com/repos/${safeOwner}/${safeRepo}/pulls`);

    // Retrieve pull requests
    const pullrequestsResponse = await fetch(url.toString(), { headers });

    if (pullrequestsResponse.ok) {
      const pullrequestsJson: unknown = await pullrequestsResponse.json();
      if (!Array.isArray(pullrequestsJson)) return [];
      return pullrequestsJson.map((pr: any) => ({
        id: pr.id,
        node_id: pr.node_id || '',
        number: pr.number,
        title: pr.title || '',
        url: pr.url || '',
        html_url: pr.html_url || '',
        diff_url: pr.diff_url || '',
        patch_url: pr.patch_url || '',
        issue_url: pr.issue_url || '',
        body: pr.body ? pr.body.slice(0, 500) : '',
        user: {
          login: pr.user?.login || '',
          avatar_url: pr.user?.avatar_url || '',
          url: pr.user?.url || '',
          html_url: pr.user?.html_url || '',
        },
      })) as PullRequest[];
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
    const safeRepo = this.sanitizeRepoName(repoName);
    const safeOwner = encodeURIComponent(owner);
    const per_page = 100; // Number of commits per page
    let page = 1;
    let commits: Commit[] = [];

    let pageEnd = false;
    while (!pageEnd) {
      const url = new URL(
        `https://api.github.com/repos/${safeOwner}/${safeRepo}/commits?page=${page}&per_page=${per_page}`,
      );
      const response = await fetch(url.toString(), { headers });

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
    if (!isValidRepoName(repoName)) {
      return '';
    }

    const safeRepo = this.sanitizeRepoName(repoName);
    const safeOwner = encodeURIComponent(owner);
    const url = new URL(
      `https://raw.githubusercontent.com/${safeOwner}/${safeRepo}/main/README.md`,
    );

    // Retrieve README.md file
    const readmeResponse = await fetch(url.toString(), { headers });
    if (readmeResponse.ok) {
      return await readmeResponse.text();
    } else {
      return '';
    }
  }

  public async getUser(name: string): Promise<any> {
    const safeUser = this.sanitizeUserName(name);
    const url = new URL(`https://api.github.com/users/${safeUser}`);
    const response = await fetch(url.toString(), { headers });
    const user = await response.json();
    if (!user || user.message) {
      return null;
    }
    return {
      login: user.login,
      avatar_url: user.avatar_url,
      html_url: user.html_url,
      name: user.name,
      bio: user.bio,
      public_repos: user.public_repos,
      followers: user.followers,
      following: user.following,
    };
  }
}
