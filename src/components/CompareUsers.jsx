import { useState } from 'react'
import { fetchUser, fetchRepos, fetchEvents } from '../services/githubApi'
import { getTotalStars, getMostUsedLanguage, getTotalPRs, getTotalCommits, getTotalIssues } from '../utils/dataProcessing'

function CompareUsers() {
  const [username1, setUsername1] = useState('')
  const [username2, setUsername2] = useState('')
  const [user1, setUser1] = useState(null)
  const [user2, setUser2] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  function getActiveDays(events) {
    const days = new Set()
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    events
      .filter(e => e.type === 'PushEvent')
      .forEach(e => {
        const date = new Date(e.created_at)
        if (date >= thirtyDaysAgo) {
          days.add(e.created_at.split('T')[0])
        }
      })
    return days.size
  }

  async function handleCompare() {
    if (!username1.trim() || !username2.trim()) {
      setError('Please enter both usernames')
      return
    }
    setLoading(true)
    setError(null)
    setUser1(null)
    setUser2(null)

    try {
      const [u1, u2, r1, r2, e1, e2] = await Promise.all([
        fetchUser(username1.trim()),
        fetchUser(username2.trim()),
        fetchRepos(username1.trim()),
        fetchRepos(username2.trim()),
        fetchEvents(username1.trim()),
        fetchEvents(username2.trim()),
        fetch(`/api/contributions?username=${username1.trim()}`).then(r => r.json()),
      fetch(`/api/contributions?username=${username2.trim()}`).then(r => r.json()),
      ])

      setUser1({
        profile: u1,
        repos: r1,
        totalStars: getTotalStars(r1),
        topLanguage: getMostUsedLanguage(r1),
        activeDays: getActiveDays(e1),
        prs: getTotalPRs(e1),
        commits: getTotalCommits(e1),
        issues: getTotalIssues(e1),
      })

      setUser2({
        profile: u2,
        repos: r2,
        totalStars: getTotalStars(r2),
        topLanguage: getMostUsedLanguage(r2),
        activeDays: getActiveDays(e2),
        prs: getTotalPRs(e2),
        commits: getTotalCommits(e2),
        issues: getTotalIssues(e2),
      })

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const stats = user1 && user2 ? [
    { label: 'Followers', v1: user1.profile.followers, v2: user2.profile.followers },
    { label: 'Public Repos', v1: user1.profile.public_repos, v2: user2.profile.public_repos },
    { label: 'Total Stars', v1: user1.totalStars, v2: user2.totalStars },
    { label: 'Top Language', v1: user1.topLanguage, v2: user2.topLanguage, isText: true },
    { label: 'Active Days (30d)', v1: user1.activeDays, v2: user2.activeDays },
    { label: 'PRs Opened', v1: user1.prs, v2: user2.prs },
    { label: 'Commits (12 months)', v1: user1.commits, v2: user2.commits },
    { label: 'Issues Opened', v1: user1.issues, v2: user2.issues },
  ] : []

  let u1wins = 0
  let u2wins = 0
  stats.forEach(stat => {
    if (!stat.isText) {
      if (stat.v1 > stat.v2) u1wins++
      else if (stat.v2 > stat.v1) u2wins++
    }
  })

  const overallWinner = u1wins > u2wins
    ? user1 && user1.profile.login
    : u2wins > u1wins
    ? user2 && user2.profile.login
    : null

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* Input Section */}
<div className="brut-card p-8">
  <div className="flex items-center gap-3 mb-6">
    <span className="brut-tag-red">COMPARE</span>
    <h2 className="text-2xl font-bold text-black">
      Head to Head
    </h2>
  </div>

  <div className="flex flex-col md:flex-row gap-4 items-center">
    <input
      type="text"
      placeholder="First username..."
      value={username1}
      onChange={e => setUsername1(e.target.value)}
      onKeyDown={e => e.key === 'Enter' && handleCompare()}
      className="brut-input flex-1 px-5 py-4 text-base font-medium"
    />

    <div className="brut-card-dark px-6 py-4 flex-shrink-0">
      <span className="text-yellow-400 font-black text-xl mono">VS</span>
    </div>

    <input
      type="text"
      placeholder="Second username..."
      value={username2}
      onChange={e => setUsername2(e.target.value)}
      onKeyDown={e => e.key === 'Enter' && handleCompare()}
      className="brut-input flex-1 px-5 py-4 text-base font-medium"
    />

    <button
      onClick={handleCompare}
      className="brut-btn px-8 py-4 text-base flex-shrink-0"
    >
      Compare →
    </button>
  </div>

  {error && (
    <div className="mt-4 border-2 border-red-500 p-3">
      <p className="text-red-600 text-sm font-medium">{error}</p>
    </div>
  )}
</div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-12 h-12 border-4 border-black border-t-yellow-400 animate-spin" />
          <p className="mono text-sm text-gray-600 uppercase tracking-widest">
            Comparing developers...
          </p>
        </div>
      )}

      {/* Results */}
      {user1 && user2 && !loading && (
        <div className="space-y-6">

          {/* Profile Cards Side by Side */}
          <div className="grid grid-cols-2 gap-4">
            {[user1, user2].map((u, i) => (
              <div key={i} className="brut-card p-0 overflow-hidden">
                <div className="bg-black px-4 py-2">
                  <span className="brut-tag text-xs">
                    {i === 0 ? 'PLAYER 1' : 'PLAYER 2'}
                  </span>
                </div>
                <div className="p-6 flex flex-col items-center text-center">
                  <img
                    src={u.profile.avatar_url}
                    alt={u.profile.login}
                    className="w-20 h-20 border-2 border-black mb-4"
                  />
                  <h3 className="font-bold text-black text-xl mb-1">
                    {u.profile.name || u.profile.login}
                  </h3>
                  <p className="mono text-sm text-gray-500 mb-2">
                    @{u.profile.login}
                  </p>
                  {u.profile.bio && (
                    <p className="text-gray-600 text-xs line-clamp-2">
                      {u.profile.bio}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Comparison Table */}
          <div className="brut-card overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-3 bg-black px-6 py-4">
              <span className="text-yellow-400 font-bold mono text-sm">
                {user1.profile.login}
              </span>
              <span className="text-white font-bold text-sm text-center uppercase tracking-widest">
                Category
              </span>
              <span className="text-yellow-400 font-bold mono text-sm text-right">
                {user2.profile.login}
              </span>
            </div>

            {/* Rows */}
            {stats.map((stat, index) => {
              const user1Wins = !stat.isText && stat.v1 > stat.v2
              const user2Wins = !stat.isText && stat.v2 > stat.v1

              return (
                <div
                  key={stat.label}
                  className={`grid grid-cols-3 px-6 py-5 items-center border-b-2 border-black last:border-b-0 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                  {/* User 1 */}
                  <div className="flex items-center gap-2">
                    <span className="mono text-xl font-bold text-black">
                      {typeof stat.v1 === 'number'
                        ? stat.v1.toLocaleString()
                        : stat.v1}
                    </span>
                    {user1Wins && (
                      <span className="brut-tag text-xs">WIN</span>
                    )}
                  </div>

                  {/* Category */}
                  <span className="text-gray-500 text-sm text-center uppercase tracking-wider font-medium">
                    {stat.label}
                  </span>

                  {/* User 2 */}
                  <div className="flex items-center justify-end gap-2">
                    {user2Wins && (
                      <span className="brut-tag text-xs">WIN</span>
                    )}
                    <span className="mono text-xl font-bold text-black">
                      {typeof stat.v2 === 'number'
                        ? stat.v2.toLocaleString()
                        : stat.v2}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Overall Winner */}
          <div className={`p-8 text-center ${overallWinner ? 'brut-card-yellow' : 'brut-card'}`}>
            {overallWinner ? (
              <>
                <span className="brut-tag-dark mb-4 block mx-auto w-fit">
                  OVERALL WINNER
                </span>
                <p className="text-5xl font-black text-black mb-2">
                  {overallWinner}
                </p>
                <p className="mono text-gray-800 text-base">
                  Won {Math.max(u1wins, u2wins)} out of {u1wins + u2wins} categories
                </p>
              </>
            ) : (
              <>
                <span className="brut-tag mb-4 block mx-auto w-fit">
                  RESULT
                </span>
                <p className="text-4xl font-black text-black">
                  It's a Tie!
                </p>
              </>
            )}
          </div>

        </div>
      )}
    </div>
  )
}

export default CompareUsers