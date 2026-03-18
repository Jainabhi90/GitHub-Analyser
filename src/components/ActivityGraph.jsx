import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
)

function ActivityGraph({ events }) {

  // Step 1: Generate last 30 days as labels
  const last30Days = []
  for (let i = 29; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    last30Days.push(date.toISOString().split('T')[0])
  }

  // Step 2: Count PushEvents per day
  const activityMap = {}
  last30Days.forEach(day => activityMap[day] = 0)

  events
    .filter(event => event.type === 'PushEvent')
    .forEach(event => {
      const date = event.created_at.split('T')[0]
      if (activityMap[date] !== undefined) {
        activityMap[date] += 1
      }
    })

  // Step 3: Format labels for display (show only every 5th day)
  const labels = last30Days.map((date, index) => {
    if (index % 5 === 0) {
      const d = new Date(date)
      return `${d.getMonth() + 1}/${d.getDate()}`
    }
    return ''
  })

  const values = last30Days.map(day => activityMap[day])

  const data = {
    labels,
    datasets: [
      {
        label: 'Push Events',
        data: values,
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        pointBackgroundColor: '#3B82F6',
        pointRadius: 3,
        pointHoverRadius: 6,
        tension: 0.4,
        fill: true,
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
          title: (items) => {
            const index = items[0].dataIndex
            return last30Days[index]
          },
          label: (item) => ` ${item.parsed.y} push events`
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#9CA3AF',
          font: { size: 11 }
        },
        grid: {
          color: '#374151'
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: '#9CA3AF',
          stepSize: 1,
          font: { size: 11 }
        },
        grid: {
          color: '#374151'
        }
      }
    }
  }

  const totalPushes = values.reduce((a, b) => a + b, 0)
  const activeDays = values.filter(v => v > 0).length

  if (totalPushes === 0) {
    return (
      <div className="bg-gray-800 rounded-2xl p-6 shadow-lg">
        <h3 className="text-white text-lg font-semibold mb-2">
          Activity — Last 30 Days
        </h3>
        <div className="text-center text-gray-400 py-8">
          No push activity in the last 30 days
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 rounded-2xl p-6 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white text-lg font-semibold">
          Activity — Last 30 Days
        </h3>
        <div className="flex gap-4 text-sm">
          <span className="text-gray-400">
            Total pushes:
            <span className="text-blue-400 font-bold ml-1">{totalPushes}</span>
          </span>
          <span className="text-gray-400">
            Active days:
            <span className="text-green-400 font-bold ml-1">{activeDays}</span>
          </span>
        </div>
      </div>
      <Line data={data} options={options} />
    </div>
  )
}

export default ActivityGraph