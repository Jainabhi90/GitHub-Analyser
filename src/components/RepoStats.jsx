import { getTotalStars, getMostUsedLanguage, getTopRepo } from '../utils/dataProcessing'

function RepoStats({ repos, user }) {
  const totalStars = getTotalStars(repos)
  const topLanguage = getMostUsedLanguage(repos)
  const topRepo = getTopRepo(repos)

  const stats = [
    {
      label: "Total Repos",
      value: repos.length,
      link: null
    },
    {
      label: "Total Stars",
      value: totalStars,
      link: null
    },
    {
      label: "Top Language",
      value: topLanguage,
      link: null
    },
    {
      label: "Most Starred",
      value: topRepo ? topRepo.name : "N/A",
      link: topRepo ? topRepo.html_url : null
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto my-8 px-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-gray-800 rounded-xl p-5 text-center shadow"
        >
         {stat.link ? (
            <a href={stat.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-xl font-bold hover:text-blue-300 hover:underline transition break-all">
              {stat.value}
            </a>
          ) : (
            <p className="text-blue-400 text-2xl font-bold">{stat.value}</p>
          )}
          <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
        </div>
      ))}
    </div>
  )
}

export default RepoStats