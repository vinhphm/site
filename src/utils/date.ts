export function formatDate(date: Date) {
  const separator = '.'
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const pad = (num: number) => String(num).padStart(2, '0')

  return `${year}${separator}${pad(month)}${separator}${pad(day)}`
}
