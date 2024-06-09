export class GithubError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = 'GithubError';
    }
}

export class RateLimitError extends GithubError {
    constructor(message?: string) {
        super(message);
        this.name = 'RateLimitError';
    }
}

export class RepoNotFoundError extends GithubError {
    constructor(message?: string) {
        super(message);
        this.name = 'RepoNotFoundError';
    }
}