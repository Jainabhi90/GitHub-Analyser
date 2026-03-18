import { useState } from 'react'
import { fetchUser, fetchRepos, fetchEvents } from '../services/githubApi'
import { getTotalStars, getMostUsedLanguage } from '../utils/dataProcessing'

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
      ])

      setUser1({
        profile: u1,
        repos: r1,
        totalStars: getTotalStars(r1),
        topLanguage: getMostUsedLanguage(r1),
        activeDays: getActiveDays(e1)
      })

      setUser2({
        profile: u2,
        repos: r2,
        totalStars: getTotalStars(r2),
        topLanguage: getMostUsedLanguage(r2),
        activeDays: getActiveDays(e2)
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

      <div className="bg-gray-800 rounded-2xl p-6">
        <h2 className="text-white text-xl font-bold mb-4 text-center">
          Compare Two GitHub Users
        </h2>
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <input
            type="text"
            placeholder="First username..."
            value={username1}
            onChange={e => setUsername1(e.target.value)}
            className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
          />
          <span className="text-gray-400 font-bold text-xl">VS</span>
          <input
            type="text"
            placeholder="Second username..."
            value={username2}
            onChange={e => setUsername2(e.target.value)}
            className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleCompare}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
          >
            Compare
          </button>
        </div>
        {error && (
          <p className="text-red-400 text-center mt-3">{error}</p>
        )}
      </div>

      {loading && (
        <div className="flex justify-center mt-8">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {user1 && user2 && !loading && (
        <div className="space-y-6">

          <div className="grid grid-cols-2 gap-6">
            {[user1, user2].map((u, i) => (
              <div
                key={i}
                className="bg-gray-800 rounded-2xl p-6 flex flex-col items-center text-center"
              >
                <img
                  src={u.profile.avatar_url}
                  alt={u.profile.login}
                  className="w-20 h-20 rounded-full border-4 border-blue-500 mb-3"
                />
                <h3 className="text-white font-bold text-lg">
                  {u.profile.name || u.profile.login}
                </h3>
                <p className="text-gray-400 text-sm">@{u.profile.login}</p>
                {u.profile.bio && (
                  <p className="text-gray-400 text-xs mt-2 line-clamp-2">
                    {u.profile.bio}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="bg-gray-800 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-3 bg-gray-700 px-6 py-3 text-sm font-semibold text-gray-300">
              <span>{user1.profile.login}</span>
              <span className="text-center">Category</span>
              <span className="text-right">{user2.profile.login}</span>
            </div>

            {stats.map((stat, index) => {
              const user1Wins = !stat.isText && stat.v1 > stat.v2
              const user2Wins = !stat.isText && stat.v2 > stat.v1

              return (
                <div
                  key={stat.label}
                  className={`grid grid-cols-3 px-6 py-4 items-center ${
                    index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-blue-400 font-bold">
                      {typeof stat.v1 === 'number' ? stat.v1.toLocaleString() : stat.v1}
                    </span>
                    {user1Wins && (
                      <span className="text-yellow-400 text-lg">🏆</span>
                    )}
                  </div>

                  <span className="text-gray-400 text-sm text-center">
                    {stat.label}
                  </span>

                  <div className="flex items-center justify-end gap-2">
                    {user2Wins && (
                      <span className="text-yellow-400 text-lg">🏆</span>
                    )}
                    <span className="text-blue-400 font-bold">
                      {typeof stat.v2 === 'number' ? stat.v2.toLocaleString() : stat.v2}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="bg-gray-800 rounded-2xl p-6 text-center">
            {overallWinner ? (
              <>
                <p className="text-gray-400 mb-2">Overall Winner</p>
                <p className="text-3xl font-bold text-yellow-400">
                  🏆 {overallWinner}
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Won {Math.max(u1wins, u2wins)} out of {u1wins + u2wins} categories
                </p>
              </>
            ) : (
              <p className="text-gray-400 text-lg">Its a tie!</p>
            )}
          </div>

        </div>
      )}
    </div>
  )
}

export default CompareUsers