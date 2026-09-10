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

  it('should fetch README using GitHub API with raw accept header', async () => {
    const originalFetch = global.fetch;
    global.fetch = jest.fn().mockImplementation((url: string, options?: any) => {
      if (url.includes('api.github.com/repos/Flotss/FacebookLike/readme')) {
        expect(options?.headers?.Accept).toBe('application/vnd.github.raw');
        return Promise.resolve({
          ok: true,
          text: () => Promise.resolve('# FacebookLike Content'),
        });
      }
      return Promise.resolve({ ok: false, status: 404 });
    }) as any;

    const result = await service.getReadme('FacebookLike');
    expect(result).toBe('# FacebookLike Content');
    global.fetch = originalFetch;
  });

  it('should fallback to raw.githubusercontent.com if GitHub API fails', async () => {
    const originalFetch = global.fetch;
    global.fetch = jest.fn().mockImplementation((url: string) => {
      if (url.includes('api.github.com/repos/Flotss/legacy-repo/readme')) {
        return Promise.resolve({ ok: false, status: 404 });
      }
      if (url.includes('raw.githubusercontent.com/Flotss/legacy-repo/main/README.md')) {
        return Promise.resolve({ ok: false, status: 404 });
      }
      if (url.includes('raw.githubusercontent.com/Flotss/legacy-repo/master/README.md')) {
        return Promise.resolve({
          ok: true,
          text: () => Promise.resolve('# Legacy Master Content'),
        });
      }
      return Promise.resolve({ ok: false, status: 404 });
    }) as any;

    const result = await service.getReadme('legacy-repo');
    expect(result).toBe('# Legacy Master Content');
    global.fetch = originalFetch;
  });

  it('should throw Error for invalid username in getUser', async () => {
    await expect(service.getUser('invalid/user')).rejects.toThrow('Invalid username');
  });

  it('should return null if repository is private in getRepo', async () => {
    const getRepoDataSpy = jest.spyOn(service as any, 'getRepoData').mockResolvedValueOnce({
      id: 1,
      name: 'secret-repo',
      private: true,
    });
    const result = await service.getRepo('secret-repo');
    expect(result).toBeNull();
    getRepoDataSpy.mockRestore();
  });
});
