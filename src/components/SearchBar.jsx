function SearchBar({ onSearch }) {
  function handleSubmit(e) {
    e.preventDefault()
    const username = e.target.username.value.trim()
    if (!username) return
    onSearch(username)
  }

  return (
    <div className="flex justify-center items-center py-10">
      <form
        onSubmit={handleSubmit}
        className="flex gap-3 w-full max-w-lg"
      >
        <input
          type="text"
          name="username"
          placeholder="Enter GitHub username..."
          className="flex-1 px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
        >
          Search
        </button>
      </form>
    </div>
  )
}

export default SearchBar