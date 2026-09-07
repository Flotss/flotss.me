/**
 * Security validation utilities to prevent SSRF (Server-Side Request Forgery)
 * and malicious input injection in GitHub API and upstream requests.
 */

// GitHub repository name rules:
// - Can contain alphanumeric characters, hyphens, underscores, and dots.
// - Max 100 characters.
// - Must not start or end with a dot, must not contain consecutive dots (".."),
//   and must not contain path traversal characters ('/' or '\').
export const GITHUB_REPO_REGEX = /^[a-zA-Z0-9_.-]+$/;

// GitHub username rules:
// - Max 39 characters.
// - Alphanumeric with single hyphens (cannot start or end with a hyphen).
export const GITHUB_USER_REGEX = /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/;

export function isValidRepoName(repoName: unknown): repoName is string {
  if (typeof repoName !== 'string') return false;
  const trimmed = repoName.trim();
  if (trimmed !== repoName) return false;
  if (trimmed.length === 0 || trimmed.length > 100) return false;
  if (!GITHUB_REPO_REGEX.test(trimmed)) return false;
  if (
    trimmed.startsWith('.') ||
    trimmed.endsWith('.') ||
    trimmed.includes('..') ||
    trimmed.includes('/') ||
    trimmed.includes('\\') ||
    trimmed.includes('%') ||
    trimmed.includes('@') ||
    trimmed.includes(':')
  ) {
    return false;
  }
  return true;
}

export function isValidUserName(userName: unknown): userName is string {
  if (typeof userName !== 'string') return false;
  const trimmed = userName.trim();
  if (trimmed !== userName) return false;
  if (trimmed.length === 0 || trimmed.length > 39) return false;
  if (!GITHUB_USER_REGEX.test(trimmed)) return false;
  if (
    trimmed.includes('..') ||
    trimmed.includes('/') ||
    trimmed.includes('\\') ||
    trimmed.includes('%') ||
    trimmed.includes('@') ||
    trimmed.includes(':')
  ) {
    return false;
  }
  return true;
}
