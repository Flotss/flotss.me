import ProjectCard from "@/components/ProjectCard";
import { Repo } from "@/types/types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Project() {
    const { name } = useRouter().query;
    
    const [repo, setRepo] = useState<Repo>();

    useEffect(() => {
        async function fetchData() {
            const response = await fetch(`/api/get/repos?name=${name}`);
            const data = await response.json();
            const repo: Repo = data;
            setRepo(repo);
            console.log(repo);

        }
        fetchData();
    }, [name]);


    if (!repo) {
        return <div>loading...</div>
    }

    return (
        <div>
            <h1> projets</h1>
            <ProjectCard 
                repo={repo}
            />
        </div>
    )

}