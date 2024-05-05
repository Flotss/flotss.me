/**
 * HTTP headers configuration for making authenticated requests to the GitHub API.
 * This includes the necessary authorization token and API version.
 */
const headers: any = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
  "X-GitHub-Api-Version": "2022-11-28",
};

export default headers;
