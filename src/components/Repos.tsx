import { Repo } from '@/types/types';
import { sortRepos } from '@/utils/RepoUtils';
import { breakpoints } from '@/utils/tailwindBreakpoints';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Checkbox,
  Input,
  Radio,
  RadioGroup,
  ScaleFade,
  Stack,
  useMediaQuery,
  useToast,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ProjectCard from './Card/ProjectCard';
import ProjectCardSkeleton from './Card/ProjectCardSkeleton';
import { StyledBox } from './StyledBox';

type ReposProps = {
  filterVisible?: boolean;
  limit?: number;
  onReposCount?: (count: number) => void;
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

  const [isMobile] = useMediaQuery(`(max-width: ${breakpoints.lg})`);
  const [isOpenFilterMobile, setIsOpenFilterMobile] = useState(false);

  const onReposCount = props.onReposCount;

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
    return new Set<string>(
      reposParam
        .map((repo) => repo.language)
        .filter((language) => language !== null)
        .sort(),
    );
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
      const repositoryArray = sortRepos(data);

      const reposData = {
        repos: repositoryArray,
        lastRequestDate: new Date().getTime(),
      };

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
        reposs = sortRepos(reposs);
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
        let desc = repo.description?.toLowerCase();
        let filterSearch = search.toLowerCase();
        return name.includes(filterSearch) || desc?.includes(filterSearch);
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
    onReposCount && onReposCount(filteredRepos.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repos, isArchived, isPrivate, selectedLanguage, search]);

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
    <>
      <section className="grid-col-1 mx-5 grid gap-3 py-8 sm:mx-20 lg:grid-cols-5" id="projects">
        {props.filterVisible && isMobile && (
          <Accordion allowToggle={true}>
            <AccordionItem
              onClick={() => {
                setIsOpenFilterMobile(!isOpenFilterMobile);
              }}
            >
              <h2>
                <AccordionButton className="flex justify-end">
                  <Box flex="1" textAlign="left" hidden={!isOpenFilterMobile}>
                    Filters
                  </Box>
                  <AccordionIcon float={'right'} />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <Filters
                  countFilter={countFilter}
                  search={search}
                  setSearch={setSearch}
                  isArchived={isArchived}
                  setIsArchived={setIsArchived}
                  isPrivate={isPrivate}
                  setIsPrivate={setIsPrivate}
                  selectedLanguage={selectedLanguage}
                  setSelectedLanguage={setSelectedLanguage}
                  languages={languages}
                  languageCountMap={languageCountMap}
                  clearFilters={clearFilters}
                  isMobile={isMobile}
                />
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        )}
        {props.filterVisible && !isMobile && (
          <Filters
            countFilter={countFilter}
            search={search}
            setSearch={setSearch}
            isArchived={isArchived}
            setIsArchived={setIsArchived}
            isPrivate={isPrivate}
            setIsPrivate={setIsPrivate}
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
            languages={languages}
            languageCountMap={languageCountMap}
            clearFilters={clearFilters}
            isMobile={isMobile}
          />
        )}
        <div
          className={`col-span-1 flex w-full flex-wrap items-stretch justify-center gap-x-5 gap-y-5 lg:flex-row ${
            props.filterVisible ? 'lg:col-span-4' : 'lg:col-span-5'
          }`}
        >
          {filteredRepo.slice(0, props.limit).map((repo) => (
            <ScaleFade key={repo.id} initialScale={0.9} in={true}>
              <ProjectCard key={repo.id} repo={repo} />
            </ScaleFade>
          ))}
          {filteredRepo.length === 0 && <div>oups</div>}
        </div>
      </section>
      {props.limit && filteredRepo.length > props.limit && (
        <Box className="mb-5 flex justify-center">
          <button
            className="w-6/12 rounded-md bg-black px-4 py-2 text-white transition duration-300 ease-in-out hover:bg-[#212120]"
            onClick={() => {
              router.push('/projects');
            }}
          >
            <b>Show More</b>
          </button>
        </Box>
      )}
    </>
  );
}

type FilterProps = {
  countFilter: number;
  search: string;
  setSearch: (value: string) => void;
  isArchived: boolean;
  setIsArchived: (value: boolean) => void;
  isPrivate: boolean;
  setIsPrivate: (value: boolean) => void;
  selectedLanguage: string;
  setSelectedLanguage: (value: string) => void;
  languages: Set<string>;
  languageCountMap: Map<string, number>;
  clearFilters: () => void;
  isMobile?: boolean;
};

const Filters = (props: FilterProps) => {
  const {
    countFilter,
    search,
    setSearch,
    isArchived,
    setIsArchived,
    isPrivate,
    setIsPrivate,
    selectedLanguage,
    setSelectedLanguage,
    languages,
    languageCountMap,
    clearFilters,
  } = props;

  return (
    <StyledBox className="col-span-5 flex h-fit min-w-[165px] flex-col text-white lg:col-span-1">
      <div className="mr-6 flex w-full flex-row items-center justify-between">
        <span>Filters {countFilter > 0 && <span>({countFilter})</span>}</span>
        <Button
          size="sm"
          colorScheme="red"
          variant="outline"
          onClick={clearFilters}
          visibility={countFilter > 0 ? 'visible' : 'hidden'}
        >
          Reset
        </Button>
      </div>
      <Input
        className="my-4 rounded-md ring-orange-500"
        placeholder="Search for a project"
        size="sm"
        value={search}
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
                colorScheme="transparent"
                onChange={(e) => {
                  setIsArchived(e.target.checked);
                }}
              >
                Archived
              </Checkbox>
              <Checkbox
                value="Private"
                isChecked={isPrivate}
                colorScheme="transparent"
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
              colorScheme="transparent"
              onChange={(e) => {
                if (!languageCountMap.has(e) && e !== 'All') return;

                setSelectedLanguage(e);
              }}
            >
              <Radio value={'All'}>All</Radio>
              {Array.from(languages).map((lang, index) => (
                <Radio key={index} value={lang} disabled={!languageCountMap.has(lang)}>
                  {lang} {languageCountMap.has(lang) && <span>({languageCountMap.get(lang)})</span>}
                </Radio>
              ))}
            </RadioGroup>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </StyledBox>
  );
};
