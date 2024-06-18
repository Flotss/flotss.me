import { Repo } from '@/types/types';
import { sortRepos } from '@/utils/RepoUtils';

describe('sortRepos', () => {
  it('should sort repos based on pinned, archived, and private status', () => {
    const repos = [
      { name: 'Repo 1', pinned: true, archived: false, private: false } as Repo,
      { name: 'Repo 2', pinned: false, archived: false, private: false } as Repo,
      { name: 'Repo 3', pinned: true, archived: true, private: false } as Repo,
      { name: 'Repo 4', pinned: false, archived: true, private: false } as Repo,
      { name: 'Repo 5', pinned: false, archived: false, private: true } as Repo,
    ];

    const sortedRepos = sortRepos(repos);

    // Repo 1 should be pinned, not archived, and not private
    expect(sortedRepos[0].name).toBe('Repo 1');

    // Repo 4 should be pinned, archived, and not private
    expect(sortedRepos[1].name).toBe('Repo 2');

    // Repo 6 should not be pinned, not archived, and not private
    expect(sortedRepos[2].name).toBe('Repo 3');

    // Repo 2 should not be pinned, archived, and not private
    expect(sortedRepos[3].name).toBe('Repo 4');

    // Repo 3 should not be pinned, not archived, and private
    expect(sortedRepos[4].name).toBe('Repo 5');
  });
});
