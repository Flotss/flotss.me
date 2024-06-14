import Repos from '@/components/Repos';
import Title from '@/components/Title';

/**
 * The `Projects` component is responsible for displaying a list of repositories.
 *
 * @returns {JSX.Element} - The rendered `Projects` component.
 */
export default function Projects(props: any) {
  return (
    <>
      {/* Render the page title */}
      <Title title="Mes projets" className="mt-10" />

      {/* Render the list of repositories */}
      <Repos />
    </>
  );
}
