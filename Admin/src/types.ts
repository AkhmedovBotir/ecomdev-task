export type Student = {
  id: string
  name: string
  phone: string
  group: string
  monthlyFee: number
}

export type StudentInput = {
  name: string
  phone: string
  group: string
  monthlyFee: number
}

export type Debtor = {
  studentId: string
  name: string
  phone: string
  group: string
  monthlyFee: number
  paid: number
  debt: number
}

export type Payment = {
  id: string
  studentId: string
  amount: number
  date: string
}

/** Normalize API student payloads that may use `id` or Mongo `_id`. */
export function normalizeStudent(raw: Record<string, unknown>): Student {
  const id = String(raw.id ?? raw._id ?? '')
  return {
    id,
    name: String(raw.name ?? ''),
    phone: String(raw.phone ?? ''),
    group: String(raw.group ?? ''),
    monthlyFee: Number(raw.monthlyFee ?? 0),
  }
}

export function normalizePayment(raw: Record<string, unknown>): Payment {
  return {
    id: String(raw.id ?? raw._id ?? ''),
    studentId: String(raw.studentId ?? ''),
    amount: Number(raw.amount ?? 0),
    date: String(raw.date ?? ''),
  }
}
