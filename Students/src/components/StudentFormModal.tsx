import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import type { Student, StudentInput } from '../types'
import { Modal } from './Modal'

type Props = {
  open: boolean
  initial?: Student | null
  busy?: boolean
  error?: string | null
  onClose: () => void
  onSubmit: (data: StudentInput) => Promise<void> | void
}

const empty: StudentInput = {
  name: '',
  phone: '',
  group: '',
  monthlyFee: 0,
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
      ...form,
      name: form.name.trim(),
      phone: form.phone.trim(),
      group: form.group.trim(),
      monthlyFee: Number(form.monthlyFee) || 0,
    })
  }

  return (
    <Modal
      open={open}
      title={initial ? "O'quvchini tahrirlash" : "Yangi o'quvchi"}
      onClose={() => {
        if (!busy) onClose()
      }}
    >
      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-3">
        <Field label="Ism">
          <input
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="input"
            placeholder="Ism familiya"
          />
        </Field>
        <Field label="Telefon">
          <input
            required
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            className="input"
            placeholder="+998 90 123 45 67"
            inputMode="tel"
          />
        </Field>
        <Field label="Guruh">
          <input
            required
            value={form.group}
            onChange={(e) => setForm((f) => ({ ...f, group: e.target.value }))}
            className="input"
            placeholder="Masalan: A1"
          />
        </Field>
        <Field label="Oylik to'lov">
          <input
            required
            type="number"
            min={1}
            value={form.monthlyFee || ''}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                monthlyFee:
                  e.target.value === '' ? 0 : Number(e.target.value),
              }))
            }
            className="input"
          />
        </Field>

        {error && (
          <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary flex-1"
            disabled={busy}
          >
            Bekor qilish
          </button>
          <button type="submit" className="btn-primary flex-1" disabled={busy}>
            {busy ? 'Saqlanmoqda…' : 'Saqlash'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-600">
        {label}
      </span>
      {children}
    </label>
  )
}
