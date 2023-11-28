import { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";
import { Repo } from "@/types/types";

// Définition du type des référentiels
type RepositoryName = {
  name: string;
};

// Définition de la liste des référentiels
const repositories: RepositoryName[] = [
  { name: 'UpdateGenius' },
  { name: 'CrazyCharlyDay' },
  { name: 'ObjectAidJava' },
  { name: 'NETVOD' },
  { name: 'Zeldiablo' },
  { name: 'TimeLineGame' },
];

let headers = {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${process.env.GITHUB_TOKEN}`,
  "X-GitHub-Api-Version": "2022-11-28",
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Repo[]>
) {
  const owner = "Flotss";
  const repos = await getRepos(owner);

  res.status(200).json(repos);
}

// Fonction asynchrone pour récupérer les référentiels
async function getRepos(owner: string): Promise<Repo[]> {
  let repos: Repo[] = [];

  const response = await fetch(`https://api.github.com/users/${owner}/repos`, {
    headers,
  });
  const reposResponse: any = await response.json();

  // Utilisation de Promise.all pour attendre que toutes les promesses se résolvent
  await Promise.all(
    reposResponse.map(async (rep: any) => {
      if (repositories.some((repo) => repo.name === rep.name)) {
        let commits: any = await getAllCommits(owner, rep.name);

        let repo: Repo = {
          id: rep.id,
          name: rep.name,
          description: rep.description,
          url: rep.html_url,
          api_url: rep.url,
          created_at: rep.created_at,
          updated_at: rep.updated_at,
          commits_number: commits.length,
        };
        repos.push(repo);
      }
    })
  );

  return repos;
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
    page++;
  }

  return commits;
}