function SearchBar({ onSearch }) {
  function handleSubmit(e) {
    e.preventDefault()
    const username = e.target.username.value.trim()
    if (!username) return
    onSearch(username)
  }

  return (
    <div className="flex justify-center py-6">
      <form onSubmit={handleSubmit} className="flex gap-3 w-full max-w-xl">
        <input
          type="text"
          name="username"
          placeholder="Enter GitHub username..."
          className="brut-input flex-1 px-5 py-3 text-sm font-medium"
        />
        <button type="submit" className="brut-btn px-8 py-3 text-sm">
          Search →
        </button>
      </form>
    </div>
  )
}

export default SearchBar