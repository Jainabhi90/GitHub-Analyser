import { getContributionStats } from '../utils/dataProcessing'

function DeveloperScore({ user, repos, events }) {
  const { prs, commits, issues } = getContributionStats(events)
  const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0)

  function scoreFollowers(f) {
    if (f >= 100) return 1
    if (f >= 80)  return 0.8
    if (f >= 60)   return 0.6
    if (f >= 40)   return 0.4
    if (f >= 10)    return 0.2
    return 0.05
  }
  function scoreStars(s) {
    if (s >= 100) return 1
    if (s >= 100)  return 0.8
    if (s >= 50)   return 0.6
    if (s >= 10)   return 0.4
    if (s >= 1)    return 0.2
    return 0.05
  }
  function scoreCommits(c) {
    if (c >= 300) return 1
    if (c >= 150)  return 0.8
    if (c >= 100)  return 0.6
    if (c >= 50)  return 0.4
    if (c >= 30)   return 0.2
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
    if (s >= 9) return { label: 'ELITE',        accent: '#e8c547' }
    if (s >= 7) return { label: 'ADVANCED',     accent: '#e8c547' }
    if (s >= 5) return { label: 'INTERMEDIATE', accent: '#e8c547' }
    if (s >= 3) return { label: 'JUNIOR',       accent: '#e8c547' }
    return        { label: 'BEGINNER',          accent: '#e8c547' }
  }

  const level = getLevel(score)

  const breakdown = [
    { label: 'Followers',     value: user.followers.toLocaleString(), score: scoreFollowers(user.followers), weight: '20%' },
    { label: 'Total Stars',   value: totalStars.toLocaleString(),     score: scoreStars(totalStars),         weight: '20%' },
    { label: 'Commits (30d)', value: commits,                         score: scoreCommits(commits),          weight: '20%' },
    { label: 'PRs Opened',    value: prs,                             score: scorePRs(prs),                  weight: '15%' },
    { label: 'Repos',         value: repos.length,                    score: scoreRepos(repos.length),       weight: '15%' },
    { label: 'Issues',        value: issues,                          score: scoreIssues(issues),            weight: '10%' },
  ]

  const radius = 54
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 10) * circumference

  return (
    <div
      className="max-w-4xl mx-auto"
      style={{ border: '3px solid #111', background: '#fff', margin: '2px' }}
    >
      {/* Header bar */}
      <div style={{ background: '#111', padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ color: '#f0ebe0', fontFamily: 'Space Mono, monospace', fontSize: '11px', letterSpacing: '3px' }}>
          // DEVELOPER SCORE
        </span>
        <span
          style={{ background: '#e8c547', color: '#111', fontSize: '10px', fontWeight: '800', letterSpacing: '3px', padding: '3px 10px', fontFamily: 'Space Mono, monospace' }}
        >
          {level.label}
        </span>
      </div>

      <div style={{ padding: '24px', display: 'flex', gap: '32px', alignItems: 'flex-start', flexWrap: 'wrap' }}>

        {/* Circle */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
          <div style={{ position: 'relative', width: '140px', height: '140px' }}>
            <svg width="140" height="140" viewBox="0 0 140 140">
              <circle cx="70" cy="70" r={radius} fill="none" stroke="#f0ebe0" strokeWidth="12" />
              <circle
                cx="70" cy="70" r={radius}
                fill="none"
                stroke="#111"
                strokeWidth="12"
                strokeLinecap="square"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                transform="rotate(-90 70 70)"
              />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '36px', fontWeight: '800', fontFamily: 'Space Mono, monospace', color: '#111', lineHeight: 1 }}>
                {score}
              </span>
              <span style={{ fontSize: '10px', color: '#888', fontFamily: 'Space Mono, monospace', letterSpacing: '1px' }}>
                / 10
              </span>
            </div>
          </div>

          {/* Tier guide */}
          <div style={{ marginTop: '16px', border: '2px solid #111', padding: '10px 14px', background: '#f0ebe0' }}>
            {[
              { range: '9-10', label: 'Elite' },
              { range: '7-8',  label: 'Advanced' },
              { range: '5-6',  label: 'Intermediate' },
              { range: '3-4',  label: 'Junior' },
              { range: '0-2',  label: 'Beginner' },
            ].map(t => (
              <div key={t.range} style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: '#888', width: '30px' }}>{t.range}</span>
                <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', fontWeight: '700', color: '#111' }}>{t.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Breakdown bars */}
        <div style={{ flex: 1, minWidth: '200px' }}>
          {breakdown.map((item, i) => (
            <div key={item.label} style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '13px', fontWeight: '600', color: '#111' }}>
                    {item.label}
                  </span>
                  <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: '#aaa' }}>
                    ({item.weight})
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: '#888' }}>
                    {item.value}
                  </span>
                  <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', fontWeight: '700', color: '#111', minWidth: '24px', textAlign: 'right' }}>
                    {Math.round(item.score * 10) / 10}
                  </span>
                </div>
              </div>
              {/* Bar track */}
              <div style={{ background: '#f0ebe0', border: '1.5px solid #ccc', height: '8px' }}>
                <div style={{ width: `${item.score * 100}%`, height: '100%', background: '#111' }} />
              </div>
            </div>
          ))}

          {/* Final score */}
          <div style={{ marginTop: '16px', borderTop: '3px solid #111', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: '#888', letterSpacing: '2px', textTransform: 'uppercase' }}>
              Final Score
            </span>
            <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '28px', fontWeight: '700', color: '#111' }}>
              {score} / 10
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeveloperScore