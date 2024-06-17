import { Repo } from '@/types/types';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Checkbox,
  Input,
  Radio,
  RadioGroup,
  ScaleFade,
  Stack,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import ProjectCard from './Card/ProjectCard';
import ProjectCardSkeleton from './Card/ProjectCardSkeleton';
import { StyledBox } from './StyledBox';
import { useRouter } from 'next/router';

type ReposProps = {
  filterVisible?: boolean;
  limit?: number;
};

/**
 * The `Repos` component displays a list of GitHub repositories. It fetches data from an API and can also use cached data from localStorage.
 * It handles loading states, error handling, and rendering the repository cards.
 *
 * @returns {JSX.Element} - The rendered Repos component.
 */
export default function Repos(props: ReposProps): JSX.Element {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);

  const [languages, setLanguages] = useState<Set<string>>(new Set());
  const [languageCountMap, setLanguageCountMap] = useState<Map<string, number>>(new Map());

  const [filteredRepo, setFilteredRepos] = useState<Repo[]>([]);
  const [countFilter, setCountFilter] = useState(0);
  const [search, setSearch] = useState('');
  const [isArchived, setIsArchived] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');

  const toast = useToast();
  const router = useRouter();

  const getMapCountOfLang = (reposParam: Repo[]) => {
    let languageCountMap = new Map<string, number>();

    reposParam.forEach((repo) => {
      if (repo.language) {
        if (languageCountMap.has(repo.language)) {
          languageCountMap.set(repo.language, languageCountMap.get(repo.language)! + 1);
        } else {
          languageCountMap.set(repo.language, 1);
        }
      }
    });

    return languageCountMap;
  };

  const getLanguageValues = (reposParam: Repo[]) => {
    return new Set<string>(reposParam.map((repo) => repo.language).sort());
  };

  useEffect(() => {
    /**
     * Fetches GitHub repositories from the API.
     * Handles different response statuses, such as rate limiting and not found.
     */
    const fetchRepos = async () => {
      const response = await fetch('api/get/repos');
      const data = (await response.json()) as Repo[];

      if (response.status === 400) {
        toast({
          title: 'Networking Error',
          description: 'Rate limit of GitHub has been reached',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      if (response.status === 404) {
        toast({
          title: 'Repositories not found',
          description: '',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      const reposData = {
        repos: data,
        lastRequestDate: new Date().getTime(),
      };

      const repositoryArray = reposData.repos;

      setRepos(repositoryArray);
      setLanguages(getLanguageValues(repositoryArray));
      setLanguageCountMap(getMapCountOfLang(repositoryArray));
      setLoading(false);
      localStorage.setItem('repos', JSON.stringify(reposData)); // Save data in localStorage
    };

    // Check if cached data is available and not expired
    const cachedRepos = localStorage.getItem('repos');
    if (cachedRepos) {
      const { lastRequestDate } = JSON.parse(cachedRepos);

      if (new Date().getTime() - lastRequestDate > 3600000) {
        fetchRepos();
        return;
      } else {
        let reposs = JSON.parse(cachedRepos).repos as Repo[];
        setRepos(reposs);
        setLoading(false);
        setLanguages(getLanguageValues(reposs));
        setLanguageCountMap(getMapCountOfLang(reposs));
      }
    } else {
      fetchRepos();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast]);

  useEffect(() => {
    const updateNumberOfFilters = () => {
      let count = 0;
      if (isArchived) count++;
      if (isPrivate) count++;
      if (selectedLanguage !== 'All') count++;
      if (search.length) count++;
      setCountFilter(count);
    };

    let filteredRepos = repos;

    if (search.length) {
      filteredRepos = filteredRepos.filter((repo) => {
        let name = repo.name.toLowerCase();
        let desc = repo.description.toLowerCase();
        let filterSearch = search.toLowerCase();
        return name.includes(filterSearch) || desc.includes(filterSearch);
      });
    }
    setLanguageCountMap(getMapCountOfLang(filteredRepos));
    updateNumberOfFilters();

    if (selectedLanguage !== 'All') {
      filteredRepos = filteredRepos.filter((repo) => {
        return repo.language === selectedLanguage;
      });
    }

    // if language selected verify the count
    // if 0 toggle to All
    if (!languageCountMap.has(selectedLanguage)) {
      setSelectedLanguage('All');
    }

    if (isArchived) {
      filteredRepos = filteredRepos.filter((repo) => {
        return repo.archived === isArchived;
      });
    }

    if (isPrivate) {
      filteredRepos = filteredRepos.filter((repo) => {
        return repo.private == isPrivate;
      });
    }

    setFilteredRepos(filteredRepos);
  }, [repos, isArchived, isPrivate, selectedLanguage, search, languageCountMap]);

  const clearFilters = () => {
    setIsArchived(false);
    setIsPrivate(false);
    setSelectedLanguage('All');
    setSearch('');
  };

  if (loading) {
    // Display skeleton loading cards while data is being fetched
    const skeletons = Array.from({ length: 6 }).map((_, index) => (
      <ProjectCardSkeleton key={index} />
    ));
    return (
      <section className="mx-14 flex flex-wrap justify-center gap-x-12 gap-y-6 py-8 sm:mx-10 lg:mx-36 lg:flex-row">
        {skeletons}
      </section>
    );
  }

  // Render the repository cards when data is available
  return (
    <section className="mx-5 flex justify-between gap-x-5 gap-y-5 py-8 sm:mx-20" id="projects">
      {props.filterVisible && (
        <StyledBox className="flex h-fit flex-col text-white">
          <div className="mr-6 flex w-full flex-row justify-between">
            <span>Filtre {countFilter > 0 && <span>({countFilter})</span>}</span>
            <button
              className="border-1 rounded border-solid border-gray-800 px-1 py-1 font-bold text-white hover:border-gray-500"
              onClick={clearFilters}
            >
              Réinitialiser
            </button>
          </div>
          <Input
            className="bg-searchFilter h-fit"
            onChange={(e) => setSearch(e.target.value)}
          ></Input>
          <Accordion allowMultiple={true}>
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left">
                    Properties
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <Stack>
                  <Checkbox
                    value="Archived"
                    isChecked={isArchived}
                    onChange={(e) => {
                      setIsArchived(e.target.checked);
                    }}
                  >
                    Archived
                  </Checkbox>
                  <Checkbox
                    value="Private"
                    isChecked={isPrivate}
                    onChange={(e) => {
                      setIsPrivate(e.target.checked);
                    }}
                  >
                    Private
                  </Checkbox>
                </Stack>
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left">
                    Language
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <RadioGroup
                  className="flex flex-col"
                  value={selectedLanguage}
                  onChange={(e) => {
                    if (!languageCountMap.has(e) && e !== 'All') return;

                    setSelectedLanguage(e);
                  }}
                >
                  <Radio value={'All'}>All</Radio>
                  {Array.from(languages).map((lang, index) => (
                    <Radio key={index} value={lang} disabled={!languageCountMap.has(lang)}>
                      {lang}{' '}
                      {languageCountMap.has(lang) && <span>({languageCountMap.get(lang)})</span>}
                    </Radio>
                  ))}
                </RadioGroup>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </StyledBox>
      )}
      <div>
        <div className="flex w-full flex-wrap items-center justify-center gap-x-5 gap-y-5 lg:flex-row">
          {filteredRepo.slice(0, props.limit).map((repo) => (
            <ScaleFade key={repo.id} initialScale={0.9} in={true}>
              <ProjectCard key={repo.id} repo={repo} />
            </ScaleFade>
          ))}
          {filteredRepo.length === 0 && <div>oups</div>}
        </div>
      </div>
      {props.limit && filteredRepo.length > props.limit && (
        <button
          className="border-1 rounded border-solid border-gray-800 px-1 py-1 font-bold text-white hover:border-gray-500"
          onClick={() => {
            router.push('/projects');
          }}
        >
          Show More
        </button>
      )}
    </section>
  );
}
