# GitHub Analyser 🐙

A full-stack developer analytics dashboard built with React, Chart.js and GitHub's GraphQL API. Features a unique brutalist design aesthetic with deep insights into any GitHub profile.

## Live Demo
🌐 [git-hub-analyser.vercel.app](https://git-hub-analyser.vercel.app)

---

## Features

### Search & Profile
- Search any GitHub username instantly
- View profile card with avatar, bio, location
- Followers, following and public repo count
- Search history (last 5 searches)
- Member since year

### Analytics & Stats
- Total repositories, stars, forks
- Most starred repo with direct link
- Top programming language detection
- Full repo breakdown (original vs forked)

### Charts & Visualizations
- Language distribution pie chart
- Top 5 repos by stars bar chart
- Activity line graph (last 30 days)
- **Real 12-month contribution heatmap** (via GitHub GraphQL API)

### Contributions
- Total commits (last 12 months) — real data via GraphQL
- Pull requests opened
- Issues opened

### Developer Score
- Algorithmic score out of 10
- Weighted across 6 categories (followers, stars, commits, PRs, repos, issues)
- Tier labels: Beginner → Junior → Intermediate → Advanced → Elite

### Repository Browser
- Browse top 20 repos by default
- Search across all repos by name
- Sort by stars, forks, name, or last updated
- Filter by programming language
- Each repo links directly to GitHub

### Compare Mode
- Compare any 2 GitHub users head to head
- 8 categories compared with winner badges
- Overall winner calculation
- PRs, commits, issues, followers, stars and more

---

## Tech Stack

### Frontend
- React 18 + Vite
- Tailwind CSS
- Chart.js + react-chartjs-2
- Space Grotesk + Space Mono fonts

### Backend
- Vercel Serverless Functions
- GitHub GraphQL API (real contribution data)
- GitHub REST API (profile, repos, events)

### Deployment
- Frontend + Backend → Vercel
- Environment variables for secure token storage

---

## Architecture
```
React Frontend (Vercel)
        ↓
Vercel Serverless Function (/api/contributions)
        ↓
GitHub GraphQL API (real 12-month heatmap data)

React Frontend
        ↓
GitHub REST API (profile, repos, events)
```

---

## Local Development
```bash
# Clone the repo
git clone https://github.com/Jainabhi90/GitHub-Analyser.git
cd GitHub-Analyser/github-dashboard

# Install dependencies
npm install

# Run dev server
npm run dev
```

### Environment Variables

For the contribution heatmap to work locally, create a `.env` file:
```
GITHUB_TOKEN=your_github_personal_access_token
```

Get a token at: github.com → Settings → Developer Settings → Personal Access Tokens → read:user scope only

---

## Project Structure
```
github-dashboard/
├── api/
│   └── contributions.js      ← Vercel serverless function
├── src/
│   ├── components/
│   │   ├── SearchBar.jsx
│   │   ├── ProfileCard.jsx
│   │   ├── RepoStats.jsx
│   │   ├── RepoList.jsx
│   │   ├── LanguageChart.jsx
│   │   ├── StarChart.jsx
│   │   ├── ActivityGraph.jsx
│   │   ├── ActivityHeatmap.jsx
│   │   ├── ContributionStats.jsx
│   │   ├── DeveloperScore.jsx
│   │   └── CompareUsers.jsx
│   ├── services/
│   │   └── githubApi.js
│   ├── utils/
│   │   └── dataProcessing.js
│   └── pages/
│       └── Dashboard.jsx
```

---

## What Makes This Different

- **Real contribution data** via GitHub GraphQL API — not estimates
- **Full stack** — React frontend + Vercel serverless backend
- **Brutalist design** — unique cream + black editorial aesthetic
- **Developer Score** — algorithmic rating system out of 10
- **Compare mode** — head to head developer comparison
- **No API key needed** by users — token secured on server

---

Built with React + Vite · Deployed on Vercel · 2025