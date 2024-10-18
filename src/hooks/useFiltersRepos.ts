import { Repo } from '@/types/types';
import { getMapCountOfLang } from '@/utils/RepoUtils';
import assert from 'assert';
import { useEffect, useState } from 'react';

export interface Property<T> {
  value: T;
  setValue: (value: T) => void;
  propertyName: string;
}

interface FilterOptions {
  properties: Property<boolean>[];
  selectedLanguage: string;
  search: string;
  setLanguageCountMap: (map: Map<string, number>) => void;
}

const useFiltersRepos = (repos: Repo[], options: FilterOptions) => {
  assert(options.properties != null, 'Provide properties parameters');

  const [filteredRepos, setFilteredRepos] = useState<Repo[]>([]);
  const [countFilter, setCountFilter] = useState(0);
  const [repoCount, setRepoCount] = useState(0);

  const propertiesChange = options.properties.map((property) => property.value).join('');

  useEffect(() => {
    const updateNumberOfFilters = () => {
      let count = 0;
      options.properties.forEach((property) => {
        if (property.value == true) count++;
      });

      if (options.selectedLanguage !== 'All') count++;
      if (options.search.length) count++;
      setCountFilter(count);
    };
    let filtered = [...repos];

    if (options.search.length) {
      filtered = filtered.filter((repo) => {
        let name = repo.name.toLowerCase();
        let desc = repo.description?.toLowerCase();
        let filterSearch = options.search.toLowerCase();
        return name.includes(filterSearch) || desc?.includes(filterSearch);
      });
    }

    options.properties.forEach((property) => {
      if (property.value) {
        filtered = filtered.filter((repo) => (repo as any)[property.propertyName]);
      }
    });

    options.setLanguageCountMap(getMapCountOfLang(filtered));

    if (options.selectedLanguage !== 'All') {
      filtered = filtered.filter((repo) => repo.language === options.selectedLanguage);
    }

    setFilteredRepos(filtered);
    updateNumberOfFilters();
    setRepoCount(filtered.length);
  }, [repos, options.selectedLanguage, options.search, propertiesChange]);

  return { filteredRepos, countFilter, repoCount };
};

export default useFiltersRepos;
