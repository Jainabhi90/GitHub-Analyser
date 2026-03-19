import { useState, useEffect } from 'react'

function ActivityHeatmap({ username }) {
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
      <div
        className="rounded-2xl p-6 shadow-lg flex items-center justify-center h-48"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading contributions...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div
        className="rounded-2xl p-6 shadow-lg"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <h3 className="text-white text-lg font-semibold mb-2">Activity Heatmap</h3>
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    )
  }

  if (!data) return null

  const weeks = data.weeks
  const totalContributions = data.totalContributions

  // Count active days
  const activeDays = weeks.reduce((total, week) =>
    total + week.contributionDays.filter(d => d.contributionCount > 0).length
  , 0)

  // Month labels
  const monthLabels = []
  let lastMonth = -1
  weeks.forEach((week, wi) => {
    const firstDay = week.contributionDays[0]
    if (!firstDay) return
    const month = new Date(firstDay.date).getMonth()
    if (month !== lastMonth) {
      monthLabels[wi] = new Date(firstDay.date)
        .toLocaleString('default', { month: 'short' })
      lastMonth = month
    }
  })

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div
      className="rounded-2xl p-6 shadow-lg"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-white text-lg font-semibold">
            Activity Heatmap
          </h3>
          <p className="text-gray-600 text-xs mt-0.5">Last 12 months</p>
        </div>
        <div className="flex gap-6 text-sm">
          <div className="text-center">
            <p className="text-green-400 font-bold text-lg font-mono">
              {totalContributions.toLocaleString()}
            </p>
            <p className="text-gray-600 text-xs">Total Contributions</p>
          </div>
          <div className="text-center">
            <p className="text-blue-400 font-bold text-lg font-mono">
              {activeDays}
            </p>
            <p className="text-gray-600 text-xs">Active Days</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-max">

          {/* Month labels */}
          <div className="flex gap-1 mb-1 ml-8">
            {weeks.map((_, wi) => (
              <div key={wi} className="w-3 text-center">
                {monthLabels[wi] && (
                  <span className="text-gray-600 text-xs">
                    {monthLabels[wi]}
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-1">
            {/* Day labels */}
            <div className="flex flex-col gap-1 mr-1">
              {dayLabels.map((d, i) => (
                <div key={d} className="h-3 flex items-center">
                  {i % 2 === 1 ? (
                    <span className="text-gray-700 text-xs w-6 text-right pr-1">
                      {d}
                    </span>
                  ) : (
                    <span className="w-6" />
                  )}
                </div>
              ))}
            </div>

            {/* Heatmap grid */}
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-1">
                {week.contributionDays.map((day, di) => {
                  const count = day.contributionCount
                  const hasActivity = count > 0

                  return (
                    <div
                      key={di}
                      className="w-3 h-3 rounded-sm cursor-pointer transition-transform duration-150 hover:scale-150"
                      style={{
                        backgroundColor: hasActivity ? day.color : 'rgba(255,255,255,0.05)',
                        boxShadow: hasActivity ? `0 0 6px ${day.color}88` : 'none'
                      }}
                      title={`${day.date}: ${count} contribution${count !== 1 ? 's' : ''}`}
                    />
                  )
                })}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-end gap-2 mt-4">
            <span className="text-gray-600 text-xs">Less</span>
            {[
              'rgba(255,255,255,0.05)',
              '#0e4429',
              '#006d32',
              '#26a641',
              '#39d353'
            ].map((color, i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-sm"
                style={{
                  backgroundColor: color,
                  boxShadow: i > 0 ? `0 0 4px ${color}` : 'none'
                }}
              />
            ))}
            <span className="text-gray-600 text-xs">More</span>
          </div>

        </div>
      </div>
    </div>
  )
}

export default ActivityHeatmap