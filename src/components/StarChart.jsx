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
        backgroundColor: '#3B82F6',
        borderColor: '#2563EB',
        borderWidth: 1,
        borderRadius: 6,
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
        ticks: { color: '#D1D5DB' },
        grid: { color: '#374151' }
      },
      y: {
        ticks: { color: '#D1D5DB' },
        grid: { color: '#374151' },
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
    <div className="bg-gray-800 rounded-2xl p-6 shadow-lg">
      <h3 className="text-white text-lg font-semibold mb-4 text-center">
        Top 5 Repos by Stars
      </h3>
      <Bar data={data} options={options} />
    </div>
  )
}

export default StarChart