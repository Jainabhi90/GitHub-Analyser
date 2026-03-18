import { getTotalStars, getMostUsedLanguage, getTopRepo } from '../utils/dataProcessing'

function RepoStats({ repos, user }) {
  const totalStars = getTotalStars(repos)
  const topLanguage = getMostUsedLanguage(repos)
  const topRepo = getTopRepo(repos)

  const stats = [
    {
      label: "Total Repos",
      value: repos.length,
      icon: "📁",
      link: null
    },
    {
      label: "Total Stars",
      value: totalStars.toLocaleString(),
      icon: "⭐",
      link: null
    },
    {
      label: "Top Language",
      value: topLanguage,
      icon: "💻",
      link: null
    },
    {
      label: "Most Starred",
      value: topRepo ? topRepo.name : "N/A",
      icon: "🏆",
      link: topRepo ? topRepo.html_url : null
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto px-4">
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className="glass rounded-xl p-5 text-center card-hover animate-fadeInUp"
          style={{
            animationDelay: `${i * 0.1}s`,
            background: 'linear-gradient(135deg, rgba(59,130,246,0.05), rgba(139,92,246,0.05))'
          }}
        >
          <div className="text-2xl mb-2">{stat.icon}</div>
          {stat.link ? (
            <a
              href={stat.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 text-lg font-bold hover:text-blue-300 transition hover:underline break-all"
            >
              {stat.value}
            </a>
          ) : (
            <p className="text-blue-400 text-xl font-bold">{stat.value}</p>
          )}
          <p className="text-gray-500 text-xs mt-1">{stat.label}</p>
        </div>
      ))}
    </div>
  )
}

export default RepoStats