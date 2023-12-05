import { Repo } from "@/types/types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Badge, Box, Divider, Flex, Popover, PopoverContent, PopoverHeader, PopoverTrigger, Skeleton, SkeletonCircle, SkeletonText, Text, Avatar } from "@chakra-ui/react";
import Title from "@/components/Title";

export default function Project() {
    const { name } = useRouter().query;

    const [repo, setRepo] = useState<Repo>();

    useEffect(() => {
        async function fetchData() {
            const response = await fetch(`/api/get/repos?name=${name}`);
            const data = await response.json();
            const repo: Repo = data;
            setRepo(repo);
        }
        fetchData();
    }, [name]);




    if (!repo) {
        return (
            <div className="flex flex-col items-center justify-center px-14 py-10 space-x-5">
                <div className="grid grid-flow-row-dense grid-cols-5 grid-rows-1 w-full  space-x-5">
                    <Box className="col-span-2 rounded-3xl bg-[#131312] p-8 space-y-2" >
                        <Skeleton width={"30%"}>
                            <Box className="text-7xl">.</Box>
                        </Skeleton>
                        {Array.from({ length: 8 }).map((_, index) => (
                            <SkeletonText key={index} noOfLines={1} width={`${Math.floor(Math.random() * 40) + 40}%`}></SkeletonText>
                        ))}
                    </Box>
                    <Box className="col-span-1 rounded-3xl bg-[#131312] p-8 space-y-2" >
                        <Skeleton>
                            <Box className="text-6xl">.</Box>
                        </Skeleton>
                        {Array.from({ length: 7 }).map((_, index) => (
                            <SkeletonText key={index} noOfLines={1} width={`${Math.floor(Math.random() * 100)}%`}></SkeletonText>
                        ))}
                        <Flex width={"100%"} gap={5} className="pt-5 justify-around">
                            {Array.from({ length: 3 }).map((_, index) => (
                                <SkeletonCircle key={index} />
                            ))}
                        </Flex>
                    </Box>
                    <Box className="col-span-2 rounded-3xl  bg-[#131312] p-8 space-y-2" >
                        <Flex direction={"column"} gap={2}>
                            {Array.from({ length: 3 }).map((_, index) => (
                                <Skeleton key={index}>
                                    <h1 className="text-7xl">.</h1>
                                </Skeleton>
                            ))}
                        </Flex>
                    </Box>
                </div>
                <Flex width={"100%"} gap={5} className="py-5 justify-around">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <SkeletonCircle key={index} width="100%" height={"2rem"} />
                    ))}
                </Flex>
                <div className="grid grid-flow-row-dense grid-cols-5 grid-rows-1 w-full  space-x-5">
                    <Box className="col-span-3 rounded-3xl bg-[#131312] p-8 space-y-2" width={"100%"}>
                        <Skeleton width={"30%"}>
                            <Box className="text-5xl">.</Box>
                        </Skeleton>
                        <Divider />
                        {Array.from({ length: 5 }).map((_, index) => (
                            <SkeletonText key={index} noOfLines={4} width={`${Math.floor(Math.random() * 40) + 40}%`}></SkeletonText>
                        ))}
                    </Box>
                    <Box className="col-span-2 rounded-3xl bg-[#131312] p-8 space-y-2" width={"100%"}>
                        <Skeleton width={"30%"}>
                            <Box className="text-5xl">.</Box>
                        </Skeleton>
                        <Divider />
                        {Array.from({ length: 4 }).map((_, index) => (
                            <SkeletonText key={index} noOfLines={4} width={`${Math.floor(Math.random() * 40) + 40}%`}></SkeletonText>
                        ))}
                    </Box>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center px-14 py-10 space-x-5">
            <div className="grid grid-flow-row-dense grid-cols-5 grid-rows-1 w-full  space-x-5">
                <Box className="col-span-2 rounded-3xl bg-[#131312] p-8 space-y-5" >
                    <Title title={repo.name} className="text-7xl" />
                    <h1 className="text-2xl">{repo.description}</h1>
                    <h1 className="text-2xl">Language: <Badge>{repo.language}</Badge></h1>

                </Box>
                <Box className="col-span-1 rounded-3xl bg-[#131312] p-8 space-y-2" >
                    {repo.owner && (
                        <>
                            <h1 className="text-2xl">Propriétaire: {repo.owner.login}</h1>
                        </>)
                    }
                    <h1 className="text-2xl">Créé le: {new Date(repo.created_at).toLocaleDateString()}</h1>
                    <h1 className="text-2xl">Mis à jour le: {new Date(repo.updated_at).toLocaleDateString()}</h1>

                    <h1 className="text-2xl pt-5 pb-2">Collaborateurs :</h1>
                    <Flex width={"100%"} gap={5} className=" justify-around">
                        {/* https://chakra-ui.com/docs/components/avatar/usage */}
                        {repo.collaborators && repo.collaborators.map((collaborator, index) => (
                            <Popover key={index} placement="top" trigger="hover">
                                <PopoverTrigger>
                                    <Avatar
                                        name={collaborator.login}
                                        src={collaborator.avatar_url}
                                        size={(repo.collaborators?.length ?? 0) <= 4 ? "md" : "xs"}
                                        showBorder={true}
                                    />
                                </PopoverTrigger>
                                <PopoverContent width={`${collaborator.login.length / 1.5}rem`}>
                                    <PopoverHeader className="bg-[#131312]  flex justify-center items-center ">
                                        {collaborator.login}
                                    </PopoverHeader>
                                </PopoverContent>
                            </Popover>
                        ))}
                    </Flex>
                </Box>
                <Box className="col-span-2 rounded-3xl  bg-[#131312] p-8 space-y-2" >
                    <Flex direction={"column"} gap={2}>
                        {Array.from({ length: 3 }).map((_, index) => (
                            <h1 key={index} className="text-7xl">.</h1>
                        ))}
                    </Flex>
                </Box>
            </div>
            <Flex width={"100%"} gap={5} className="py-5 justify-around">
                {repo.languages && repo.languages.map((language, index) => (
                    <Text key={index} width="100%" className="text-2xl rounded-3xl px-5  bg-[#131312] flex justify-center items-center">{language.name}</Text>
                ))}
                <SkeletonCircle width="100%" height={"2rem"} />
            </Flex>
            <div className="grid grid-flow-row-dense grid-cols-5 grid-rows-1 w-full  space-x-5">
                <Box className="col-span-3 rounded-3xl bg-[#131312] p-8 space-y-2" width={"100%"}>
                    <Title title={"Readme"} className="text-5xl" />
                    <Divider />
                    {repo.readme}
                </Box>
                <Box className="col-span-2 rounded-3xl bg-[#131312] p-8 space-y-2" width={"100%"}>
                    <Title title={"Commits"} className="text-5xl" />
                    <Divider />
                    <Text className="text-2xl">TODO</Text>
                </Box>
            </div>
        </div>

           
            )

             {/*  
                   TODO : Mettre en bas a droite
                   <h1 className="text-2xl">Stars: {repo.stars}</h1>
                   <h1 className="text-2xl">Forks: {repo.forks_count}</h1>
                   <h1 className="text-2xl">Open Issues: {repo.open_issues_count}</h1>
                   <h1 className="text-2xl">Watchers: {repo.watchers_count}</h1> 
                   <h1 className="text-2xl">License: {repo.license}</h1>
                   <h1 className="text-2xl">Subscribers: {repo.subscribers_count}</h1>
                   */ }
            
}







    /*
export type Repo = {
  id: number;
  name: string;
  description: string;
  url: string;
  html_url: string;
  created_at: string;
  updated_at: string;
  stars: number;
  archived: boolean;
  language?: string;
  homepage?: string;
  git_url?: string;
  ssh_url?: string;
  clone_url?: string;
  svn_url?: string;
  forked?: boolean;
  commits_number?: number;
  readme?: string;
  owner?: Owner;
  collaborators?: Collaborator[];
  languages?: Language[];
  open_issues_count?: number;
  license?: string;
  subscribers_count?: number;
};

export type Owner = {
  login: string;
  avatar_url: string;
  url: string;
  html_url: string;
};

// https://api.github.com/repos/OWNER/REPO/collaborators
export type Collaborator = {
  login: string;
  avatar_url: string;
  url: string;
  html_url: string;
};


https://api.github.com/repos/flotss/flotss.me/languages
{
  "HTML": 0.854490406750501,
  "CSS": 0.145509593249499
}

export type Language = {
    name: string;
    percentage: number;
  };
    */

    // eslint-disable-next-line react-hooks/exhaustive-deps
    // let repoTest: Repo = {
    //     id: 1,
    //     name: "ObjectAidJava",
    //     description: "🌐 Inspiré de ObjectAid d'Eclipse, ce projet permet de créer des schémas UML pour vos projets Java.",
    //     url: "https://api.github.com/repos/Flotss/ObjectAidJava",
    //     html_url: "https://github.com/Flotss/ObjectAidJava",
    //     created_at: "2022-12-14T14:37:15Z",
    //     updated_at: "2023-12-03T18:21:36Z",
    //     stars: 1,
    //     archived: false,
    //     language: "TypeScript",
    //     homepage: "https://example.com",
    //     git_url: "https://github.com/Flotss/ObjectAidJava.git",
    //     ssh_url: "git@github.com:Flotss/ObjectAidJava.git",
    //     clone_url: "https://github.com/Flotss/ObjectAidJava.git",
    //     svn_url: "https://github.com/Flotss/ObjectAidJava",
    //     forked: false,
    //     commits_number: 1,
    //     readme: "testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttes ttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest",
    //     owner: {
    //         login: "Flotss",
    //         avatar_url: "https://gravatar.com/avatar/e8eccdda1319f97e3eea2ba1859a4745?s=800&d=robohash&r=x",
    //         url: "https://api.github.com/users/Flotss",
    //         html_url: "https://github.com/flotss",
    //     },
    //     collaborators: [
    //         {
    //             login: "jane_sm",
    //             avatar_url: "https://gravatar.com/avatar/e8eccdda1319f97e3eea2ba1859a4745?s=800&d=robohash&r=x",
    //             url: "https://api.github.com/users/Maxouxax",
    //             html_url: "https://github.com/maxouxax",
    //         },
    //         {
    //             login: "jane_smithjane_smithjane_smith",
    //             avatar_url: "https://gravatar.com/avatar/e8eccdda1319f97e3eea2ba1859a4745?s=800&d=robohash&r=x",
    //             url: "https://api.github.com/users/Maxouxax",
    //             html_url: "https://github.com/maxouxax",
    //         },
    //         {
    //             login: "jane_smith",
    //             avatar_url: "https://gravatar.com/avatar/e8eccdda1319f97e3eea2ba1859a4745?s=800&d=robohash&r=x",
    //             url: "https://api.github.com/users/Maxouxax",
    //             html_url: "https://github.com/maxouxax",
    //         },
    //     ],
    //     languages: [
    //         {
    //             name: "JavaScript",
    //             percentage: 80,
    //         },
    //         {
    //             name: "TypeScript",
    //             percentage: 20,
    //         }
    //     ],
    //     open_issues_count: 5,
    //     license: "MIT",
    //     subscribers_count: 10,
    //     forks_count: 5,
    //     watchers_count: 10,
    // };

    // useEffect(() => {
    //     setTimeout(() => {
    //         setRepo(repoTest);
    //     }, 1000);
    // }, [repoTest]);