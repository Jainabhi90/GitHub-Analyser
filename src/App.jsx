import { fetchUser, fetchRepos } from './services/githubApi'
import { getTotalStars, getMostUsedLanguage } from './utils/dataProcessing'

fetchUser("torvalds").then(user => console.log("User:", user.name))
fetchRepos("torvalds").then(repos => {
  console.log("Total Stars:", getTotalStars(repos))
  console.log("Top Language:", getMostUsedLanguage(repos))
})

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <h1 className="text-4xl font-bold">GitHub Dashboard</h1>
    </div>
  )
}

export default App