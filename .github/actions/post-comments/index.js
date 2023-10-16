const core = require("@actions/core");

const baseHeaders = {
  Accept: "application/vnd.github.v3+json",
  "Content-Type": "application/json",
  Authorization: `token [token]`,
  "User-Agent": "tokopedia-lite-pull-request-bot",
};

const defaultUrl = "https://api.github.com/repos/tokopedia/tokopedia-lite";

const getGitApiUrl = (repositoryName) => {
  if (repositoryName) {
    return `https://api.github.com/repos/${decodeURIComponent(repositoryName)}`;
  }

  return defaultUrl;
};

(async function addComment() {
  await fetch(`${getGitApiUrl(gitRepo)}/issues/${issueNumber}/comments`, {
    method: "POST",
    headers: baseHeaders,
    body: JSON.stringify(messageBody),
  });
})();
