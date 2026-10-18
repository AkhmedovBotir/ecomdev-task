import { useEffect, useState, type FormEvent } from 'react'
import type { Student } from '../types'
import { Modal } from './Modal'

type Props = {
  open: boolean
  students: Student[]
  presetStudentId?: string
  busy?: boolean
  error?: string | null
  onClose: () => void
  onSubmit: (data: {
    studentId: string
    amount: number
    date?: string
  }) => Promise<void> | void
}

export function PaymentFormModal({
  open,
  students,
  presetStudentId = '',
  busy = false,
  error,
  onClose,
  onSubmit,
}: Props) {
  const [studentId, setStudentId] = useState('')
  const [manualId, setManualId] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState('')

  useEffect(() => {
    if (!open) return
    setStudentId(presetStudentId)
    setManualId('')
    setAmount('')
    setDate('')
  }, [open, presetStudentId])

  const resolved = studentId || manualId.trim()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const amountNum = Number(amount)
    await onSubmit({
      studentId: resolved,
      amount: amountNum,
      date: date || undefined,
    })
  }

  return (
    <Modal
      open={open}
      title="Yangi to‘lov"
      onClose={() => {
        if (!busy) onClose()
      }}
    >
      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-3">
        <label className="block text-sm text-slate-600">
          O‘quvchi
          <select
            value={studentId}
            onChange={(e) => {
              setStudentId(e.target.value)
              if (e.target.value) setManualId('')
            }}
            className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-base outline-none focus:border-slate-400"
          >
            <option value="">— tanlang —</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.group})
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm text-slate-600">
          Yoki studentId
          <input
            type="text"
            value={manualId}
            onChange={(e) => {
              setManualId(e.target.value)
              if (e.target.value) setStudentId('')
            }}
            placeholder="ID"
            className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2.5 text-base outline-none focus:border-slate-400"
          />
        </label>

        <label className="block text-sm text-slate-600">
          Summa
          <input
            required
            type="number"
            min={1}
            step={1}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2.5 text-base outline-none focus:border-slate-400"
          />
        </label>

        <label className="block text-sm text-slate-600">
          Sana (ixtiyoriy)
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2.5 text-base outline-none focus:border-slate-400"
          />
        </label>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Bekor qilish
          </button>
          <button
            type="submit"
            disabled={busy}
            className="flex-1 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {busy ? 'Saqlanmoqda…' : 'Saqlash'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
