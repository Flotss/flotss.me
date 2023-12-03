import { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";
import { Repo } from "@/types/types";
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
  console.log(name);
  try {
    if (name != undefined) {
      const repo = await getRepo(owner, name as string);
      if (repo) {
        res.status(200).json([repo]);
      } else {
        res.status(404).json([]);
      }
      return;
    }

    let repos: Repo[];
    repos = await getRepos(owner);
    repos.sort((a, b) => {
      if (a.archived && b.archived) {
        return 1
      }else {
        return -1
      }
    })

    if (repos.length === 0) {
      res.status(404).json([]);
      return;
    }
    res.status(200).json(repos);
  } catch (e) {
    res.status(405);
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
          api_url: rep.url,
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
  console.log(reponseJson);

  if (!reponseJson) {
    return null;
  }

  const commits = await getAllCommits(owner, repoName);

  const repo: Repo = {
    id: reponseJson.id,
    name: reponseJson.name,
    description: reponseJson.description,
    url: reponseJson.html_url,
    api_url: reponseJson.url,
    created_at: reponseJson.created_at,
    updated_at: reponseJson.updated_at,
    commits_number: commits.length,
    stars: reponseJson.stargazers_count,
    archived: reponseJson.archived,
    owner: {
      login: reponseJson.owner.login,
      avatar_url: reponseJson.owner.avatar_url,
      url: reponseJson.owner.url,
      html_url: reponseJson.owner.html_url,
    },
  };

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
  let commits: any[] = [];

  while (true) {
    const url = `https://api.github.com/repos/${owner}/${repoName}/commits?page=${page}&per_page=${per_page}`;
    const response = await fetch(url, { headers });
    const data: any = await response.json();

    if (data.length === 0) {
      break;
    }

    commits = commits.concat(data);
  }

  return commits;
}