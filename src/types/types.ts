export type Repo = {
  id: number;
  name: string;
  description: string;
  url: string;
  html_url: string;
  created_at: string;
  updated_at: string;
  stars: number;
  archived: boolean;
  language: string;
  homepage: string;
  git_url: string;
  ssh_url: string;
  clone_url: string;
  svn_url: string;
  forked: boolean;
  commits: Commit[];
  readme: string;
  owner: Owner;
  open_issues_count: number;
  license: string;
  subscribers_count: number;
  forks_count: number;
  watchers_count: number;
  languages: Language[];
  collaborators: Collaborator[];
  pullrequests: PullRequest[];
};

export type Owner = {
  login: string;
  avatar_url: string;
  url: string;
  html_url: string;
};

// api.github.com/repos/owner/repo/collaborators requiert une authentification
export type Collaborator = {
  login: string;
  avatar_url: string;
  url: string;
  html_url: string;
};

export type Language = {
  name: string;
  percentage: number;
};

export type Commit = {
  author: {
    name: string;
    date: string;
  };
  message: string;
  url: string;
};


// api.github.com/repos/owner/repo/pulls 
export type PullRequest = {
  url: string;
  id: number;
  node_id: string;
  html_url: string;
  diff_url: string;
  patch_url: string;
  issue_url: string;
  number: number;
  title: string;
  user: {
    login: string;
    avatar_url: string;
    url: string;
    html_url: string;
  };
  body: string;
};


