import { Repo } from '@/types/types';
import { getMapCountOfLang, sortRepos } from '@/utils/RepoUtils';
import assert from 'assert';
import { useEffect, useMemo } from 'react';

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

  const propertiesChange = properties
    .map((property) => `${property.propertyName}:${property.value}`)
    .join(';');

  const filteredRepos = useMemo(() => {
    let filtered = [...repos];

    if (search.length) {
      const filterSearch = search.toLowerCase();
      filtered = filtered.filter((repo) => {
        const name = repo.name.toLowerCase();
        const desc = repo.description?.toLowerCase();
        return name.includes(filterSearch) || desc?.includes(filterSearch);
      });
    }

    properties.forEach((property) => {
      if (property.value) {
        filtered = filtered.filter((repo) => (repo as any)[property.propertyName]);
      }
    });

    if (selectedLanguage !== 'All') {
      filtered = filtered.filter((repo) => repo.language === selectedLanguage);
    }

    return sortRepos(filtered);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repos, search, selectedLanguage, propertiesChange]);

  const countFilter = useMemo(() => {
    let count = 0;
    properties.forEach((property) => {
      if (property.value) count++;
    });

    if (selectedLanguage !== 'All') count++;
    if (search.length) count++;
    return count;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLanguage, search, propertiesChange]);

  const repoCount = filteredRepos.length;

  useEffect(() => {
    setLanguageCountMap(getMapCountOfLang(filteredRepos));
  }, [filteredRepos, setLanguageCountMap]);

  return { filteredRepos, countFilter, repoCount };
};

export default useFiltersRepos;
