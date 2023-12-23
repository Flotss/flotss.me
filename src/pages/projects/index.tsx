import React from "react";
import Repos from "@/components/Repos";
import Title from "@/components/Title";

/**
 * The `Projects` component is responsible for displaying a list of repositories.
 *
 * @returns {JSX.Element} - The rendered `Projects` component.
 */
export default function Projects() {
  return (
    <>
      {/* Render the page title */}
      <Title title="Mes projets" />

      {/* Render the list of repositories */}
      <Repos />
    </>
  );
}
