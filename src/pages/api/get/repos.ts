import { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";
import { Collaborator, Commit, Repo } from "@/types/types";
import headers from "../headersApiGithub";

// Define the type of repositories
type RepositoryName = {
  name: string;
};

// Define the list of repositories
const repositories: RepositoryName[] = [
  { name: "UpdateGenius" },
  { name: "CrazyCharlyDay" },
  { name: "ObjectAidJava" },
  { name: "NETVOD" },
  { name: "Zeldiablo" },
  { name: "TimeLineGame" },
  { name: "flotss.me" },
];

/**
 * Handler function for the API endpoint.
 * Retrieves repositories based on the owner and name query parameters.
 * Returns a single repository if name is provided, otherwise returns a list of repositories.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Repo[] | Repo | { message: string }>
) {
  const owner = "Flotss";

  const { name } = req.query;
  try {
    if (name != undefined) {
      const repo = await getRepo(owner, name as string);
      if (repo) {
        res.status(200).json(repo);
      } else {
        res.status(404).json({ message: "Repo not found" });
      }
      return;
    }

    let repos: Repo[];
    repos = await getRepos(owner);

    if (repos.length === 0) {
      res.status(404).json([]);
      return;
    }

    repos.sort((a, b) => {
      if (a.archived && !b.archived) {
        return 1;
      } else if (a.archived == b.archived) {
        return 0;
      } else {
        return -1;
      }
    });

    res.status(200).json(repos);
  } catch (e: any) {
    res.status(400).json({ message: e.message + " from repos.ts " + e.name });
    return;
  }
  return;
}

/**
 * Asynchronous function to retrieve repositories.
 * @param owner The owner of the repositories.
 * @returns A promise that resolves to an array of repositories.
 */
async function getRepos(owner: string): Promise<Repo[]> {
  let repos: Repo[] = [];

  const response = await fetch(`https://api.github.com/users/${owner}/repos`, {
    headers,
  });
  const reposResponse: any = await response.json();

  if (
    reposResponse.message &&
    reposResponse.message.includes("API rate limit exceeded")
  ) {
    throw new Error("API rate limit exceeded");
  }

  // Use Promise.all to wait for all promises to resolve
  await Promise.all(
    reposResponse.map(async (rep: any) => {
      if (repositories.some((repo) => repo.name === rep.name)) {
        let repo: Repo = {
          id: rep.id,
          name: rep.name,
          description: rep.description,
          url: rep.url,
          html_url: rep.html_url,
          created_at: rep.created_at,
          updated_at: rep.updated_at,
          stars: rep.stargazers_count,
          archived: rep.archived,
          language: "",
          homepage: "",
          git_url: "",
          ssh_url: "",
          clone_url: "",
          svn_url: "",
          forked: false,
          commits: [],
          readme: "",
          owner: {
            login: "",
            avatar_url: "",
            url: "",
            html_url: ""
          },
          collaborators: [],
          languages: [],
          pullrequests: [],
          open_issues_count: 0,
          license: "",
          subscribers_count: 0,
          forks_count: 0,
          watchers_count: 0
        };
        repos.push(repo);
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
async function getRepo(owner: string, repoName: string): Promise<Repo | null> {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repoName}`,
    { headers }
  );

  const reponseJson: any = await response.json();

  if (!reponseJson || reponseJson.message == "Not Found") {
    return null;
  }
  if (
    reponseJson.message &&
    reponseJson.message.includes("API rate limit exceeded")
  ) {
    throw new Error("API rate limit exceeded");
  }

  const commits = await getAllCommits(owner, repoName);

  const repo: Repo = {
    id: reponseJson.id,
    name: reponseJson.name,
    description: reponseJson.description,
    url: reponseJson.url,
    html_url: reponseJson.html_url,
    created_at: reponseJson.created_at,
    updated_at: reponseJson.updated_at,
    stars: reponseJson.stargazers_count,
    archived: reponseJson.archived,
    language: reponseJson.language,
    homepage: reponseJson.homepage,
    git_url: reponseJson.git_url,
    ssh_url: reponseJson.ssh_url,
    clone_url: reponseJson.clone_url,
    svn_url: reponseJson.svn_url,
    forked: reponseJson.fork,
    commits: commits,
    collaborators: [],
    languages: [],
    pullrequests: [],
    open_issues_count: reponseJson.open_issues_count,
    license: reponseJson.license ? reponseJson.license.name : "",
    subscribers_count: reponseJson.subscribers_count,
    forks_count: reponseJson.forks_count,
    watchers_count: reponseJson.watchers_count,
    readme: "",
    owner: {
      login: "",
      avatar_url: "",
      url: "",
      html_url: ""
    }
  };


  if (reponseJson.owner) {
    repo.owner = {
      login: reponseJson.owner.login,
      avatar_url: reponseJson.owner.avatar_url,
      url: reponseJson.owner.url,
      html_url: reponseJson.owner.html_url,
    };
  }

  // Retrieve collaborators
  const collaboratorsResponse = await fetch(
    `https://api.github.com/repos/${owner}/${repoName}/collaborators`,
    { headers }
  );

  if (collaboratorsResponse.ok) {
    const collaboratorsJson: unknown = await collaboratorsResponse.json();
    const collaborators: any[] = collaboratorsJson as any[];

    repo.collaborators = collaborators.map((collaborator) => {
      const collaboratorNew: Collaborator = {
        login: collaborator.login,
        avatar_url: collaborator.avatar_url,
        url: collaborator.url,
        html_url: collaborator.html_url,
      };
      return collaboratorNew;
    });
  } else {
    repo.collaborators = [];
  }

  // Retrieve languages
  const languagesResponse = await fetch(
    `https://api.github.com/repos/${owner}/${repoName}/languages`,
    { headers }
  );
  if (languagesResponse.ok) {
    const languagesJson: unknown = await languagesResponse.json();
    const languages: any = languagesJson as any;

    const total = Object.values(languages).reduce(
      (acc: number, value: unknown) => acc + (value as number),
      0
    );

    repo.languages = Object.keys(languages).map((key) => {
      return {
        name: key,
        percentage: Math.round(((languages[key] as number) / total) * 100),
      };
    });

    repo.languages.sort((a, b) => {
      if (a.percentage < b.percentage) {
        return 1;
      } else if (a.percentage == b.percentage) {
        return 0;
      } else {
        return -1;
      }
    });
  } else {
    repo.languages = [];
  }

  // Retrieve pull requests
  const pullrequestsResponse = await fetch(
    `https://api.github.com/repos/${owner}/${repoName}/pulls`,
    { headers }
  );

  if (pullrequestsResponse.ok) {
    const pullrequestsJson: unknown = await pullrequestsResponse.json();
    const pullrequests: any[] = pullrequestsJson as any[];

    repo.pullrequests = pullrequests.map((pullrequest) => {
      return {
        url: pullrequest.url,
        id: pullrequest.id,
        node_id: pullrequest.node_id,
        html_url: pullrequest.html_url,
        diff_url: pullrequest.diff_url,
        patch_url: pullrequest.patch_url,
        issue_url: pullrequest.issue_url,
        number: pullrequest.number,
        title: pullrequest.title,
        user: {
          login: pullrequest.user.login,
          avatar_url: pullrequest.user.avatar_url,
          url: pullrequest.user.url,
          html_url: pullrequest.user.html_url,
        },
        body: pullrequest.body,
      };
    });
  } else {
    repo.pullrequests = [];
  }

  // Retrieve README.md file
  const readmeResponse = await fetch(
    `https://raw.githubusercontent.com/${owner}/${repoName}/main/README.md`,
    { headers }
  );
  if (readmeResponse.ok) {
    const readme = await readmeResponse.text();
    repo.readme = readme;
  } else {
    repo.readme = "";
  }

  return repo;
}

/**
 * Asynchronous function to retrieve all commits of a repository.
 * @param owner The owner of the repository.
 * @param repoName The name of the repository.
 * @returns A promise that resolves to an array of commits.
 */
async function getAllCommits(owner: string, repoName: string): Promise<any[]> {
  const per_page = 100; // Number of commits per page
  let page = 1;
  let commits: Commit[] = [];

  while (true) {
    const url = `https://api.github.com/repos/${owner}/${repoName}/commits?page=${page}&per_page=${per_page}`;
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