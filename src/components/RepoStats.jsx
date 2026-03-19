import { getTotalStars, getMostUsedLanguage, getTopRepo } from '../utils/dataProcessing'

function RepoStats({ repos }) {
  const totalStars = getTotalStars(repos)
  const topLanguage = getMostUsedLanguage(repos)
  const topRepo = getTopRepo(repos)
  const totalForks = repos.reduce((sum, r) => sum + r.forks_count, 0)
  const mostForked = repos.reduce((max, r) =>
    r.forks_count > max.forks_count ? r : max, repos[0])

  const stats = [
    {
      tag: "REPOS",
      value: repos.length,
      label: "Public Repositories",
      sub: `${repos.filter(r => r.fork).length} forks · ${repos.filter(r => !r.fork).length} original`,
    },
    {
      tag: "STARS",
      value: totalStars.toLocaleString(),
      label: "Total Stars Earned",
      sub: topRepo ? `Top: ${topRepo.name} (${topRepo.stargazers_count} ★)` : '',
    },
    {
      tag: "FORKS",
      value: totalForks.toLocaleString(),
      label: "Total Forks",
      sub: mostForked ? `Most forked: ${mostForked.name}` : '',
    },
    {
      tag: "LANGUAGE",
      value: topLanguage,
      label: "Top Language",
      sub: `Across ${repos.filter(r => r.language === topLanguage).length} repos`,
    },
  ]

  const topRepoData = getTopRepo(repos)

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Main stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div
            key={stat.tag}
            className="brut-card p-6 animate-fadeInUp"
            style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}
          >
            <span className="brut-tag mb-4 block">{stat.tag}</span>
            <p className="mono text-3xl font-bold text-black mb-1">
              {stat.value}
            </p>
            <p className="text-sm font-medium text-black mb-2">
              {stat.label}
            </p>
            {stat.sub && (
              <p className="text-xs text-gray-500 mono leading-relaxed">
                {stat.sub}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Top repo highlight */}
      {topRepoData && (
        <div className="brut-card-yellow p-6 animate-fadeInUp delay-400">
  <div className="flex items-start justify-between flex-wrap gap-4">
    <div>
      <span className="brut-tag-dark mb-4 block">MOST STARRED REPO</span>
      <a
        href={topRepoData.html_url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-3xl font-bold text-black hover:underline block mt-3"
      >
        {topRepoData.name} →
      </a>
      {topRepoData.description && (
        <p className="text-gray-800 text-sm mt-3 max-w-lg">
          {topRepoData.description}
        </p>
      )}
    </div>
    <div className="flex gap-8">
      <div className="text-center">
        <p className="mono text-4xl font-bold text-black">
          {topRepoData.stargazers_count}
        </p>
        <p className="text-xs uppercase tracking-wider text-gray-700 mt-2">
          Stars
        </p>
      </div>
      <div className="text-center">
        <p className="mono text-4xl font-bold text-black">
          {topRepoData.forks_count}
        </p>
        <p className="text-xs uppercase tracking-wider text-gray-700 mt-2">
          Forks
        </p>
      </div>
    </div>
  </div>
</div>
      )}
    </div>
  )
}

export default RepoStats