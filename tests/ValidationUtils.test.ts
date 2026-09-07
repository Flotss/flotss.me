import { isValidRepoName, isValidUserName } from '@/utils/ValidationUtils';
import { describe, expect, it } from '@jest/globals';

describe('ValidationUtils', () => {
  describe('isValidRepoName', () => {
    it('should return true for valid repository names', () => {
      expect(isValidRepoName('my-repo')).toBe(true);
      expect(isValidRepoName('flotss.me')).toBe(true);
      expect(isValidRepoName('repo_123')).toBe(true);
      expect(isValidRepoName('react')).toBe(true);
    });

    it('should return false for path traversal attempts', () => {
      expect(isValidRepoName('../evil')).toBe(false);
      expect(isValidRepoName('repo/../sub')).toBe(false);
      expect(isValidRepoName('..')).toBe(false);
      expect(isValidRepoName('.repo')).toBe(false);
      expect(isValidRepoName('repo.')).toBe(false);
      expect(isValidRepoName('../../etc/passwd')).toBe(false);
      expect(isValidRepoName('repo/with/slash')).toBe(false);
      expect(isValidRepoName('repo\\backslash')).toBe(false);
    });

    it('should return false for invalid characters and protocols', () => {
      expect(isValidRepoName('http://evil.com')).toBe(false);
      expect(isValidRepoName('repo%20name')).toBe(false);
      expect(isValidRepoName('repo@name')).toBe(false);
      expect(isValidRepoName('repo:name')).toBe(false);
      expect(isValidRepoName('repo?query=1')).toBe(false);
      expect(isValidRepoName('repo#hash')).toBe(false);
      expect(isValidRepoName('repo name')).toBe(false);
    });

    it('should return false for invalid types, empty or oversized names', () => {
      expect(isValidRepoName('')).toBe(false);
      expect(isValidRepoName('   ')).toBe(false);
      expect(isValidRepoName(' repo')).toBe(false);
      expect(isValidRepoName('repo ')).toBe(false);
      expect(isValidRepoName(null)).toBe(false);
      expect(isValidRepoName(undefined)).toBe(false);
      expect(isValidRepoName(123)).toBe(false);
      expect(isValidRepoName({} as any)).toBe(false);
      expect(isValidRepoName('a'.repeat(101))).toBe(false);
    });
  });

  describe('isValidUserName', () => {
    it('should return true for valid usernames', () => {
      expect(isValidUserName('Flotss')).toBe(true);
      expect(isValidUserName('octocat')).toBe(true);
      expect(isValidUserName('user-name-123')).toBe(true);
    });

    it('should return false for invalid usernames', () => {
      expect(isValidUserName('../user')).toBe(false);
      expect(isValidUserName('user/traversal')).toBe(false);
      expect(isValidUserName('user@domain')).toBe(false);
      expect(isValidUserName('user:colon')).toBe(false);
      expect(isValidUserName('user%20name')).toBe(false);
      expect(isValidUserName('')).toBe(false);
      expect(isValidUserName(' user')).toBe(false);
      expect(isValidUserName('user ')).toBe(false);
      expect(isValidUserName(null)).toBe(false);
      expect(isValidUserName(undefined)).toBe(false);
      expect(isValidUserName('-invalid-start')).toBe(false);
      expect(isValidUserName('invalid-end-')).toBe(false);
      expect(isValidUserName('a'.repeat(40))).toBe(false);
    });
  });
});
