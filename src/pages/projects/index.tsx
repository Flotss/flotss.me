import Repos from '@/components/Repos';
import SEO from '@/components/SEO';
import Title from '@/components/Title';
import { useState } from 'react';

/**
 * The `Projects` component is responsible for displaying a list of repositories.
 *
 * @returns {JSX.Element} - The rendered `Projects` component.
 */
export default function Projects() {
  const [reposCount, setReposCount] = useState<number | null>(null);

  return (
    <>
      <SEO
        title="My Projects"
        description="Open-source projects by Florian Mangin: web apps built with Next.js, TypeScript, Angular, C# .NET, and more. Browse repositories on GitHub."
        url="/projects"
      />
      <Title
        title={`My projects${reposCount !== 0 && reposCount ? ` (${reposCount})` : ''}`}
        className="mt-10"
      />

      <Repos filterVisible={true} setReposCount={setReposCount} />
    </>
  );
}
