const BASE_URL = typeof window !== 'undefined'
  ? ''
  : 'http://localhost:3000'

async function githubFetch(type, username) {
  const res = await fetch(`/api/github?type=${type}&username=${username}`)

  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.error || 'Something went wrong.')
  }

  return res.json()
}

export async function fetchUser(username) {
  return githubFetch('user', username)
}

export async function fetchRepos(username) {
  return githubFetch('repos', username)
}

export async function fetchEvents(username) {
  return githubFetch('events', username)
}