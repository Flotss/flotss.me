/**
 * @jest-environment node
 */
import { prisma } from '../src/lib/prisma';
import {
  createIfNotExists,
  getLanguageValues,
  getMapCountOfLang,
  sortRepos,
} from '@/utils/RepoUtils';
import { Repo } from '@/types/types';

jest.mock('../src/lib/prisma', () => ({
  prisma: {
    repoDB: {
      findMany: jest.fn(),
      createMany: jest.fn(),
    },
  },
}));

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

describe('getLanguageValues and getMapCountOfLang', () => {
  it('should ignore empty, whitespace, and null language strings in getLanguageValues', () => {
    const repos = [
      { name: 'Repo 1', language: 'TypeScript' } as Repo,
      { name: 'Repo 2', language: '' } as Repo,
      { name: 'Repo 3', language: '   ' } as Repo,
      { name: 'Repo 4', language: null as any } as Repo,
      { name: 'Repo 5', language: 'Python' } as Repo,
    ];

    const languages = getLanguageValues(repos);

    expect(Array.from(languages)).toEqual(['Python', 'TypeScript']);
    expect(languages.has('')).toBe(false);
  });

  it('should only count valid, trimmed languages in getMapCountOfLang', () => {
    const repos = [
      { name: 'Repo 1', language: 'TypeScript' } as Repo,
      { name: 'Repo 2', language: ' TypeScript ' } as Repo,
      { name: 'Repo 3', language: '' } as Repo,
      { name: 'Repo 4', language: '   ' } as Repo,
      { name: 'Repo 5', language: 'Java' } as Repo,
    ];

    const countMap = getMapCountOfLang(repos);

    expect(countMap.get('TypeScript')).toBe(2);
    expect(countMap.get('Java')).toBe(1);
    expect(countMap.has('')).toBe(false);
  });
});

describe('createIfNotExists', () => {
  it('should do nothing when repos array is empty', async () => {
    (prisma.repoDB.findMany as jest.Mock).mockClear();
    (prisma.repoDB.createMany as jest.Mock).mockClear();

    await createIfNotExists([]);

    expect(prisma.repoDB.findMany).not.toHaveBeenCalled();
    expect(prisma.repoDB.createMany).not.toHaveBeenCalled();
  });

  it('should batch find existing repos and create missing ones in a single query', async () => {
    (prisma.repoDB.findMany as jest.Mock).mockReset();
    (prisma.repoDB.createMany as jest.Mock).mockReset();

    (prisma.repoDB.findMany as jest.Mock).mockResolvedValue([{ repoId: 101 }]);
    (prisma.repoDB.createMany as jest.Mock).mockResolvedValue({ count: 1 });

    const repos = [
      { id: 101, name: 'ExistingRepo', description: 'desc1', url: 'https://github.com/1' } as Repo,
      { id: 102, name: 'NewRepo', description: 'desc2', url: 'https://github.com/2' } as Repo,
    ];

    await createIfNotExists(repos);

    expect(prisma.repoDB.findMany).toHaveBeenCalledTimes(1);
    expect(prisma.repoDB.createMany).toHaveBeenCalledTimes(1);
    expect(prisma.repoDB.createMany).toHaveBeenCalledWith({
      data: [
        {
          repoId: 102,
          description: 'desc2',
          name: 'NewRepo',
          url: 'https://github.com/2',
        },
      ],
      skipDuplicates: true,
    });
  });

  it('should not call createMany if all repos already exist', async () => {
    (prisma.repoDB.findMany as jest.Mock).mockReset();
    (prisma.repoDB.createMany as jest.Mock).mockReset();

    (prisma.repoDB.findMany as jest.Mock).mockResolvedValue([{ repoId: 101 }, { repoId: 102 }]);

    const repos = [
      { id: 101, name: 'Repo1', description: 'desc1', url: 'https://github.com/1' } as Repo,
      { id: 102, name: 'Repo2', description: 'desc2', url: 'https://github.com/2' } as Repo,
    ];

    await createIfNotExists(repos);

    expect(prisma.repoDB.findMany).toHaveBeenCalledTimes(1);
    expect(prisma.repoDB.createMany).not.toHaveBeenCalled();
  });
});
