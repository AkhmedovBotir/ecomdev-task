import { useCallback, useEffect, useState } from 'react'
import { apiFetch } from '../lib/api'
import { currentMonth, formatMoney } from '../lib/format'
import {
  normalizeStudent,
  type Debtor,
  type Student,
} from '../types'
import { PaymentIcon, RefreshIcon } from './icons'
import { PaymentFormModal } from './PaymentFormModal'

export function DebtorsSection() {
  const [month, setMonth] = useState(currentMonth)
  const [items, setItems] = useState<Debtor[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [payOpen, setPayOpen] = useState(false)
  const [presetId, setPresetId] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiFetch<Debtor[]>(
        `/debtors?month=${encodeURIComponent(month)}`,
      )
      setItems(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xatolik yuz berdi')
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [month])

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
    void load()
  }, [load])

  useEffect(() => {
    void loadStudents()
  }, [loadStudents])

  function openPay(studentId: string) {
    setPresetId(studentId)
    setFormError(null)
    setPayOpen(true)
  }

  async function onSubmitPayment(data: {
    studentId: string
    amount: number
    date?: string
  }) {
    if (!data.studentId) {
      setFormError('O‘quvchini tanlang')
      return
    }
    if (!data.amount || data.amount <= 0) {
      setFormError('To‘g‘ri summa kiriting')
      return
    }

    setSubmitting(true)
    setFormError(null)
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
      setPayOpen(false)
      await load()
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Xatolik yuz berdi')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <label className="block text-sm text-slate-600">
          Oy
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-base text-slate-900 outline-none focus:border-slate-400 sm:w-48"
          />
        </label>
        <button
          type="button"
          onClick={() => void load()}
          disabled={loading}
          className="btn-primary"
        >
          <RefreshIcon />
          Yangilash
        </button>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-sm text-slate-500">Yuklanmoqda…</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-slate-500">Bu oy uchun qarzdorlar yo‘q.</p>
      ) : (
        <ul className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white">
          {items.map((d) => (
            <li key={d.studentId} className="px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-900">
                    {d.name}
                  </p>
                  <p className="mt-0.5 text-sm text-slate-500">
                    {d.group} · {d.phone}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Oylik: {formatMoney(d.monthlyFee)} · to‘langan:{' '}
                    {formatMoney(d.paid)}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold text-red-600">
                    {formatMoney(d.debt)}
                  </p>
                  <button
                    type="button"
                    onClick={() => openPay(d.studentId)}
                    className="btn-secondary mt-2 !px-2.5 !py-1.5 text-xs"
                  >
                    <PaymentIcon size={14} />
                    To‘lov
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <PaymentFormModal
        open={payOpen}
        students={students}
        presetStudentId={presetId}
        busy={submitting}
        error={formError}
        onClose={() => {
          if (submitting) return
          setPayOpen(false)
          setFormError(null)
        }}
        onSubmit={onSubmitPayment}
      />
    </div>
  )
}
