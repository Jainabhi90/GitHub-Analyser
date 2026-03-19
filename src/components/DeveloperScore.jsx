import { getContributionStats } from '../utils/dataProcessing'

function DeveloperScore({ user, repos, events }) {
  const { prs, commits, issues } = getContributionStats(events)
  const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0)

  function scoreFollowers(f) {
    if (f >= 10000) return 1
    if (f >= 1000)  return 0.8
    if (f >= 500)   return 0.6
    if (f >= 100)   return 0.4
    if (f >= 10)    return 0.2
    return 0.05
  }

  function scoreStars(s) {
    if (s >= 10000) return 1
    if (s >= 1000)  return 0.8
    if (s >= 500)   return 0.6
    if (s >= 100)   return 0.4
    if (s >= 10)    return 0.2
    return 0.05
  }

  function scoreCommits(c) {
    if (c >= 100) return 1
    if (c >= 50)  return 0.8
    if (c >= 20)  return 0.6
    if (c >= 10)  return 0.4
    if (c >= 3)   return 0.2
    return 0.05
  }

  function scorePRs(p) {
    if (p >= 50) return 1
    if (p >= 20) return 0.8
    if (p >= 10) return 0.6
    if (p >= 5)  return 0.4
    if (p >= 1)  return 0.2
    return 0
  }

  function scoreRepos(r) {
    if (r >= 100) return 1
    if (r >= 50)  return 0.8
    if (r >= 20)  return 0.6
    if (r >= 10)  return 0.4
    if (r >= 5)   return 0.2
    return 0.05
  }

  function scoreIssues(i) {
    if (i >= 20) return 1
    if (i >= 10) return 0.8
    if (i >= 5)  return 0.6
    if (i >= 2)  return 0.4
    if (i >= 1)  return 0.2
    return 0
  }

  const raw =
    scoreFollowers(user.followers) * 0.20 +
    scoreStars(totalStars)         * 0.20 +
    scoreCommits(commits)          * 0.20 +
    scorePRs(prs)                  * 0.15 +
    scoreRepos(repos.length)       * 0.15 +
    scoreIssues(issues)            * 0.10

  const score = Math.round(raw * 10 * 10) / 10

  function getLevel(s) {
    if (s >= 9) return { label: 'Elite Developer',        color: '#f59e0b', ring: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.3)'  }
    if (s >= 7) return { label: 'Advanced Developer',     color: '#a78bfa', ring: '#a78bfa', bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.3)' }
    if (s >= 5) return { label: 'Intermediate Developer', color: '#38bdf8', ring: '#38bdf8', bg: 'rgba(56,189,248,0.1)',  border: 'rgba(56,189,248,0.3)'  }
    if (s >= 3) return { label: 'Junior Developer',       color: '#34d399', ring: '#34d399', bg: 'rgba(52,211,153,0.1)',  border: 'rgba(52,211,153,0.3)'  }
    return        { label: 'Beginner Developer',          color: '#94a3b8', ring: '#94a3b8', bg: 'rgba(148,163,184,0.1)', border: 'rgba(148,163,184,0.3)' }
  }

  const level = getLevel(score)

  const breakdown = [
    {
      label: 'Followers',
      value: user.followers.toLocaleString(),
      score: scoreFollowers(user.followers),
      weight: '20%',
      color: '#f472b6'
    },
    {
      label: 'Total Stars',
      value: totalStars.toLocaleString(),
      score: scoreStars(totalStars),
      weight: '20%',
      color: '#fbbf24'
    },
    {
      label: 'Commits (30d)',
      value: commits,
      score: scoreCommits(commits),
      weight: '20%',
      color: '#34d399'
    },
    {
      label: 'PRs Opened',
      value: prs,
      score: scorePRs(prs),
      weight: '15%',
      color: '#a78bfa'
    },
    {
      label: 'Repos',
      value: repos.length,
      score: scoreRepos(repos.length),
      weight: '15%',
      color: '#38bdf8'
    },
    {
      label: 'Issues',
      value: issues,
      score: scoreIssues(issues),
      weight: '10%',
      color: '#fb923c'
    },
  ]

  // SVG circle
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 10) * circumference

  return (
    <div
      className="rounded-2xl p-6 shadow-lg"
      style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #1e293b 100%)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <h3 className="text-white text-lg font-semibold mb-6">
        Developer Score
      </h3>

      <div className="flex flex-col md:flex-row gap-8 items-start">

        {/* Left — Circle */}
        <div className="flex flex-col items-center flex-shrink-0 mx-auto md:mx-0">
          <div className="relative w-40 h-40">
            <svg width="160" height="160" viewBox="0 0 160 160">
              {/* Background ring */}
              <circle
                cx="80" cy="80" r={radius}
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="14"
              />
              {/* Colored progress ring */}
              <circle
                cx="80" cy="80" r={radius}
                fill="none"
                stroke={level.ring}
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray={`${circumference}`}
                strokeDashoffset={`${offset}`}
                transform="rotate(-90 80 80)"
                style={{
                  filter: `drop-shadow(0 0 8px ${level.ring})`,
                  transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1)'
                }}
              />
            </svg>

            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                className="text-4xl font-bold"
                style={{ color: level.color, textShadow: `0 0 20px ${level.color}` }}
              >
                {score}
              </span>
              <span className="text-gray-500 text-xs mt-0.5">out of 10</span>
            </div>
          </div>

          {/* Badge */}
          <div
            className="mt-4 px-4 py-1.5 rounded-full text-xs font-semibold text-center"
            style={{
              color: level.color,
              background: level.bg,
              border: `1px solid ${level.border}`,
              boxShadow: `0 0 12px ${level.bg}`
            }}
          >
            {level.label}
          </div>

          {/* Score hint */}
          <div className="mt-4 text-center space-y-1">
            {[
              { range: '9-10', label: 'Elite',        color: '#f59e0b' },
              { range: '7-8',  label: 'Advanced',     color: '#a78bfa' },
              { range: '5-6',  label: 'Intermediate', color: '#38bdf8' },
              { range: '3-4',  label: 'Junior',       color: '#34d399' },
              { range: '0-2',  label: 'Beginner',     color: '#94a3b8' },
            ].map(tier => (
              <div key={tier.range} className="flex items-center gap-2 text-xs">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: tier.color }}
                />
                <span className="text-gray-500">{tier.range}</span>
                <span style={{ color: tier.color }}>{tier.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Breakdown */}
        <div className="flex-1 w-full space-y-4">
          {breakdown.map(item => (
            <div key={item.label}>
              <div className="flex justify-between items-center mb-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-gray-300 text-sm">{item.label}</span>
                  <span className="text-gray-600 text-xs">({item.weight})</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 text-xs font-mono">{item.value}</span>
                  <span
                    className="text-xs font-semibold font-mono w-8 text-right"
                    style={{ color: item.color }}
                  >
                    {Math.round(item.score * 10) / 10}
                  </span>
                </div>
              </div>
              {/* Bar */}
              <div
                className="h-1.5 rounded-full overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.06)' }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${item.score * 100}%`,
                    background: `linear-gradient(90deg, ${item.color}99, ${item.color})`,
                    boxShadow: `0 0 8px ${item.color}66`,
                    transition: 'width 1s cubic-bezier(0.16,1,0.3,1)'
                  }}
                />
              </div>
            </div>
          ))}

          {/* Total */}
          <div
            className="mt-4 pt-4 flex justify-between items-center rounded-xl px-4 py-3"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <span className="text-gray-400 text-sm font-medium">Final Score</span>
            <span
              className="text-2xl font-bold font-mono"
              style={{ color: level.color, textShadow: `0 0 12px ${level.color}` }}
            >
              {score} / 10
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeveloperScore