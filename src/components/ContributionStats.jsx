import { getContributionStats } from '../utils/dataProcessing'

function ContributionStats({ events }) {
  const { prs, commits, issues } = getContributionStats(events)

  const stats = [
    {
      label: "PRs Opened",
      value: prs,
      icon: "🔀",
      description: "Pull requests in last 90 events",
      color: "text-purple-400"
    },
    {
      label: "Commits",
      value: commits,
      icon: "📝",
      description: "Commits in last 30 days",
      color: "text-blue-400"
    },
    {
      label: "Issues Opened",
      value: issues,
      icon: "🐛",
      description: "Issues in last 90 events",
      color: "text-green-400"
    },
  ]

  return (
    <div className="bg-gray-800 rounded-2xl p-6 shadow-lg">
      <h3 className="text-white text-lg font-semibold mb-6">
        Contributions Overview
      </h3>

      <div className="grid grid-cols-3 gap-4">
        {stats.map(stat => (
          <div
            key={stat.label}
            className="bg-gray-900 rounded-xl p-5 text-center border border-gray-700 hover:border-gray-500 transition"
          >
            <div className="text-3xl mb-2">{stat.icon}</div>
            <p className={`text-3xl font-bold ${stat.color} mb-1`}>
              {stat.value}
            </p>
            <p className="text-white text-sm font-medium">
              {stat.label}
            </p>
            <p className="text-gray-500 text-xs mt-1">
              {stat.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ContributionStats