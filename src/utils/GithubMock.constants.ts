import { Collaborator, Commit, Repo } from '@/types/types';

export const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA == 'true';

export const ReposMock: Partial<Repo>[] = [
  {
    id: 1,
    name: 'Repo 1',
    description: 'Description 1',
    url: 'https://www.google.com',
    archived: false,
    private: false,
    pinned: true,
  },
  {
    id: 2,
    name: 'Repo 2',
    description: 'Description 2',
    url: 'https://www.google.com',
    archived: false,
    private: false,
    pinned: false,
  },
  {
    id: 3,
    name: 'Repo 3',
    description: 'Description 3',
    url: 'https://www.google.com',
    archived: true,
    private: false,
    pinned: true,
  },
  {
    id: 4,
    name: 'Repo 4',
    description: 'Description 4',
    url: 'https://www.google.com',
    archived: true,
    private: false,
    pinned: false,
  },
  {
    id: 5,
    name: 'Repo 5',
    description: 'Description 5',
    url: 'https://www.google.com',
    archived: false,
    private: true,
    pinned: false,
  },
  {
    id: 6,
    name: 'Repo 6',
    description: 'Description 6',
    url: 'https://www.google.com',
    archived: true,
    private: true,
    pinned: false,
  },
];

const commitExemple = {
  author: {
    name: 'Author',
    date: '2021-01-01T00:00:00Z',
  },
  message: 'Commit message',
  url: 'https://www.google.com',
};

const commitMock: Partial<Commit>[] = Array(20).fill(commitExemple);

// dans ce readmemock met tout les afficahge possible qu'on peut faire dans un markdown
const readmeMock = `
# Title 1
## Title 2
### Title 3
#### Title 4
##### Title 5
###### Title 6

**Bold text**

*Italic text*

\`Code\`

\`\`\`

Code block

\`\`\`

[Link](https://www.google.com)

![Image](https://www.google.com)

- List item 1
  - List item 1.1
- List item 2

1. Ordered list item 1
2. Ordered list item 2


---

Horizontal rule

| Table | Header |
|-------|--------|
| Table | Row    |

\`\`\`java
public class Main {
  public static void main(String[] args) {
    System.out.println("Hello, World!");
  }
}
\`\`\`

`;

export const RepoMock: Repo = {
  id: 1,
  name: 'Repo 1',
  description: `👤 Flotss's GitHub profile information showcasing their pinned repositories and contributions.`,
  url: 'https://www.google.com',
  archived: false,
  private: false,
  pinned: true,
  collaborators: [{ login: 'Flotss' }, { login: 'Collaborator' }] as Collaborator[],
  html_url: '',
  created_at: '2021-01-01T00:00:00Z',
  updated_at: '2021-02-01T00:00:00Z',
  stargazers_count: 0,
  language: 'java',
  homepage: 'flotss.me',
  git_url: 'https://github.com/flotss/flotss.me',
  ssh_url: '@github.com:flotss/flotss.me.git',
  clone_url: 'https://github.com/flotss/flotss.me.git',
  svn_url: '',
  forked: false,
  commits: commitMock as Commit[],
  readme: readmeMock,
  owner: {
    login: 'Flotss',
    avatar_url: '',
    url: '',
    html_url: '',
  },
  open_issues_count: 0,
  license: 'null',
  subscribers_count: 0,
  forks_count: 167,
  watchers_count: 0,
  languages: [
    { name: 'Java', percentage: 100 },
    { name: 'Kotlin', percentage: 50 },
    { name: 'JavaScript', percentage: 25 },
  ],
  pullRequests: [],
};

export const UserMock = {
  login: 'Flotss',
  id: 80858668,
  node_id: 'MDQ6VXNlcjgwODU4NjY4',
  avatar_url: 'https://avatars.githubusercontent.com/u/80858668?v=4',
  gravatar_id: '',
  url: 'https://api.github.com/users/Flotss',
  html_url: 'https://github.com/Flotss',
  followers_url: 'https://api.github.com/users/Flotss/followers',
  following_url: 'https://api.github.com/users/Flotss/following{/other_user}',
  gists_url: 'https://api.github.com/users/Flotss/gists{/gist_id}',
  starred_url: 'https://api.github.com/users/Flotss/starred{/owner}{/repo}',
  subscriptions_url: 'https://api.github.com/users/Flotss/subscriptions',
  organizations_url: 'https://api.github.com/users/Flotss/orgs',
  repos_url: 'https://api.github.com/users/Flotss/repos',
  events_url: 'https://api.github.com/users/Flotss/events{/privacy}',
  received_events_url: 'https://api.github.com/users/Flotss/received_events',
  type: 'User',
  site_admin: false,
  name: 'Florian Mangin',
  company: null,
  blog: 'flotss.me',
  location: 'France',
  email: null,
  hireable: true,
  bio: null,
  twitter_username: null,
  public_repos: 25,
  public_gists: 0,
  followers: 11,
  following: 28,
  created_at: '2021-03-17T21:57:53Z',
  updated_at: '2024-10-13T19:18:09Z',
};
