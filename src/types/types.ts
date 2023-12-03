export type Repo = {
  id: number;
  name: string;
  description: string;
  url: string;
  api_url: string;
  created_at: string;
  updated_at: string;
  stars: number;
  archived: boolean;
  commits_number?: number;
  readme? : string;
  owner? : Owner;
};

export type Owner = {
  login: string;
  avatar_url: string;
  url: string;
  html_url: string;
};
