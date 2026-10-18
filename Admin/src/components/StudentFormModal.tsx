import { useEffect, useState, type FormEvent } from 'react'
import type { Student, StudentInput } from '../types'
import { Modal } from './Modal'

const empty: StudentInput = {
  name: '',
  phone: '',
  group: '',
  monthlyFee: 0,
}

type Props = {
  open: boolean
  initial?: Student | null
  busy?: boolean
  error?: string | null
  onClose: () => void
  onSubmit: (data: StudentInput) => Promise<void> | void
}

export function StudentFormModal({
  open,
  initial,
  busy = false,
  error,
  onClose,
  onSubmit,
}: Props) {
  const [form, setForm] = useState<StudentInput>(empty)

  useEffect(() => {
    if (!open) return
    if (initial) {
      setForm({
        name: initial.name,
        phone: initial.phone,
        group: initial.group,
        monthlyFee: initial.monthlyFee,
      })
    } else {
      setForm(empty)
    }
  }, [open, initial])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    await onSubmit({
      name: form.name.trim(),
      phone: form.phone.trim(),
      group: form.group.trim(),
      monthlyFee: Number(form.monthlyFee) || 0,
    })
  }

  return (
    <Modal
      open={open}
      title={initial ? 'O‘quvchini tahrirlash' : 'Yangi o‘quvchi'}
      onClose={() => {
        if (!busy) onClose()
      }}
    >
      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-3">
        <label className="block text-sm text-slate-600">
          Ism
          <input
            required
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2.5 text-base outline-none focus:border-slate-400"
          />
        </label>
        <label className="block text-sm text-slate-600">
          Telefon
          <input
            required
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2.5 text-base outline-none focus:border-slate-400"
          />
        </label>
        <label className="block text-sm text-slate-600">
          Guruh
          <input
            required
            type="text"
            value={form.group}
            onChange={(e) => setForm({ ...form, group: e.target.value })}
            className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2.5 text-base outline-none focus:border-slate-400"
          />
        </label>
        <label className="block text-sm text-slate-600">
          Oylik to‘lov
          <input
            required
            type="number"
            min={1}
            step={1}
            value={form.monthlyFee || ''}
            onChange={(e) =>
              setForm({
                ...form,
                monthlyFee: e.target.value === '' ? 0 : Number(e.target.value),
              })
            }
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
