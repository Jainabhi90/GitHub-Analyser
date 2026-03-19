import { useState } from 'react'
import SearchBar from '../components/SearchBar'
import ProfileCard from '../components/ProfileCard'
import RepoStats from '../components/RepoStats'
import LanguageChart from '../components/LanguageChart'
import StarChart from '../components/StarChart'
import RepoList from '../components/RepoList'
import ActivityGraph from '../components/ActivityGraph'
import ActivityHeatmap from '../components/ActivityHeatmap'
import CompareUsers from '../components/CompareUsers'
import ContributionStats from '../components/ContributionStats'
import DeveloperScore from '../components/DeveloperScore'
import { fetchUser, fetchRepos, fetchEvents } from '../services/githubApi'

function Dashboard() {
  const [user, setUser] = useState(null)
  const [repos, setRepos] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [history, setHistory] = useState([])
  const [mode, setMode] = useState('search')
  const [realCommits, setRealCommits] = useState(null)

  async function handleSearch(username) {
  setLoading(true)
  setError(null)
  setUser(null)
  setRepos([])
  setEvents([])
  setRealCommits(null)

  try {
    const [userData, reposData] = await Promise.all([
      fetchUser(username),
      fetchRepos(username),
    ])
    setUser(userData)
    setRepos(reposData)

    // Fetch events separately — don't crash if it fails
    try {
      const eventsData = await fetchEvents(username)
      setEvents(eventsData)
    } catch (eventErr) {
      console.warn('Events fetch failed:', eventErr.message)
      setEvents([]) // just show empty events
    }

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

  function SectionHeading({ label, count }) {
    return (
      <div className="flex items-center gap-4 mb-8">
        <span style={{
          background: '#111',
          color: '#f5f0e8',
          fontSize: '13px',
          fontWeight: '800',
          letterSpacing: '3px',
          padding: '10px 20px',
          fontFamily: 'Space Mono, monospace',
          border: '2px solid #111',
          boxShadow: '3px 3px 0px #e8c547',
          whiteSpace: 'nowrap'
        }}>
          {label}
        </span>
        {count && (
          <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '13px', color: '#aaa' }}>
            {count}
          </span>
        )}
        <div style={{ flex: 1, height: '2px', background: '#111', opacity: 0.12 }} />
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: '#f5f0e8' }}>

      {/* Navbar */}
      <div className="border-b-2 border-black bg-black px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-white font-bold text-xl tracking-tight">
            GITHUB ANALYSER
          </span>
          <span className="brut-tag text-xs">2025</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* Hero */}
        <div className="mb-10 animate-fadeInUp">
          <div className="flex items-center gap-3 mb-4">
            <span className="brut-tag-red">TOOL</span>
            <span className="text-sm text-gray-500 mono uppercase tracking-widest">
              Developer Analytics
            </span>
          </div>
          <h1 className="text-6xl font-bold text-black leading-tight mb-4">
            Explore any
            <br />
            GitHub profile.
          </h1>
          <p className="text-gray-600 text-lg max-w-md">
            Deep insights into repositories, languages,
            contributions and activity patterns.
          </p>
        </div>

        <div className="brut-divider mb-10" />

        {/* Mode Toggle */}
        <div className="flex justify-center mb-10 animate-fadeInUp">
          <div className="flex border-2 border-black" style={{ boxShadow: '4px 4px 0px #0a0a0a' }}>
            <button
              onClick={() => setMode('search')}
              className={`px-10 py-4 text-sm font-bold uppercase tracking-widest border-r-2 border-black transition-all duration-150 ${
                mode === 'search'
                  ? 'bg-yellow-400 text-black'
                  : 'bg-white text-gray-500 hover:bg-gray-100'
              }`}
            >
              Search User
            </button>
            <button
              onClick={() => setMode('compare')}
              className={`px-10 py-4 text-sm font-bold uppercase tracking-widest transition-all duration-150 ${
                mode === 'compare'
                  ? 'bg-yellow-400 text-black'
                  : 'bg-white text-gray-500 hover:bg-gray-100'
              }`}
            >
              Compare Users
            </button>
          </div>
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

            {/* History */}
            {history.length > 0 && (
              <div className="flex gap-2 flex-wrap mb-8 justify-center">
                <span className="text-xs text-gray-500 mono mt-1.5 uppercase tracking-wider">
                  Recent:
                </span>
                {history.map(name => (
                  <button
                    key={name}
                    onClick={() => handleSearch(name)}
                    className="brut-btn-outline px-4 py-1.5 text-sm"
                  >
                    {name}
                  </button>
                ))}
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="flex flex-col items-center justify-center mt-20 gap-4">
                <div className="w-12 h-12 border-4 border-black border-t-yellow-400 animate-spin" />
                <p className="mono text-sm text-gray-600 uppercase tracking-widest">
                  Fetching data...
                </p>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="max-w-sm mx-auto mt-10 brut-card p-6">
                <span className="brut-tag-red mb-3 block">ERROR</span>
                <p className="text-base text-gray-700">{error}</p>
              </div>
            )}

            {/* Empty State */}
            {!user && !loading && !error && (
              <div className="flex flex-col items-center justify-center mt-20 text-center">
                <div className="brut-card-yellow p-10 mb-6 inline-block text-7xl">
                  🐙
                </div>
                <h2 className="text-3xl font-bold text-black mb-3">
                  Search for a developer
                </h2>
                <p className="text-gray-600 text-base max-w-xs">
                  Enter any GitHub username above to explore
                  their profile and contribution data.
                </p>
              </div>
            )}

            {/* Results */}
            {user && !loading && (
              <div className="space-y-12">

                <div className="animate-fadeInUp">
                  <SectionHeading label="PROFILE" />
                  <ProfileCard user={user} />
                </div>

                <div className="brut-divider" />

                <div className="animate-fadeInUp delay-100">
                  <SectionHeading label="STATS" />
                  <RepoStats repos={repos} user={user} />
                </div>

                {repos.length > 0 && (
                  <>
                    <div className="brut-divider" />

                    <div className="animate-fadeInUp delay-200">
                      <SectionHeading label="DEVELOPER SCORE" />
                      <DeveloperScore
                        user={user}
                        repos={repos}
                        events={events}
                      />
                    </div>

                    <div className="brut-divider" />

                    <div className="animate-fadeInUp delay-200">
                      <SectionHeading label="LANGUAGES & STARS" />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <LanguageChart repos={repos} />
                        <StarChart repos={repos} />
                      </div>
                    </div>

                    <div className="brut-divider" />

                    <div className="animate-fadeInUp delay-300">
                      <SectionHeading label="CONTRIBUTIONS" />
                      <ContributionStats
                        events={events}
                        realCommits={realCommits}
                      />
                    </div>

                    <div className="brut-divider" />

                    <div className="animate-fadeInUp delay-300">
                      <SectionHeading label="ACTIVITY — LAST 30 DAYS" />
                      <ActivityGraph events={events} />
                    </div>

                    <div className="brut-divider" />

                    <div className="animate-fadeInUp delay-400">
                      <SectionHeading label="CONTRIBUTION HEATMAP" />
                      <ActivityHeatmap
                        username={user.login}
                        onContributionsLoaded={(total) => setRealCommits(total)}
                      />
                    </div>

                    <div className="brut-divider" />

                    <div className="animate-fadeInUp delay-400">
                      <SectionHeading
                        label="REPOSITORIES"
                        count={`${repos.length} total`}
                      />
                      <RepoList repos={repos} />
                    </div>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="border-t-2 border-black mt-20 px-6 py-5 flex justify-between items-center">
        <span className="mono text-sm text-gray-500 uppercase tracking-wider">
          GitHub Analyser — Built with React
        </span>
        <span className="brut-tag">2025</span>
      </div>

    </div>
  )
}

export default Dashboard