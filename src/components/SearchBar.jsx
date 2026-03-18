function SearchBar({ onSearch }) {
  function handleSubmit(e) {
    e.preventDefault()
    const username = e.target.username.value.trim()
    if (!username) return
    onSearch(username)
  }

  return (
    <div className="flex justify-center items-center py-6">
      <form
        onSubmit={handleSubmit}
        className="flex gap-3 w-full max-w-lg"
      >
        <input
          type="text"
          name="username"
          placeholder="Enter GitHub username..."
          className="flex-1 px-5 py-3 rounded-xl glass text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20 transition-all duration-300"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105"
        >
          Search
        </button>
      </form>
    </div>
  )
}

export default SearchBar