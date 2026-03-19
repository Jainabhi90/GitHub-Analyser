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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler)

function ActivityGraph({ events }) {
  const last30Days = []
  for (let i = 29; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    last30Days.push(date.toISOString().split('T')[0])
  }

  const activityMap = {}
  last30Days.forEach(day => activityMap[day] = 0)

  events
    .filter(e => e.type === 'PushEvent')
    .forEach(e => {
      const date = e.created_at.split('T')[0]
      if (activityMap[date] !== undefined) {
        activityMap[date] += 1
      }
    })

  const labels = last30Days.map((date, i) => {
    if (i % 5 === 0) {
      const d = new Date(date)
      return `${d.getMonth() + 1}/${d.getDate()}`
    }
    return ''
  })

  const values = last30Days.map(day => activityMap[day])
  const totalPushes = values.reduce((a, b) => a + b, 0)
  const activeDays = values.filter(v => v > 0).length

  const data = {
    labels,
    datasets: [
      {
        label: 'Push Events',
        data: values,
        borderColor: '#111111',
        backgroundColor: 'rgba(17,17,17,0.05)',
        borderWidth: 2.5,
        pointBackgroundColor: '#e8c547',
        pointBorderColor: '#111',
        pointBorderWidth: 2,
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
      legend: { display: false },
      tooltip: {
        backgroundColor: '#111',
        titleColor: '#e8c547',
        bodyColor: '#f0ebe0',
        borderColor: '#111',
        borderWidth: 1,
        callbacks: {
          title: items => last30Days[items[0].dataIndex],
          label: item => ` ${item.parsed.y} push events`
        }
      }
    },
    scales: {
      x: {
        ticks: { color: '#888', font: { family: 'Space Mono, monospace', size: 10 } },
        grid: { color: 'rgba(0,0,0,0.06)' },
        border: { color: '#111', width: 2 }
      },
      y: {
        beginAtZero: true,
        ticks: { color: '#888', stepSize: 1, font: { family: 'Space Mono, monospace', size: 10 } },
        grid: { color: 'rgba(0,0,0,0.06)' },
        border: { color: '#111', width: 2 }
      }
    }
  }

  return (
    <div
      className="max-w-4xl mx-auto"
      style={{ border: '3px solid #111', background: '#fff', margin: '2px' }}
    >
      {/* Header */}
      <div style={{ background: '#111', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#f0ebe0', fontFamily: 'Space Mono, monospace', fontSize: '11px', letterSpacing: '3px' }}>
          // ACTIVITY — LAST 30 DAYS
        </span>
        <div style={{ display: 'flex', gap: '16px' }}>
          <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: '#888' }}>
            Pushes: <span style={{ color: '#e8c547', fontWeight: '700' }}>{totalPushes}</span>
          </span>
          <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: '#888' }}>
            Active days: <span style={{ color: '#e8c547', fontWeight: '700' }}>{activeDays}</span>
          </span>
        </div>
      </div>

      <div style={{ padding: '24px' }}>
        <Line data={data} options={options} />
      </div>
    </div>
  )
}

export default ActivityGraph