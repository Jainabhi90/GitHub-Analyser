import { Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'
import { getLanguageStats } from '../utils/dataProcessing'

ChartJS.register(ArcElement, Tooltip, Legend)

function LanguageChart({ repos }) {
  const languageStats = getLanguageStats(repos)
  const labels = Object.keys(languageStats)
  const values = Object.values(languageStats)

  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
    '#8B5CF6', '#EC4899', '#14B8A6', '#F97316',
    '#6366F1', '#84CC16'
  ]

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: colors.slice(0, labels.length),
        borderColor: '#1F2937',
        borderWidth: 2,
      }
    ]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#D1D5DB',
          padding: 16,
          font: { size: 12 }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const total = values.reduce((a, b) => a + b, 0)
            const percentage = ((context.parsed / total) * 100).toFixed(1)
            return ` ${context.label}: ${context.parsed} repos (${percentage}%)`
          }
        }
      }
    }
  }

  if (labels.length === 0) {
    return (
      <div className="bg-gray-800 rounded-2xl p-6 text-center text-gray-400">
        No language data available
      </div>
    )
  }

  return (
    <div className="bg-gray-800 rounded-2xl p-6 shadow-lg">
      <h3 className="text-white text-lg font-semibold mb-4 text-center">
        Language Distribution
      </h3>
      <div className="max-w-xs mx-auto">
        <Pie data={data} options={options} />
      </div>
    </div>
  )
}

export default LanguageChart