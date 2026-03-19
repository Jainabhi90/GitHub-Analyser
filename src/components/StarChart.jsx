import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js'
import { getTopRepos } from '../utils/dataProcessing'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

function StarChart({ repos }) {
  const topRepos = getTopRepos(repos)
  const labels = topRepos.map(repo => repo.name)
  const values = topRepos.map(repo => repo.stargazers_count)

  const data = {
    labels,
   datasets: [
  {
    label: 'Stars',
    data: values,
    backgroundColor: '#f5a623',
    borderColor: '#0a0a0a',
    borderWidth: 2,
    borderRadius: 0,
  }
]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => ` ${context.parsed.y} stars`
        }
      }
    },
    scales: {
      x: {
        ticks: { color: '#0a0a0a', font: { family: 'Space Mono' } },
        grid: { color: 'rgba(0,0,0,0.08)' }
      },
      y: {
        ticks: { color: '#0a0a0a', font: { family: 'Space Mono' } },
        grid: { color: 'rgba(0,0,0,0.08)' },
        beginAtZero: true
      }
    }
  }

  if (topRepos.length === 0) {
    return (
      <div className="bg-gray-800 rounded-2xl p-6 text-center text-gray-400">
        No repository data available
      </div>
    )
  }

  return (
  <div className="brut-card p-6">
    <h3 className="font-bold text-black text-base mb-4 uppercase tracking-wider">
      Top 5 Repos by Stars
    </h3>
    <Bar data={data} options={options} />
  </div>
)
}

export default StarChart