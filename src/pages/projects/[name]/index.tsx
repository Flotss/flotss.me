import { Repo } from "@/types/types";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import { Badge, Box, Divider, Flex, Popover, PopoverContent, PopoverHeader, PopoverTrigger, Skeleton, SkeletonCircle, SkeletonText, Text, Avatar, useToast, Link, Button, Menu, MenuButton, MenuItem, MenuList, Image } from "@chakra-ui/react";
import Title from "@/components/Title";
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { ChevronDownIcon } from "@chakra-ui/icons";
import { StyledBox } from "@/components/StyledBox";



export default function Project() {
    const router = useRouter();

    const [repo, setRepo] = useState<Repo>();
    const [error, setError] = useState<string | undefined>(undefined); // 404 or 400
    const toast = useToast();

    const copyInClipBoard = (text: string | undefined) => () => {
        if (!text) return;

        navigator.clipboard.writeText(text);
        toast({
            title: "Copié dans le presse papier",
            description: text,
            status: "success",
            duration: 4000,
            isClosable: true,
        });
    }

    useEffect(() => {
        const { name } = router.query;

        async function fetchRepoDataFromApi() {
            const response = await fetch(`/api/get/repos?name=${name}`);

            if (!response.ok) {
                if (response.status == 400) {
                    const message = await response.json().then(data => data.message);
                    displayToast("Erreur", message, "error");
                    setError("400");
                }

                if (response.status == 404) {
                    displayToast("Erreur", "Le repository n'existe pas", "error");
                    setError("404");
                }
                // setError(true);
                return;
            }

            const data = await response.json();
            const repo: Repo = data;

            setRepo(repo);
            saveRepoDataToLocalStorage(repo, name as string);
        }

        // Function to display toast notifications
        type ToastStatus = "info" | "warning" | "success" | "error" | undefined;
        function displayToast(title: string, description: string, status: ToastStatus) {
            toast({
                title: title,
                description: description,
                status: status,
                duration: 9000,
                isClosable: true,
            });
        }

        // Function to save repository data to local storage
        function saveRepoDataToLocalStorage(repo: Repo, name: string) {
            const repoData = {
                repo,
                lastRequestDate: new Date().getTime(),
            };
            localStorage.setItem(name as string, JSON.stringify(repoData));
        }

        // Function to fetch repository data
        function fetchRepoData(): void {
            const storedRepoData = localStorage.getItem(name as string);
            if (storedRepoData) {
                const parsedData = JSON.parse(storedRepoData);
                // if the date of the last request is more than 1 hour
                if (new Date().getTime() - parsedData.lastRequestDate > 3600000) {
                    localStorage.removeItem(name as string);
                    fetchRepoDataFromApi();
                } else {
                    setRepo(parsedData.repo);
                }
            } else {
                fetchRepoDataFromApi();
            }
        }

        fetchRepoData();
    }, [router.query, toast]);


    if (error == "404") {
        return (
            <ErrorCode code={"404"} message={"Le repository n'existe pas"} />
        )
    }

    if (error == "400") {
        return (
            <ErrorCode code={"400"} message={"Erreur lors de la récupération des données"} />
        )
    }


    if (!repo) {
        return (
            <div className="flex flex-col items-center justify-center px-20 py-10 space-x-5">
                <div className="grid grid-flow-row-dense grid-cols-5  grid-rows-1 w-full  space-x-5">
                    <Box className="col-span-2 sm:grid-cols-5 rounded-3xl bg-[#131312] p-8 space-y-2" >
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
        <div className="flex flex-col items-center justify-center px-5 sm:px-20 py-5 space-y-5">
            <div className="grid grid-flow-row-dense grid-cols-1 mdrepo:grid-cols-3 lgrepo:grid-cols-5 grid-rows-1 lgrepo:space-x-5  w-full">
                <StyledBox className="mdrepo:col-span-2 col-span-3 space-y-5" >
                    <Title title={repo.name} className="mdrepo:text-5xl lgrepo:text-7xl" />
                    <StyledText>{repo.description}</StyledText>
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />} >
                            Plus d&apos;information
                        </MenuButton>
                        <MenuList style={{ backgroundColor: 'rgb(30, 30, 30, 1)' }} border={"none"}>
                            {/* https://img.shields.io/badge/any_text-you_like-blue */}
                            <MenuItem style={{ backgroundColor: 'rgb(30, 30, 30, 1)' }}><Image src={`https://img.shields.io/badge/Stars-${repo.stars}-green`} alt="Stars" /></MenuItem>
                            <MenuItem style={{ backgroundColor: 'rgb(30, 30, 30, 1)' }}><Image src={`https://img.shields.io/badge/Forks-${repo.forks_count}-blue`} alt="Forks" /></MenuItem>
                            <MenuItem style={{ backgroundColor: 'rgb(30, 30, 30, 1)' }}><Image src={`https://img.shields.io/badge/Open_Issues-${repo.open_issues_count}-blue`} alt="Open Issues" /></MenuItem>
                            <MenuItem style={{ backgroundColor: 'rgb(30, 30, 30, 1)' }}><Image src={`https://img.shields.io/badge/License-${repo.license}-black`} alt="License" /></MenuItem>
                            <MenuItem style={{ backgroundColor: 'rgb(30, 30, 30, 1)' }}><Image src={`https://img.shields.io/badge/Watchers-${repo.watchers_count}-yellow`} alt="Watchers" /></MenuItem>
                            <MenuItem style={{ backgroundColor: 'rgb(30, 30, 30, 1)' }}><Image src={`https://img.shields.io/badge/Subscribers-${repo.subscribers_count}-yellow`} alt="Subscribers" /></MenuItem>
                        </MenuList>
                    </Menu>
                </StyledBox>
                <StyledBox className="col-span-3 mdrepo:col-span-1 lgrepo:col-span-1 mdrepo:ml-5  mt-5 mdrepo:mt-0" >
                    <StyledText className="lgrepo:text-xl">Créé le: {new Date(repo.created_at).toLocaleDateString()}</StyledText>
                    <StyledText className="lgrepo:text-xl">Mis à jour le: {new Date(repo.updated_at).toLocaleDateString()}</StyledText>

                    <StyledText className="pt-5 pb-2">Collaborateurs :</StyledText>
                    <Flex width={"100%"} gap={5} className=" justify-around">
                        {repo.collaborators.map((collaborator, index) => (
                            <Popover key={index} placement="top" trigger="hover">
                                <PopoverTrigger>
                                    <Link href={collaborator.html_url} isExternal>
                                        <Box className="flex flex-col justify-center items-center space-y-2">
                                            <Avatar
                                                name={collaborator.login}
                                                src={collaborator.avatar_url}
                                                size={repo.collaborators.length <= 4 ? "md" : "xs"}
                                                showBorder={true}
                                            />
                                            {collaborator.login == "Flotss" && <Badge ml="1" colorScheme="green">Me</Badge>}
                                        </Box>
                                    </Link>
                                </PopoverTrigger>
                                <PopoverContent width={`${collaborator.login.length / 1.5}rem`}>
                                    <PopoverHeader className="bg-[#131312]  flex justify-center items-center ">
                                        {collaborator.login}
                                    </PopoverHeader>
                                </PopoverContent>
                            </Popover>
                        ))}
                    </Flex>
                </StyledBox>
                <StyledBox className="flex justify-center items-center col-span-5 lgrepo:col-span-2 mt-5 lgrepo:mt-0" >
                    <Box gap={2} className="flex justify-center items-center lgrepo:flex-col md:flex-row flex-col w-full" >
                        <Button as="a" href={repo.html_url} target="_blank" rel="noopener noreferrer" className="w-full" height="4.5rem">
                            View on GitHub
                        </Button>
                        <Button colorScheme="blue" onClick={copyInClipBoard(repo.clone_url)} className="w-full" height="4.5rem">
                            Clone (SSH)
                        </Button>
                        <Button colorScheme="blue" onClick={copyInClipBoard(repo.ssh_url)} className="w-full" height="4.5rem">
                            Clone (HTTPS)
                        </Button>
                    </Box>
                </StyledBox>
            </div>
            <Flex width={"100%"} gap={5} className="items-center justify-evenly" flexWrap="wrap">
                {repo.languages.map((language, index) => {
                    return (
                        <Box key={index} className={`w-${(100 / repo.languages.length).toFixed(2)} rounded-3xl px-6 py-1 bg-[#131312] flex justify-center items-center`}>
                            <StyledText>{language.name}</StyledText>
                        </Box>
                    )
                })}
            </Flex>
            <ReadmeAndCommits repo={repo} />
        </div>
    )
}




