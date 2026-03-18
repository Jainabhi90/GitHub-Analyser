function RepoFilter({ repos, onFilterChange }) {
  const languages = [
    'All',
    ...new Set(repos.map(r => r.language).filter(Boolean))
  ]

  function handleChange(e) {
    const { name, value } = e.target
    onFilterChange(name, value)
  }

  return (
    <div className="flex flex-wrap gap-4 items-center bg-gray-800 rounded-xl px-6 py-4 max-w-5xl mx-auto">

      {/* Search by name */}
      <input
        type="text"
        name="search"
        placeholder="Search repos..."
        onChange={handleChange}
        className="flex-1 min-w-48 px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
      />

      {/* Sort */}
      <select
        name="sort"
        onChange={handleChange}
        className="px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
      >
        <option value="stars">Sort by Stars</option>
        <option value="forks">Sort by Forks</option>
        <option value="name">Sort by Name</option>
        <option value="updated">Sort by Updated</option>
      </select>

      {/* Language Filter */}
      <select
        name="language"
        onChange={handleChange}
        className="px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
      >
        {languages.map(lang => (
          <option key={lang} value={lang}>{lang}</option>
        ))}
      </select>

    </div>
  )
}

export default RepoFilter