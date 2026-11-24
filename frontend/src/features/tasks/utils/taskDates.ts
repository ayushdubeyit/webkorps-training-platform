export function localDateToday() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

export function formatTaskDate(value: string) {
  const date = new Date(`${value}T00:00:00`)
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(date)
}

export function taskTimingLabel(startDate: string, deadline: string, status: string, today = localDateToday()) {
  if (status === 'COMPLETED') return 'Completed'
  if (startDate > today) return 'Not started'
  if (deadline < today) return 'Overdue'
  const daysUntilDeadline = Math.round((new Date(`${deadline}T00:00:00`).getTime() - new Date(`${today}T00:00:00`).getTime()) / 86400000)
  return daysUntilDeadline <= 3 ? 'Due soon' : 'On schedule'
}
