import { GithubService } from '@/services/GithubService';
import { RepoNotFoundError } from '@/services/exception/GithubErrors';
import { describe, expect, it } from '@jest/globals';

describe('GithubService SSRF Prevention', () => {
  const service = new GithubService();

  it('should return null for invalid repoName in getRepo without making network requests', async () => {
    const result = await service.getRepo('../evil-path');
    expect(result).toBeNull();
  });

  it('should return empty array for invalid repoName in getCollaborators', async () => {
    const result = await service.getCollaborators('evil/repo');
    expect(result).toEqual([]);
  });

  it('should return empty array for invalid repoName in getLanguages', async () => {
    const result = await service.getLanguages('../../test');
    expect(result).toEqual([]);
  });

  it('should return empty array for invalid repoName in getPullRequests', async () => {
    const result = await service.getPullRequests('repo@with@at');
    expect(result).toEqual([]);
  });

  it('should throw RepoNotFoundError for invalid repoName in getAllCommits', async () => {
    await expect(service.getAllCommits('invalid/path/traversal')).rejects.toThrow(
      RepoNotFoundError,
    );
  });

  it('should return empty string for invalid repoName in getReadme', async () => {
    const result = await service.getReadme('../README.md');
    expect(result).toBe('');
  });

  it('should throw Error for invalid username in getUser', async () => {
    await expect(service.getUser('invalid/user')).rejects.toThrow('Invalid username');
  });
});
