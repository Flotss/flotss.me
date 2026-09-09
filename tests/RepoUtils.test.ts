import { Repo } from '@/types/types';
import { sortRepos } from '@/utils/RepoUtils';
import { describe, expect, it } from '@jest/globals';

describe('sortRepos', () => {
  it('should sort repos based on pinned, archived, and private status by default', () => {
    const repos = [
      { name: 'Repo 1', pinned: true, archived: false, private: false } as Repo,
      { name: 'Repo 2', pinned: false, archived: false, private: false } as Repo,
      { name: 'Repo 3', pinned: true, archived: true, private: false } as Repo,
      { name: 'Repo 4', pinned: false, archived: true, private: false } as Repo,
      { name: 'Repo 5', pinned: false, archived: false, private: true } as Repo,
    ];

    const sortedRepos = sortRepos(repos);

    expect(sortedRepos[0].name).toBe('Repo 1');
    expect(sortedRepos[1].name).toBe('Repo 2');
    expect(sortedRepos[2].name).toBe('Repo 3');
    expect(sortedRepos[3].name).toBe('Repo 4');
    expect(sortedRepos[4].name).toBe('Repo 5');
  });

  it('should prioritize repos with custom display order (order > 0) above default priority', () => {
    const repos = [
      { name: 'Pinned Default', pinned: true, archived: false, private: false, order: 0 } as Repo,
      { name: 'Rank 2 Repo', pinned: false, archived: false, private: false, order: 2 } as Repo,
      { name: 'Rank 1 Repo', pinned: false, archived: false, private: false, order: 1 } as Repo,
      { name: 'Unranked Public', pinned: false, archived: false, private: false, order: 0 } as Repo,
    ];

    const sorted = sortRepos(repos);

    // Custom order 1 must be first
    expect(sorted[0].name).toBe('Rank 1 Repo');
    // Custom order 2 must be second
    expect(sorted[1].name).toBe('Rank 2 Repo');
    // Default pinned public must be third
    expect(sorted[2].name).toBe('Pinned Default');
    // Unranked public must be fourth
    expect(sorted[3].name).toBe('Unranked Public');
  });

  it('should strictly order multiple repos by ascending order value', () => {
    const repos = [
      { name: 'Third', order: 3 } as Repo,
      { name: 'First', order: 1 } as Repo,
      { name: 'Fourth', order: 4 } as Repo,
      { name: 'Second', order: 2 } as Repo,
    ];

    const sorted = sortRepos(repos);

    expect(sorted.map((r) => r.name)).toEqual(['First', 'Second', 'Third', 'Fourth']);
    expect(sorted.map((r) => r.order)).toEqual([1, 2, 3, 4]);
  });

  it('should sort alphabetically when order and priorities are identical', () => {
    const repos = [
      { name: 'Zebra', pinned: true, archived: false, private: false, order: 0 } as Repo,
      { name: 'Alpha', pinned: true, archived: false, private: false, order: 0 } as Repo,
      { name: 'Beta', pinned: true, archived: false, private: false, order: 0 } as Repo,
    ];

    const sorted = sortRepos(repos);

    expect(sorted.map((r) => r.name)).toEqual(['Alpha', 'Beta', 'Zebra']);
  });
});
