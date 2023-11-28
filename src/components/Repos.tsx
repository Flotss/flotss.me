// Repos.tsx
import { useEffect, useState } from "react";
import { Repo } from "@/types/types";
import ProjectCard from "./ProjectCard";
import ProjectCardSkeleton from "./ProjectCardSkeleton";


export default function Repos() : JSX.Element {
    const [repos, setRepos] = useState<Repo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
  
    useEffect(() => {
        const fetchRepos = async () => {
          try {
            const response = await fetch("api/get/getProjetFromGithub");
            if (!response.ok) {
              throw new Error("Failed to fetch data");
            }
            const data = await response.json();
            setRepos(data);
          } catch (error) {
            console.error("Error fetching data:", error);
            setError(true);
          } finally {
            setLoading(false);
          }
        };
      
        fetchRepos();
      }, []);
      
  
    if (loading) {
        const skeletons = Array.from({ length: 6 }).map((_, index) => (
            <ProjectCardSkeleton key={index} />
        ));
        return (
            <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 py-12">
                {skeletons}
            </section>
        );
    }

    if (error) {
        return (
            <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 py-12">
                {/* Your error message */}
            </section>
        );
    }

    return (
        <section
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 py-12"
            id="projects"
        >
            {repos.map((repo) => (
                <ProjectCard
                    key={repo.id}
                    name={repo.name}
                    description={repo.description}
                    commits={repo.commits_number}
                />
            ))}
        </section>
    );
}