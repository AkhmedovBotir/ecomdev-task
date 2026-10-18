export function formatMoney(amount: number): string {
  return `${new Intl.NumberFormat('ru-RU').format(amount)} so'm`
}

/** Display dates as DD.MM.YYYY (stable across OS locales). */
export function formatDate(value: string): string {
  if (!value) return '—'

  const parsed = parseDate(value)
  if (!parsed) return value

  const day = String(parsed.getDate()).padStart(2, '0')
  const month = String(parsed.getMonth() + 1).padStart(2, '0')
  const year = parsed.getFullYear()
  return `${day}.${month}.${year}`
}

export function todayISO(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function parseDate(value: string): Date | null {
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})/.exec(value)
  if (dateOnly) {
    const year = Number(dateOnly[1])
    const month = Number(dateOnly[2])
    const day = Number(dateOnly[3])
    const d = new Date(year, month - 1, day)
    return Number.isNaN(d.getTime()) ? null : d
  }

  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? null : d
}
