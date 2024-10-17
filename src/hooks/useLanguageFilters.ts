import { Repo } from '@/types/types';
import { getLanguageValues, getMapCountOfLang } from '@/utils/RepoUtils';
import { useEffect, useState } from 'react';

export function useLanguageFilters(repos: Repo[]) {
  const [languages, setLanguages] = useState<Set<string>>(new Set());
  const [languageCountMap, setLanguageCountMap] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    setLanguages(getLanguageValues(repos));
    setLanguageCountMap(getMapCountOfLang(repos));
  }, [repos]);

  return { languages, languageCountMap, setLanguageCountMap };
}
