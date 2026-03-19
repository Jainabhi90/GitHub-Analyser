export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET')

  const { type, username } = req.query

  if (!username) {
    return res.status(400).json({ error: 'Username is required' })
  }

  const token = process.env.GITHUB_TOKEN

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  }

  try {
    let url = ''

    if (type === 'user') {
      url = `https://api.github.com/users/${username}`
    } else if (type === 'repos') {
      url = `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`
    } else if (type === 'events') {
      url = `https://api.github.com/users/${username}/events?per_page=100`
    } else {
      return res.status(400).json({ error: 'Invalid type' })
    }

    const response = await fetch(url, { headers })

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ error: 'User not found. Please check the username.' })
      }
      if (response.status === 403) {
        return res.status(403).json({ error: 'API rate limit exceeded. Please try again later.' })
      }
      return res.status(response.status).json({ error: 'Failed to fetch data from GitHub.' })
    }

    const data = await response.json()
    return res.status(200).json(data)

  } catch (err) {
    return res.status(500).json({ error: 'Server error. Please try again.' })
  }
}