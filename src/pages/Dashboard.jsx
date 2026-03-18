import { useState } from 'react'
import SearchBar from '../components/SearchBar'
import ProfileCard from '../components/ProfileCard'
import RepoStats from '../components/RepoStats'
import LanguageChart from '../components/LanguageChart'
import StarChart from '../components/StarChart'
import RepoList from '../components/RepoList'
import ActivityGraph from '../components/ActivityGraph'
import CompareUsers from '../components/CompareUsers'
import { fetchUser, fetchRepos, fetchEvents } from '../services/githubApi'

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
    <div className="min-h-screen text-white px-4 py-8"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }}
    >
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #3b82f6, transparent)' }}
        />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }}
        />
      </div>

      {/* Header */}
      <div className="text-center mb-8 animate-fadeInUp">
        <h1 className="text-5xl font-bold gradient-text mb-2">
          GitHub Analyser
        </h1>
        <p className="text-gray-400 text-lg">
          Explore any GitHub profile with deep insights
        </p>
      </div>

      {/* Mode Toggle */}
      <div className="flex justify-center gap-3 mb-8 animate-fadeInUp delay-100">
        <button
          onClick={() => setMode('search')}
          className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
            mode === 'search'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
              : 'glass text-gray-300 hover:text-white'
          }`}
        >
          Search User
        </button>
        <button
          onClick={() => setMode('compare')}
          className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
            mode === 'compare'
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
          <div className="animate-fadeInUp delay-200">
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Search History */}
          {history.length > 0 && (
            <div className="flex justify-center gap-2 flex-wrap mb-6 animate-fadeIn">
              <span className="text-gray-500 text-sm mt-1">Recent:</span>
              {history.map((name, i) => (
                <button
                  key={name}
                  onClick={() => handleSearch(name)}
                  className="px-3 py-1 glass hover:bg-blue-600/20 text-gray-300 text-sm rounded-full transition-all duration-300"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {name}
                </button>
              ))}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex flex-col justify-center items-center mt-20 gap-4">
              <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin animate-pulse-glow"></div>
              <p className="text-gray-400 animate-pulse">Fetching GitHub data...</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="max-w-md mx-auto mt-10 glass border border-red-500/50 text-red-300 px-6 py-4 rounded-xl text-center animate-fadeInUp">
              {error}
            </div>
          )}

          {/* Empty State */}
          {!user && !loading && !error && (
            <div className="flex flex-col items-center justify-center mt-24 text-center animate-fadeInUp">
              <div className="text-7xl mb-6">🐙</div>
              <h2 className="text-2xl font-semibold text-gray-300 mb-2">
                Search for a GitHub user
              </h2>
              <p className="text-gray-500 max-w-sm">
                Type any GitHub username above to see their profile,
                repositories, languages and stats.
              </p>
            </div>
          )}

          {/* Main Content */}
          {user && !loading && (
            <div className="max-w-5xl mx-auto mt-8 space-y-8">

              <div className="animate-fadeInUp">
                <ProfileCard user={user} />
              </div>

              <div className="animate-fadeInUp delay-100">
                <RepoStats repos={repos} user={user} />
              </div>

              {repos.length > 0 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeInUp delay-200">
                    <LanguageChart repos={repos} />
                    <StarChart repos={repos} />
                  </div>

                  <div className="animate-fadeInUp delay-300">
                    <ActivityGraph events={events} />
                  </div>

                  <div className="animate-fadeInUp delay-400">
                    <h2 className="text-2xl font-bold gradient-text mb-4">
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