import { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";
import { Commit, Repo } from "@/types/types";
import headers from "../headersApiGithub";

// Définition du type des référentiels
type RepositoryName = {
  name: string;
};

// Définition de la liste des référentiels
const repositories: RepositoryName[] = [
  { name: "UpdateGenius" },
  { name: "CrazyCharlyDay" },
  { name: "ObjectAidJava" },
  { name: "NETVOD" },
  { name: "Zeldiablo" },
  { name: "TimeLineGame" },
  { name: "flotss.me" },
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Repo[] | Repo>
) {
  const owner = "Flotss";

  const { name } = req.query;
  try {
    if (name != undefined) {
      const repo = await getRepo(owner, name as string);
      if (repo) {
        res.status(200).json(repo);
      } else {
        res.status(404).json([]);
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
  } catch (e) {
    res.status(400).json([]);
  }
}

// Fonction asynchrone pour récupérer les référentiels
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

  // Utilisation de Promise.all pour attendre que toutes les promesses se résolvent
  await Promise.all(
    reposResponse.map(async (rep: any) => {
      if (repositories.some((repo) => repo.name === rep.name)) {
        let repo: Repo = {
          id: rep.id,
          name: rep.name,
          description: rep.description,
          url: rep.html_url,
          html_url: rep.url,
          created_at: rep.created_at,
          updated_at: rep.updated_at,
          stars: rep.stargazers_count,
          archived: rep.archived,
        };
        repos.push(repo);
      }
    })
  );

  return repos;
}
async function getRepo(owner: string, repoName: string): Promise<Repo | null> {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repoName}`,
    { headers }
  );

  const reponseJson: any = await response.json();

  if (!reponseJson) {
    return null;
  }

  const commits = await getAllCommits(owner, repoName);

  const repo: Repo = {
    id: reponseJson.id,
    name: reponseJson.name,
    description: reponseJson.description,
    url: reponseJson.html_url,
    html_url: reponseJson.url,
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
    owner: {
      login: reponseJson.owner.login,
      avatar_url: reponseJson.owner.avatar_url,
      url: reponseJson.owner.url,
      html_url: reponseJson.owner.html_url,
    },
    collaborators: [],
    languages: [],
    open_issues_count: reponseJson.open_issues_count,
    license: reponseJson.license?.name,
    subscribers_count: reponseJson.subscribers_count,
    forks_count: reponseJson.forks_count,
    watchers_count: reponseJson.watchers_count,
  };

  // Récupération des collaborateurs
  const collaboratorsResponse = await fetch(
    `https://api.github.com/repos/${owner}/${repoName}/collaborators`,
    { headers }
  );
  if (collaboratorsResponse.ok) {
    const collaboratorsJson: unknown = await collaboratorsResponse.json();
    const collaborators: any[] = collaboratorsJson as any[];

    repo.collaborators = collaborators.map((collaborator) => {
      return {
        login: collaborator.login,
        avatar_url: collaborator.avatar_url,
        url: collaborator.url,
        html_url: collaborator.html_url,
      };
    });
  } else {
    repo.collaborators = [];
  }

  // Récupération des langages
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

  // Récupération du fichier README.md
  const readmeResponse = await fetch(
    `https://raw.githubusercontent.com/${owner}/${repoName}/main/README.md`,
    { headers }
  );
  if (readmeResponse.ok) {
    const readme = await readmeResponse.text();
    repo.readme = readme;
  } else {
    repo.readme = undefined;
  }

  return repo;
}

// Fonction asynchrone pour récupérer tous les commits d'un référentiel
async function getAllCommits(owner: string, repoName: string): Promise<any[]> {
  let page = 1;
  const per_page = 100; // Valeur maximale et recommandée par GitHub
  let commits: Commit[] = [];

  while (true) {
    const url = `https://api.github.com/repos/${owner}/${repoName}/commits?page=${page}&per_page=${per_page}`;
    const response = await fetch(url, { headers });
    const data: any = await response.json();

    if (data.length === 0) {
      break;
    }
    
    data.forEach((commit: any) => {
      const commitObject: Commit = {
        author: {
          name: commit.commit.author.name,
          date: commit.commit.author.date,
        },
        message: commit.commit.message,
        url: commit.html_url,
      };
      commits.push(commitObject);
    });

    page++;
  }

  return commits;
}