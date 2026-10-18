import { useEffect, useState, type FormEvent } from 'react'
import { todayISO } from '../lib/format'
import { Modal } from './Modal'

type Props = {
  open: boolean
  defaultAmount?: number
  busy?: boolean
  error?: string | null
  onClose: () => void
  onSubmit: (data: { amount: number; date: string }) => Promise<void> | void
}

export function PaymentFormModal({
  open,
  defaultAmount = 0,
  busy = false,
  error,
  onClose,
  onSubmit,
}: Props) {
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(todayISO())

  useEffect(() => {
    if (!open) return
    setAmount(defaultAmount ? String(defaultAmount) : '')
    setDate(todayISO())
  }, [open, defaultAmount])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    await onSubmit({
      amount: Number(amount),
      date,
    })
  }

  return (
    <Modal
      open={open}
      title="To'lov qo'shish"
      onClose={() => {
        if (!busy) onClose()
      }}
    >
      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-3">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-600">
            Summa
          </span>
          <input
            type="number"
            min={1}
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="input"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-600">
            Sana
          </span>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input"
          />
        </label>

        {error && (
          <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="btn-secondary flex-1"
          >
            Bekor qilish
          </button>
          <button type="submit" disabled={busy} className="btn-primary flex-1">
            {busy ? "Qo'shilmoqda…" : 'Saqlash'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
