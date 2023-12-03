// Repos.tsx
import { useEffect, useState } from "react";
import { Repo } from "@/types/types";
import ProjectCard from "./ProjectCard";
import ProjectCardSkeleton from "./ProjectCardSkeleton";
import { ScaleFade } from "@chakra-ui/react";


export default function Repos(): JSX.Element {
    const [repos, setRepos] = useState<Repo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchRepos = async () => {
            try {
                const response = await fetch("api/get/repos");
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
            <section className="flex flex-wrap gap-x-12 gap-y-6 lg:flex-row py-8 sm:mx-10 lg:mx-36 mx-14 justify-center">
                {skeletons}
            </section>
        );
    }

    if (error) {
        return (
            <section className="flex flex-wrap gap-x-12 gap-y-6 lg:flex-row py-8 sm:mx-10 lg:mx-36 mx-14 justify-center">
                HELLO
            </section>
        );
    }

    return (
        <section className="flex flex-wrap gap-x-12 gap-y-6 lg:flex-row py-8 sm:mx-10 lg:mx-36 mx-14 justify-center" id="projects">
            {repos.map((repo) => (
                <ScaleFade key={repo.id} initialScale={0.9} in={true}>
                    <ProjectCard
                        key={repo.id}
                        repo={repo}
                    />
                </ScaleFade>
            ))}
        </section>
    );
}
