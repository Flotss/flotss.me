import { useEffect, useState } from "react";
import { Repo } from "@/types/types";
import ProjectCard from "./Card/ProjectCard";
import ProjectCardSkeleton from "./Card/ProjectCardSkeleton";
import { ScaleFade, useToast } from "@chakra-ui/react";


export default function Repos(): JSX.Element {
    const [repos, setRepos] = useState<Repo[]>([]);
    const [loading, setLoading] = useState(true);

    const toast = useToast();

    useEffect(() => {
        const fetchRepos = async () => {
            const response = await fetch("api/get/repos");
            const data = await response.json();
            
            if (response.status == 400) {
                toast({
                    title: 'Netwoking Error',
                    description: "Rate limit of github have been reached",
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                })
                return;
            }

            if (response.status == 404) {
                toast({
                    title: 'Repositorys not found',
                    description: "",
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                })
                return;
            }


            setRepos(data);
            setLoading(false);
        };

        fetchRepos();
    }, [toast]);


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
    )
}