import { useCallback, useEffect, useState } from 'react'
import { apiFetch } from '../lib/api'
import { formatDate, formatMoney } from '../lib/format'
import {
  normalizePayment,
  normalizeStudent,
  type Payment,
  type Student,
} from '../types'
import { EyeIcon, PaymentIcon } from './icons'
import { PaymentFormModal } from './PaymentFormModal'

export function PaymentsSection() {
  const [students, setStudents] = useState<Student[]>([])
  const [formOpen, setFormOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const [historyId, setHistoryId] = useState('')
  const [payments, setPayments] = useState<Payment[]>([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [historyError, setHistoryError] = useState<string | null>(null)

  const loadStudents = useCallback(async () => {
    try {
      const data = await apiFetch<Record<string, unknown>[]>('/students')
      setStudents(
        Array.isArray(data) ? data.map((s) => normalizeStudent(s)) : [],
      )
    } catch {
      setStudents([])
    }
  }, [])

  useEffect(() => {
    void loadStudents()
  }, [loadStudents])

  async function loadPayments(id: string) {
    if (!id.trim()) {
      setHistoryError('O‘quvchi ID kerak')
      return
    }
    setHistoryLoading(true)
    setHistoryError(null)
    try {
      const data = await apiFetch<Record<string, unknown>[]>(
        `/students/${encodeURIComponent(id.trim())}/payments`,
      )
      setPayments(
        Array.isArray(data) ? data.map((p) => normalizePayment(p)) : [],
      )
      setHistoryId(id.trim())
    } catch (err) {
      setPayments([])
      setHistoryError(err instanceof Error ? err.message : 'Xatolik yuz berdi')
    } finally {
      setHistoryLoading(false)
    }
  }

  async function onSubmitPayment(data: {
    studentId: string
    amount: number
    date?: string
  }) {
    setFormError(null)
    setMessage(null)

    if (!data.studentId) {
      setFormError('O‘quvchini tanlang yoki ID kiriting')
      return
    }
    if (!data.amount || Number.isNaN(data.amount) || data.amount <= 0) {
      setFormError('To‘g‘ri summa kiriting')
      return
    }

    setSubmitting(true)
    try {
      const body: { studentId: string; amount: number; date?: string } = {
        studentId: data.studentId,
        amount: data.amount,
      }
      if (data.date) body.date = data.date

      await apiFetch('/payments', {
        method: 'POST',
        body: JSON.stringify(body),
      })
      setFormOpen(false)
      setMessage('To‘lov saqlandi')
      if (historyId === data.studentId) {
        void loadPayments(data.studentId)
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Xatolik yuz berdi')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-medium text-slate-700">To‘lovlar</h2>
        <button
          type="button"
          onClick={() => {
            setFormError(null)
            setFormOpen(true)
          }}
          className="btn-primary"
        >
          <PaymentIcon />
          To‘lov qo‘shish
        </button>
      </div>

      {message && (
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {message}
        </p>
      )}

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-slate-700">
          O‘quvchi to‘lovlari
        </h3>
        <div className="flex flex-col gap-2 sm:flex-row">
          <select
            value={historyId}
            onChange={(e) => setHistoryId(e.target.value)}
            className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-base text-slate-900 outline-none focus:border-slate-400"
          >
            <option value="">— o‘quvchi tanlang —</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.group})
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => void loadPayments(historyId)}
            disabled={historyLoading}
            className="btn-secondary"
          >
            <EyeIcon />
            Ko‘rish
          </button>
        </div>

        {historyError && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {historyError}
          </p>
        )}

        {historyLoading ? (
          <p className="text-sm text-slate-500">Yuklanmoqda…</p>
        ) : payments.length > 0 ? (
          <ul className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white">
            {payments.map((p) => (
              <li
                key={p.id || `${p.date}-${p.amount}`}
                className="flex items-center justify-between px-4 py-3 text-sm"
              >
                <span className="text-slate-500">{formatDate(p.date)}</span>
                <span className="font-medium text-slate-900">
                  {formatMoney(p.amount)}
                </span>
              </li>
            ))}
          </ul>
        ) : historyId && !historyError ? (
          <p className="text-sm text-slate-500">To‘lovlar topilmadi.</p>
        ) : null}
      </div>

      <PaymentFormModal
        open={formOpen}
        students={students}
        busy={submitting}
        error={formError}
        onClose={() => {
          if (submitting) return
          setFormOpen(false)
          setFormError(null)
        }}
        onSubmit={onSubmitPayment}
      />
    </div>
  )
}