interface StyledProps {
    children: React.ReactNode;
    className?: string;
}

const StyledText = ({ children, className, ...props }: StyledProps) => (
    <Text className={`sm:text-xl md:text-2xl ${className}`} {...props}>
        {children}
    </Text>
);


interface ReadmeAndCommitsProps {
    repo: Repo;
}

const ReadmeAndCommits: React.FC<ReadmeAndCommitsProps> = ({ repo }) => {
    const [boxHeight, setBoxHeight] = useState<number>(0);
    const refFirstBox = useRef<HTMLDivElement>(null);

    const commits = repo.commits;


    useEffect(() => {
        if (refFirstBox.current) {
            setBoxHeight(refFirstBox.current.offsetHeight);
        }
    }, [repo.readme]); // Mise à jour lorsque le contenu du README change


    return (
        <Box className="grid grid-flow-row-dense grid-cols-3 lg:grid-cols-5 grid-rows-1 w-full  lg:space-x-5 space-y-5 lg:space-y-0">
            <Box
                ref={refFirstBox} // TODO : ADD REF TO THE STYLEDBOX
                className="col-span-3 rounded-3xl bg-[#131312] p-8 space-y-2"
                style={{ minHeight: '500px' }}
            >
                <Title title={"Readme"} className="text-5xl" />
                <Divider />
                <ReactMarkdown remarkPlugins={[gfm]} rehypePlugins={[rehypeSlug, rehypeAutolinkHeadings]}>
                    {repo.readme}
                </ReactMarkdown>
            </Box>
            <Box
                className="lg:col-span-2 col-span-3 rounded-3xl bg-[#131312] p-8 space-y-2"
                style={{ height: `${boxHeight}px` }}
            >
                <Title title={"Commits"} className="text-5xl" />
                <Divider />
                <Box className="flex flex-col space-y-2 p-2 scrollbar" style={{ overflowY: 'auto', }} height={`${boxHeight - 180}px`}>
                    {commits.map((commit, index) => (
                        <Box key={index} width={"100%"} height={"100%"}>
                            <Link href={commit.url} isExternal>
                                <a className="no-underline">
                                    <Box className="bg-[#202020] hover:rounded-3xl hover:scale-[1.02] rounded-3xl px-4 py-2 space-y-2 transition-all duration-300 ease-in-out">
                                        <h1 className="text-xl">{commit.message}</h1>
                                        <div className="flex items-start justify-start space-x-2">
                                            <h1 className="text-lg">Date: {new Date(commit.author.date).toLocaleDateString()}</h1>
                                            <h1 className="text-lg">Auteur: {commit.author.name}</h1>
                                        </div>
                                    </Box>
                                </a>
                            </Link>
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    );
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
language: string;
homepage: string;
git_url: string;
ssh_url: string;
clone_url: string;
svn_url: string;
forked: boolean;
commits: Commit[];
readme: string;
owner: Owner;
collaborators: Collaborator[];
languages: Language[];
open_issues_count: number;
license: string;
subscribers_count: number;
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
//                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 