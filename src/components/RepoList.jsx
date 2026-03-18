import { useState } from 'react'

function RepoList({ repos }) {
  const [filters, setFilters] = useState({
    search: '',
    sort: 'stars',
    language: 'All'
  })

  function handleFilterChange(name, value) {
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  let filtered = [...repos]

  if (filters.search) {
    filtered = filtered.filter(repo =>
      repo.name.toLowerCase().includes(filters.search.toLowerCase())
    )
  }

  if (filters.language !== 'All') {
    filtered = filtered.filter(repo => repo.language === filters.language)
  }

  if (filters.sort === 'stars') {
    filtered.sort((a, b) => b.stargazers_count - a.stargazers_count)
  } else if (filters.sort === 'forks') {
    filtered.sort((a, b) => b.forks_count - a.forks_count)
  } else if (filters.sort === 'name') {
    filtered.sort((a, b) => a.name.localeCompare(b.name))
  } else if (filters.sort === 'updated') {
    filtered.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
  }

  const languageColors = {
    JavaScript: '#F7DF1E',
    TypeScript: '#3178C6',
    Python: '#3572A5',
    HTML: '#E34C26',
    CSS: '#563D7C',
    Java: '#B07219',
    C: '#555555',
    Ruby: '#701516',
    Go: '#00ADD8',
    Rust: '#DEA584',
    Swift: '#F05138',
  }

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <div className="flex flex-wrap gap-4 items-center bg-gray-800 rounded-xl px-6 py-4">
        <input
          type="text"
          placeholder="Search repos..."
          onChange={e => handleFilterChange('search', e.target.value)}
          className="flex-1 min-w-48 px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
        />
        <select
          onChange={e => handleFilterChange('sort', e.target.value)}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
        >
          <option value="stars">Sort: Stars</option>
          <option value="forks">Sort: Forks</option>
          <option value="name">Sort: Name</option>
          <option value="updated">Sort: Updated</option>
        </select>
        <select
          onChange={e => handleFilterChange('language', e.target.value)}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
        >
          <option value="All">All Languages</option>
          {[...new Set(repos.map(r => r.language).filter(Boolean))].map(lang => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
      </div>

      <p className="text-gray-400 text-sm px-1">
        Showing {filtered.length} of {repos.length} repositories
      </p>

      {filtered.length === 0 ? (
        <div className="bg-gray-800 rounded-xl p-8 text-center text-gray-400">
          No repositories match your filters
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(repo => (
                <a
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-800 rounded-xl p-5 border border-gray-700 hover:border-blue-500 transition group"
            >
              <h3 className="text-blue-400 font-semibold text-lg group-hover:underline truncate">
                {repo.name}
              </h3>
              <p className="text-gray-400 text-sm mt-1 mb-3 line-clamp-2 min-h-10">
                {repo.description || 'No description provided'}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                {repo.language && (
                  <span className="flex items-center gap-1">
                    <span
                      className="w-3 h-3 rounded-full inline-block"
                      style={{ backgroundColor: languageColors[repo.language] || '#888888' }}
                    />
                    {repo.language}
                  </span>
                )}
                <span>{repo.stargazers_count} stars</span>
                <span>{repo.forks_count} forks</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
export default RepoList