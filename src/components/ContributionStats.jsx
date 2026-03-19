import { getContributionStats } from '../utils/dataProcessing'

function ContributionStats({ events }) {
  const { prs, commits, issues } = getContributionStats(events)

  const stats = [
    {
      label: "PRs Opened",
      value: prs,
      icon: "🔀",
      description: "in last 90 events",
      color: '#a78bfa',
      bg: 'rgba(167,139,250,0.1)',
      border: 'rgba(167,139,250,0.2)',
      glow: 'rgba(167,139,250,0.15)'
    },
    {
      label: "Commits",
      value: commits,
      icon: "📝",
      description: "in last 30 days",
      color: '#38bdf8',
      bg: 'rgba(56,189,248,0.1)',
      border: 'rgba(56,189,248,0.2)',
      glow: 'rgba(56,189,248,0.15)'
    },
    {
      label: "Issues Opened",
      value: issues,
      icon: "🐛",
      description: "in last 90 events",
      color: '#34d399',
      bg: 'rgba(52,211,153,0.1)',
      border: 'rgba(52,211,153,0.2)',
      glow: 'rgba(52,211,153,0.15)'
    },
  ]

  return (
    <div
      className="rounded-2xl p-6 shadow-lg"
      style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      <h3 className="text-white text-lg font-semibold mb-6">
        Contributions Overview
      </h3>

      <div className="grid grid-cols-3 gap-4">
        {stats.map(stat => (
          <div
            key={stat.label}
            className="rounded-xl p-5 text-center transition-all duration-300 hover:-translate-y-1"
            style={{
              background: stat.bg,
              border: `1px solid ${stat.border}`,
              boxShadow: `0 4px 20px ${stat.glow}`
            }}
          >
            <div className="text-3xl mb-3">{stat.icon}</div>
            <p
              className="text-4xl font-bold mb-1 font-mono"
              style={{
                color: stat.color,
                textShadow: `0 0 20px ${stat.color}`
              }}
            >
              {stat.value}
            </p>
            <p className="text-white text-sm font-medium mb-1">
              {stat.label}
            </p>
            <p className="text-gray-600 text-xs">
              {stat.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ContributionStats