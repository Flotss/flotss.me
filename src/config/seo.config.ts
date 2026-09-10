export interface PageSEO {
  title: string;
  description: string;
  canonical?: string;
  noindex?: boolean;
}

export const defaultSEO = {
  domain: 'https://flotss.me',
  siteName: 'flotss.me',
  author: 'Florian Mangin',
  defaultTitle: 'Florian Mangin — Software Engineer',
  defaultDescription:
    'Portfolio of Florian Mangin, Software Engineer passionate about C# / .NET, TypeScript, Next.js, and Angular.',
  defaultImage: '/site-representation.png',
  twitterHandle: '@flotss',
};

export const pagesSEO: Record<string, PageSEO> = {
  home: {
    title: 'Florian Mangin — Software Engineer',
    description:
      'Portfolio of Florian Mangin, Software Engineer passionate about C# / .NET, TypeScript, Next.js, and Angular.',
    canonical: 'https://flotss.me',
    noindex: false,
  },
  contact: {
    title: 'Contact — Florian Mangin',
    description:
      'Get in touch with Florian Mangin for software engineering opportunities, collaborations, or inquiries.',
    canonical: 'https://flotss.me/contact',
    noindex: false,
  },
  projects: {
    title: 'Projects — Florian Mangin',
    description: 'Explore software engineering projects and repositories by Florian Mangin.',
    canonical: 'https://flotss.me/projects',
    noindex: true, // Blocked from search engine indexing
  },
  projectDetail: {
    title: 'Project — Florian Mangin',
    description: 'Repository details, commits, languages, and technical overview.',
    noindex: true, // Blocked from search engine indexing
  },
  admin: {
    title: 'Login — Back Office',
    description: 'Sign in to access portfolio repository management.',
    noindex: true, // Blocked from search engine indexing
  },
  dashboard: {
    title: 'Back Office Dashboard — flotss.me',
    description: 'Manage repository visibility, descriptions, and custom portfolio display order.',
    noindex: true, // Blocked from search engine indexing
  },
};
