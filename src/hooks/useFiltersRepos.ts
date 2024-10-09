import { Repo } from '@/types/types';
import { useEffect, useState } from 'react';

interface FilterOptions {
  isArchived: boolean;
  isPrivate: boolean;
  selectedLanguage: string;
  search: string;
}

const useFiltersRepos = (repos: Repo[], options: FilterOptions) => {
  const [filteredRepos, setFilteredRepos] = useState<Repo[]>([]);
  const [countFilter, setCountFilter] = useState(0);
  const [repoCount, setRepoCount] = useState(0);

  useEffect(() => {
    const updateNumberOfFilters = () => {
      let count = 0;
      if (options.isArchived) count++;
      if (options.isPrivate) count++;
      if (options.selectedLanguage !== 'All') count++;
      if (options.search.length) count++;
      setCountFilter(count);
    };
    // console.log(repos);
    let filtered = [...repos];

    if (options.search.length) {
      filtered = filtered.filter((repo) => {
        let name = repo.name.toLowerCase();
        let desc = repo.description?.toLowerCase();
        let filterSearch = options.search.toLowerCase();
        return name.includes(filterSearch) || desc?.includes(filterSearch);
      });
    }

    if (options.isArchived) {
      filtered = filtered.filter((repo) => repo.archived);
    }

    if (options.isPrivate) {
      filtered = filtered.filter((repo) => repo.private);
    }

    if (options.selectedLanguage !== 'All') {
      filtered = filtered.filter((repo) => repo.language === options.selectedLanguage);
    }

    setFilteredRepos(filtered);
    updateNumberOfFilters();
    setRepoCount(filtered.length);
  }, [repos, options.search, options.isArchived, options.isPrivate, options.selectedLanguage]);

  return { filteredRepos, countFilter, repoCount };
};

export default useFiltersRepos;
