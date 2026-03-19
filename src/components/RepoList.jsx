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
  } else {
    filtered = filtered
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 20)
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

      {/* Filter Bar */}
      <div className="brut-card p-4 flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="Search repos..."
          onChange={e => handleFilterChange('search', e.target.value)}
          className="brut-input flex-1 min-w-48 px-4 py-2 text-sm"
        />
        <select
          onChange={e => handleFilterChange('sort', e.target.value)}
          className="brut-input px-3 py-2 text-sm font-medium"
        >
          <option value="stars">Sort: Stars</option>
          <option value="forks">Sort: Forks</option>
          <option value="name">Sort: Name</option>
          <option value="updated">Sort: Updated</option>
        </select>
        <select
          onChange={e => handleFilterChange('language', e.target.value)}
          className="brut-input px-3 py-2 text-sm font-medium"
        >
          <option value="All">All Languages</option>
          {[...new Set(repos.map(r => r.language).filter(Boolean))].map(lang => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
      </div>

      {/* Results count */}
      <p className="text-xs text-gray-500 mono px-1 uppercase tracking-wider">
        {filters.search
          ? `Showing ${filtered.length} of ${repos.length} repos`
          : `Top 20 repos by stars — search to find more`
        }
      </p>

      {/* Repo Cards */}
      {filtered.length === 0 ? (
        <div className="brut-card p-8 text-center">
          <p className="text-gray-500">No repositories match your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(repo => (
            <a
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="brut-card p-5 block"
            >
              {/* Repo name */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-bold text-black text-base hover:underline">
                  {repo.name}
                </h3>
                {repo.stargazers_count > 0 && (
                  <span className="brut-tag flex-shrink-0">
                    {repo.stargazers_count} ★
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-10">
                {repo.description || 'No description provided'}
              </p>

              {/* Footer */}
              <div className="flex items-center gap-3 text-xs border-t-2 border-black pt-3">
                {repo.language && (
                  <span className="flex items-center gap-1 font-medium">
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-black"
                      style={{
                        backgroundColor: languageColors[repo.language] || '#888'
                      }}
                    />
                    {repo.language}
                  </span>
                )}
                <span className="text-gray-500 mono">{repo.forks_count} forks</span>
                <span className="ml-auto text-gray-400 mono">
                  {new Date(repo.updated_at).toLocaleDateString()}
                </span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

export default RepoList