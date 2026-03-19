export function getLanguageStats(repos) {
  const map = {};
  repos.forEach(repo => {
    const lang = repo.language;
    if (!lang) return;
    map[lang] = (map[lang] || 0) + 1;
  });
  return map;
}

export function getTopRepo(repos) {
  if (!repos.length) return null;
  return repos.reduce((max, repo) =>
    repo.stargazers_count > max.stargazers_count ? repo : max
  );
}

export function getTopRepos(repos) {
  return [...repos]
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 5);
}

export function getTotalStars(repos) {
  return repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
}

export function getMostUsedLanguage(repos) {
  const stats = getLanguageStats(repos);
  if (!Object.keys(stats).length) return "N/A";
  return Object.entries(stats)
    .sort((a, b) => b[1] - a[1])[0][0];
}

// NEW FUNCTIONS BELOW

export function getTotalPRs(events) {
  return events.filter(e => e.type === 'PullRequestEvent').length
}

export function getTotalCommits(events) {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  return events
    .filter(e => {
      if (e.type !== 'PushEvent') return false
      return new Date(e.created_at) >= thirtyDaysAgo
    })
    .reduce((total, e) => total + (e.payload.commits?.length || 0), 0)
}

export function getTotalIssues(events) {
  return events.filter(e => e.type === 'IssuesEvent').length
}

export function getContributionStats(events) {
  return {
    prs: getTotalPRs(events),
    commits: getTotalCommits(events),
    issues: getTotalIssues(events),
  }
}