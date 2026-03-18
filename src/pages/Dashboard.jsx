import { useState } from 'react'
import SearchBar from '../components/SearchBar'
import ProfileCard from '../components/ProfileCard'
import RepoStats from '../components/RepoStats'
import LanguageChart from '../components/LanguageChart'
import StarChart from '../components/StarChart'
import { fetchUser, fetchRepos } from '../services/githubApi'

function Dashboard() {
  const [user, setUser] = useState(null)
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSearch(username) {
    setLoading(true)
    setError(null)
    setUser(null)
    setRepos([])

    try {
      const userData = await fetchUser(username)
      const reposData = await fetchRepos(username)
      setUser(userData)
      setRepos(reposData)
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
        <h1 className="text-4xl font-bold text-white">
          GitHub Analyser
        </h1>
        <p className="text-gray-400 mt-2">
          Enter a GitHub username to explore their profile
        </p>
      </div>

      {/* Search Bar */}
      <SearchBar onSearch={handleSearch} />

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center mt-16">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="max-w-md mx-auto mt-10 bg-red-900 border border-red-500 text-red-200 px-6 py-4 rounded-xl text-center">
          ⚠️ {error}
        </div>
      )}

      {/* Main Content */}
      {user && !loading && (
        <div className="max-w-5xl mx-auto mt-8 space-y-8">

          {/* Profile Card */}
          <ProfileCard user={user} />

          {/* Repo Stats */}
          <RepoStats repos={repos} />

          {/* Charts Section */}
          {repos.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <LanguageChart repos={repos} />
              <StarChart repos={repos} />
            </div>
          )}

        </div>
      )}

    </div>
  )
}

export default Dashboard