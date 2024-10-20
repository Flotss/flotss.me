import Repos from '@/components/Repos';
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
      <Title
        title={`My projects${reposCount !== 0 && reposCount ? ` (${reposCount})` : ''}`}
        className="mt-10"
      />

      <Repos filterVisible={true} setReposCount={setReposCount} />
    </>
  );
}
