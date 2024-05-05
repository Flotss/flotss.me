import { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";
import { Collaborator, Commit, PullRequest, Repo } from "@/types/types";
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

  
  const repo: Repo = reponseJson as Repo;
  
  // Retrieve commits
  repo.commits = await getAllCommits(owner, repoName);

  // Retrieve collaborators
  const collaboratorsResponse = await fetch(
    `https://api.github.com/repos/${owner}/${repoName}/collaborators`,
    { headers }
  );

  if (collaboratorsResponse.ok) {
    const collaboratorsJson: unknown = await collaboratorsResponse.json();
    repo.collaborators = collaboratorsJson as Collaborator[];;
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
    const languages = languagesJson as any;

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
    repo.pullrequests = pullrequestsJson as PullRequest[];
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