import ProjectCard from "@/components/Card/ProjectCard";
import ProjectCardSkeleton from "@/components/Card/ProjectCardSkeleton";
import { Repo } from "@/types/types";
import { Box } from "@chakra-ui/react";

export default function Home() {

    const repo: Repo = {
        name: "test",
        description: "test",
        stars: 0,
        archived: true,
        id: 0,
        url: "",
        html_url: "",
        created_at: "",
        updated_at: ""
    };

    return (
        <Box className="flex flex-row space-x-2 p-20 items-center">
            <ProjectCardSkeleton />
            <ProjectCard repo={repo} />
        </Box>
    )
}