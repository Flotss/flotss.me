import { useFetchRepos } from '@/hooks/useFetchRepos';
import useFiltersRepos, { Property } from '@/hooks/useFiltersRepos';
import { useLanguageFilters } from '@/hooks/useLanguageFilters';
import { Repo } from '@/types/types';
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
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import ProjectCard from './Card/ProjectCard';
import ProjectCardSkeleton from './Card/ProjectCardSkeleton';
import { StyledBox } from './StyledBox';
import Title from './Title';

type ReposProps = {
  filterVisible?: boolean;
  limit?: number;
  setReposCount?: (count: number) => void;
  repos?: Repo[];
};

/**
 * The `Repos` component displays a list of GitHub repositories. It fetches data from an API and can also use cached data from localStorage.
 * It handles loading states, error handling, and rendering the repository cards.
 *
 * @returns {JSX.Element} - The rendered Repos component.
 */
const Repos = React.memo((props: ReposProps) => {
  Repos.displayName = 'Repos';
  const { repos, loading } = useFetchRepos(props.repos ?? []);

  const [search, setSearch] = useState('');
  const [isArchived, setIsArchived] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [isFork, setIsFork] = useState(false);
  const properties: Property<boolean>[] = [
    { value: isArchived, setValue: setIsArchived, propertyName: 'archived' },
    { value: isPrivate, setValue: setIsPrivate, propertyName: 'private' },
    { value: isFork, setValue: setIsFork, propertyName: 'fork' },
  ];

  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [isOpenFilterMobile, setIsOpenFilterMobile] = useState(false);
  const [isMobile] = useMediaQuery(`(max-width: ${breakpoints.lg})`);

  const setReposCount = props.setReposCount;

  const { languages, languageCountMap, setLanguageCountMap } = useLanguageFilters(repos);
  const options = {
    properties,
    selectedLanguage,
    search,
    setLanguageCountMap,
  };
  const { filteredRepos, countFilter, repoCount } = useFiltersRepos(repos, options);

  useEffect(() => {
    setReposCount && setReposCount(repoCount);
  }, [setReposCount, repoCount]);

  const router = useRouter();

  const clearFilters = () => {
    properties.forEach((prop) => prop.setValue(false));
    setSelectedLanguage('All');
    setSearch('');
  };

  const skeletons = Array.from({ length: props.limit ?? 6 }).map((_, index) => (
    <ProjectCardSkeleton key={index} isMobile={isMobile} />
  ));

  return (
    <>
      <section
        className={`grid-col-1 ${isMobile ? 'mx-1' : 'mx-5'} grid gap-3 py-8 sm:mx-20 lg:grid-cols-5`}
        id="projects"
      >
        {props.filterVisible && isMobile && (
          <Accordion allowToggle={true}>
            <AccordionItem>
              <h2>
                <AccordionButton
                  className="flex justify-end"
                  onClick={() => {
                    setIsOpenFilterMobile(!isOpenFilterMobile);
                  }}
                >
                  <Box flex="1" textAlign="left" hidden={isOpenFilterMobile}>
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
                  isFork={isFork}
                  setIsFork={setIsFork}
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
            isFork={isFork}
            setIsFork={setIsFork}
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
            languages={languages}
            languageCountMap={languageCountMap}
            clearFilters={clearFilters}
            isMobile={isMobile}
          />
        )}
        <Box
          className={`margin-auto col-span-1 flex w-full flex-wrap items-stretch justify-center gap-x-5 gap-y-5 lg:flex-row ${
            props.filterVisible ? 'lg:col-span-4' : 'lg:col-span-5'
          }`}
        >
          {loading
            ? skeletons
            : filteredRepos.slice(0, props.limit).map((repo) => (
                <ScaleFade key={repo.id} initialScale={0.9} in={true}>
                  <ProjectCard key={repo.id} repo={repo} isMobile={isMobile} />
                </ScaleFade>
              ))}
          {!loading && filteredRepos.length === 0 && (
            <Title
              title="No repositories found"
              className="mt-10 sm:text-xl mdrepo:text-xl lgrepo:text-xl"
            />
          )}
        </Box>
      </section>
      {props.limit && filteredRepos.length > props.limit && (
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
});

export default Repos;

type FilterProps = {
  countFilter: number;
  search: string;
  setSearch: (value: string) => void;
  isArchived: boolean;
  setIsArchived: (value: boolean) => void;
  isPrivate: boolean;
  setIsPrivate: (value: boolean) => void;
  isFork: boolean;
  setIsFork: (value: boolean) => void;
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
    isFork,
    setIsFork,
    selectedLanguage,
    setSelectedLanguage,
    languages,
    languageCountMap,
    clearFilters,
    isMobile,
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
              <Checkbox
                value="Fork"
                isChecked={isFork}
                colorScheme="transparent"
                onChange={(e) => {
                  setIsFork(e.target.checked);
                }}
              >
                Fork
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
