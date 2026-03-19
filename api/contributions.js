export default async function handler(req, res) {
  // Allow requests from your frontend
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET')

  const { username } = req.query

  if (!username) {
    return res.status(400).json({ error: 'Username is required' })
  }

  const token = process.env.GITHUB_TOKEN

  if (!token) {
    return res.status(500).json({ error: 'GitHub token not configured' })
  }

  const query = `
    query($username: String!) {
      user(login: $username) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
                color
              }
            }
          }
        }
      }
    }
  `

  try {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { username }
      })
    })

    const data = await response.json()

    if (data.errors) {
      return res.status(400).json({ error: data.errors[0].message })
    }

    const calendar = data.data.user.contributionsCollection.contributionCalendar

    return res.status(200).json({
      totalContributions: calendar.totalContributions,
      weeks: calendar.weeks
    })

  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch contributions' })
  }
}