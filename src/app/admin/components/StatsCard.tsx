import { ReactNode } from 'react'

interface StatsCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: 'increase' | 'decrease' | 'neutral'
  icon?: ReactNode
  subtitle?: string
}

export default function StatsCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  subtitle,
}: StatsCardProps) {
  const changeColor = {
    increase: 'text-green-600 bg-green-50',
    decrease: 'text-red-600 bg-red-50',
    neutral: 'text-gray-600 bg-gray-50',
  }[changeType]

  const changeIcon = {
    increase: '↑',
    decrease: '↓',
    neutral: '•',
  }[changeType]

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">{title}</p>
        </div>
        {icon && <div className="text-cyan-600 text-3xl">{icon}</div>}
      </div>

      <div className="mb-2">
        <h3 className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</h3>
      </div>

      <div className="flex items-center gap-3">
        {change && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${changeColor}`}>
            {changeIcon} {change}
          </span>
        )}
        {subtitle && <span className="text-xs text-gray-500">{subtitle}</span>}
      </div>
    </div>
  )
}
