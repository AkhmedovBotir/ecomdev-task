import { env } from '../config/env.js'

export type Debtor = {
  studentId: string
  name: string
  debt: number
}

export type CreatePaymentInput = {
  studentId: string
  amount: number
}

export type CreatePaymentResult = {
  ok: true
  data: unknown
} | {
  ok: false
  message: string
}

async function parseErrorMessage(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { message?: string; error?: string }
    return body.message ?? body.error ?? `HTTP ${response.status}`
  } catch {
    return `HTTP ${response.status}`
  }
}

export async function fetchDebtors(month: string): Promise<Debtor[]> {
  const url = new URL('/debtors', env.apiUrl)
  url.searchParams.set('month', month)

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(await parseErrorMessage(response))
  }

  const data = (await response.json()) as unknown
  if (!Array.isArray(data)) {
    throw new Error('Unexpected debtors response')
  }

  return data.map((item) => {
    const row = item as Record<string, unknown>
    const studentId = String(row.studentId ?? row.id ?? '')
    const name = String(row.name ?? row.fullName ?? '—')
    const debt = Number(row.debt ?? row.amount ?? row.debtAmount ?? 0)
    return { studentId, name, debt }
  })
}

export async function createPayment(
  input: CreatePaymentInput,
): Promise<CreatePaymentResult> {
  const url = new URL('/payments', env.apiUrl)

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: input.studentId,
        amount: input.amount,
      }),
    })

    if (!response.ok) {
      return { ok: false, message: await parseErrorMessage(response) }
    }

    const data = await response.json().catch(() => null)
    return { ok: true, data }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Network error'
    return { ok: false, message }
  }
}
