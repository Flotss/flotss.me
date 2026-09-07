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

  const { properties, selectedLanguage, search, setLanguageCountMap } = options;
  const [filteredRepos, setFilteredRepos] = useState<Repo[]>([]);
  const [countFilter, setCountFilter] = useState(0);
  const [repoCount, setRepoCount] = useState(0);

  const propertiesChange = properties.map((property) => property.value).join('');

  useEffect(() => {
    const updateNumberOfFilters = () => {
      let count = 0;
      properties.forEach((property) => {
        if (property.value == true) count++;
      });

      if (selectedLanguage !== 'All') count++;
      if (search.length) count++;
      setCountFilter(count);
    };
    let filtered = [...repos];

    if (search.length) {
      filtered = filtered.filter((repo) => {
        let name = repo.name.toLowerCase();
        let desc = repo.description?.toLowerCase();
        let filterSearch = search.toLowerCase();
        return name.includes(filterSearch) || desc?.includes(filterSearch);
      });
    }

    properties.forEach((property) => {
      if (property.value) {
        filtered = filtered.filter((repo) => (repo as any)[property.propertyName]);
      }
    });

    setLanguageCountMap(getMapCountOfLang(filtered));

    if (selectedLanguage !== 'All') {
      filtered = filtered.filter((repo) => repo.language === selectedLanguage);
    }

    setFilteredRepos(filtered);
    updateNumberOfFilters();
    setRepoCount(filtered.length);
  }, [repos, selectedLanguage, search, propertiesChange, properties, setLanguageCountMap]);

  return { filteredRepos, countFilter, repoCount };
};

export default useFiltersRepos;
