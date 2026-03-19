import { useState } from 'react'
import SearchBar from '../components/SearchBar'
import ProfileCard from '../components/ProfileCard'
import RepoStats from '../components/RepoStats'
import LanguageChart from '../components/LanguageChart'
import StarChart from '../components/StarChart'
import RepoList from '../components/RepoList'
import ActivityGraph from '../components/ActivityGraph'
import CompareUsers from '../components/CompareUsers'
import ContributionStats from '../components/ContributionStats'
import { fetchUser, fetchRepos, fetchEvents } from '../services/githubApi'
import ActivityHeatmap from '../components/ActivityHeatmap'
import DeveloperScore from '../components/DeveloperScore'

function Dashboard() {
  const [user, setUser] = useState(null)
  const [repos, setRepos] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [history, setHistory] = useState([])
  const [mode, setMode] = useState('search')

  async function handleSearch(username) {
    setLoading(true)
    setError(null)
    setUser(null)
    setRepos([])
    setEvents([])

    try {
      const [userData, reposData, eventsData] = await Promise.all([
        fetchUser(username),
        fetchRepos(username),
        fetchEvents(username)
      ])
      setUser(userData)
      setRepos(reposData)
      setEvents(eventsData)

      setHistory(prev => {
        const filtered = prev.filter(h => h !== username)
        return [username, ...filtered].slice(0, 5)
      })

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-8">

      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-white">GitHub Analyser</h1>
        <p className="text-gray-400 mt-2">
          Enter a GitHub username to explore their profile
        </p>
      </div>

      {/* Mode Toggle */}
      <div className="flex justify-center gap-3 mb-8">
        <button
          onClick={() => setMode('search')}
          className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${mode === 'search'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
              : 'glass text-gray-300 hover:text-white'
            }`}
        >
          Search User
        </button>
        <button
          onClick={() => setMode('compare')}
          className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${mode === 'compare'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
              : 'glass text-gray-300 hover:text-white'
            }`}
        >
          Compare Users
        </button>
      </div>

      {/* Compare Mode */}
      {mode === 'compare' && (
        <div className="animate-fadeInUp">
          <CompareUsers />
        </div>
      )}

      {/* Search Mode */}
      {mode === 'search' && (
        <>
          <SearchBar onSearch={handleSearch} />

          {/* Search History */}
          {history.length > 0 && (
            <div className="flex justify-center gap-2 flex-wrap mb-6">
              <span className="text-gray-400 text-sm mt-1">Recent:</span>
              {history.map(name => (
                <button
                  key={name}
                  onClick={() => handleSearch(name)}
                  className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm rounded-full transition"
                >
                  {name}
                </button>
              ))}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex flex-col justify-center items-center mt-16 gap-4">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-400 animate-pulse">Fetching GitHub data...</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="max-w-md mx-auto mt-10 bg-red-900 border border-red-500 text-red-200 px-6 py-4 rounded-xl text-center">
              {error}
            </div>
          )}

          {/* Empty State */}
          {!user && !loading && !error && (
            <div className="flex flex-col items-center justify-center mt-24 text-center">
              <div className="text-6xl mb-4">🐙</div>
              <h2 className="text-xl font-semibold text-gray-300">
                Search for a GitHub user
              </h2>
              <p className="text-gray-500 mt-2 max-w-sm">
                Type any GitHub username above to see their profile,
                repositories, languages and stats.
              </p>
            </div>
          )}

          {/* Main Content */}
          {user && !loading && (
            <div className="max-w-5xl mx-auto mt-8 space-y-8">

              <ProfileCard user={user} />
              <RepoStats repos={repos} user={user} />

              {repos.length > 0 && (
                <>
                  {/* Developer Score */}
                  <DeveloperScore
                    user={user}
                    repos={repos}
                    events={events}
                  />

                  {/* Charts */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <LanguageChart repos={repos} />
                    <StarChart repos={repos} />
                  </div>

                  {/* Contribution Stats */}
                  <ContributionStats events={events} />

                  {/* Activity Graph */}
                  <ActivityGraph events={events} />

                  {/* Activity Heatmap */}
                  <ActivityHeatmap username={user.login} />

                  {/* Repo List */}
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4">
                      Repositories
                    </h2>
                    <RepoList repos={repos} />
                  </div>
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Dashboard