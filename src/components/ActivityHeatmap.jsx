import { useState, useEffect } from 'react'

function ActivityHeatmap({ username, onContributionsLoaded }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchContributions() {
      setLoading(true)
      setError(null)
      try {
        const baseUrl = import.meta.env.VITE_API_URL || ''
        const res = await fetch(`${baseUrl}/api/contributions?username=${username}`)
        const json = await res.json()
        if (json.error) throw new Error(json.error)
        setData(json)
        if (onContributionsLoaded) {
          onContributionsLoaded(json.totalContributions)
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    if (username) fetchContributions()
  }, [username])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto" style={{ border: '3px solid #111', background: '#fff', margin: '2px' }}>
        <div style={{ background: '#111', padding: '10px 20px' }}>
          <span style={{ color: '#f0ebe0', fontFamily: 'Space Mono, monospace', fontSize: '11px', letterSpacing: '3px' }}>
            // CONTRIBUTION HEATMAP
          </span>
        </div>
        <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <div className="w-8 h-8 border-4 border-black border-t-yellow-400 animate-spin" />
          <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: '#888', letterSpacing: '2px' }}>
            LOADING HEATMAP...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto" style={{ border: '3px solid #111', background: '#fff', margin: '2px' }}>
        <div style={{ background: '#111', padding: '10px 20px' }}>
          <span style={{ color: '#f0ebe0', fontFamily: 'Space Mono, monospace', fontSize: '11px', letterSpacing: '3px' }}>
            // CONTRIBUTION HEATMAP
          </span>
        </div>
        <div style={{ padding: '24px' }}>
          <p style={{ color: '#e8442a', fontFamily: 'Space Mono, monospace', fontSize: '12px' }}>{error}</p>
        </div>
      </div>
    )
  }

  if (!data) return null

  const weeks = data.weeks
  const totalContributions = data.totalContributions
  const activeDays = weeks.reduce((total, week) =>
    total + week.contributionDays.filter(d => d.contributionCount > 0).length
  , 0)

  const monthLabels = []
  let lastMonth = -1
  weeks.forEach((week, wi) => {
    const firstDay = week.contributionDays[0]
    if (!firstDay) return
    const month = new Date(firstDay.date).getMonth()
    if (month !== lastMonth) {
      monthLabels[wi] = new Date(firstDay.date).toLocaleString('default', { month: 'short' })
      lastMonth = month
    }
  })

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="max-w-4xl mx-auto" style={{ border: '3px solid #111', background: '#fff', margin: '2px' }}>

      {/* Header */}
      <div style={{ background: '#111', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#f0ebe0', fontFamily: 'Space Mono, monospace', fontSize: '11px', letterSpacing: '3px' }}>
          // CONTRIBUTION HEATMAP — LAST 12 MONTHS
        </span>
        <div style={{ display: 'flex', gap: '16px' }}>
          <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: '#888' }}>
            Total: <span style={{ color: '#e8c547', fontWeight: '700' }}>{totalContributions.toLocaleString()}</span>
          </span>
          <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: '#888' }}>
            Active days: <span style={{ color: '#e8c547', fontWeight: '700' }}>{activeDays}</span>
          </span>
        </div>
      </div>

      <div style={{ padding: '20px', overflowX: 'auto' }}>
        <div style={{ minWidth: 'max-content' }}>

          {/* Month labels */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '4px', marginLeft: '32px' }}>
            {weeks.map((_, wi) => (
              <div key={wi} style={{ width: '12px', textAlign: 'center' }}>
                {monthLabels[wi] && (
                  <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: '#888' }}>
                    {monthLabels[wi]}
                  </span>
                )}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '4px' }}>

            {/* Day labels */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginRight: '4px' }}>
              {dayLabels.map((d, i) => (
                <div key={d} style={{ height: '12px', display: 'flex', alignItems: 'center' }}>
                  {i % 2 === 1 ? (
                    <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: '#888', width: '24px', textAlign: 'right' }}>
                      {d}
                    </span>
                  ) : (
                    <span style={{ width: '24px' }} />
                  )}
                </div>
              ))}
            </div>

            {/* Grid */}
            {weeks.map((week, wi) => (
              <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {week.contributionDays.map((day, di) => {
                  const count = day.contributionCount
                  return (
                    <div
                      key={di}
                      title={`${day.date}: ${count} contribution${count !== 1 ? 's' : ''}`}
                      style={{
                        width: '12px',
                        height: '12px',
                        background: count > 0 ? day.color : 'rgba(0,0,0,0.06)',
                        border: '1px solid rgba(0,0,0,0.1)',
                        cursor: 'pointer',
                        transition: 'transform 0.1s ease'
                      }}
                      onMouseEnter={e => e.target.style.transform = 'scale(1.4)'}
                      onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                    />
                  )
                })}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px', justifyContent: 'flex-end' }}>
            <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: '#888' }}>Less</span>
            {['rgba(0,0,0,0.06)', '#0e4429', '#006d32', '#26a641', '#39d353'].map((color, i) => (
              <div key={i} style={{ width: '12px', height: '12px', background: color, border: '1px solid rgba(0,0,0,0.1)' }} />
            ))}
            <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: '#888' }}>More</span>
          </div>

        </div>
      </div>
    </div>
  )
}

export default ActivityHeatmap