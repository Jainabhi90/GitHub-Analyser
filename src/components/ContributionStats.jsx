import { getContributionStats } from '../utils/dataProcessing'

function ContributionStats({ events, realCommits }) {
  const { prs, issues } = getContributionStats(events)

  const stats = [
    {
      label: 'PRs Opened',
      value: prs,
      tag: 'PULL REQUESTS',
      sub: 'in last 90 events'
    },
    {
      label: 'Commits',
      value: realCommits !== null && realCommits !== undefined
        ? realCommits.toLocaleString()
        : '...',
      tag: 'COMMITS',
      sub: realCommits !== null && realCommits !== undefined
        ? 'in last 12 months'
        : 'loading...'
    },
    {
      label: 'Issues Opened',
      value: issues,
      tag: 'ISSUES',
      sub: 'in last 90 events'
    },
  ]

  return (
    <div
      className="max-w-4xl mx-auto"
      style={{ border: '3px solid #111', background: '#fff', margin: '2px' }}
    >
      <div style={{ background: '#111', padding: '10px 20px' }}>
        <span style={{ color: '#f0ebe0', fontFamily: 'Space Mono, monospace', fontSize: '11px', letterSpacing: '3px' }}>
          // CONTRIBUTIONS OVERVIEW
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            style={{
              padding: '24px',
              borderRight: i < 2 ? '2px solid #111' : 'none',
              textAlign: 'center'
            }}
          >
            <div style={{ marginBottom: '12px' }}>
              <span style={{
                background: '#e8c547',
                color: '#111',
                fontSize: '9px',
                fontWeight: '800',
                letterSpacing: '3px',
                padding: '3px 10px',
                fontFamily: 'Space Mono, monospace',
                border: '1.5px solid #111'
              }}>
                {stat.tag}
              </span>
            </div>
            <div style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: '48px',
              fontWeight: '700',
              color: stat.value === '...' ? '#aaa' : '#111',
              lineHeight: 1,
              marginBottom: '8px'
            }}>
              {stat.value}
            </div>
            <div style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '14px',
              fontWeight: '600',
              color: '#111',
              marginBottom: '4px'
            }}>
              {stat.label}
            </div>
            <div style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: '11px',
              color: '#888'
            }}>
              {stat.sub}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ContributionStats