import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { formatDate, formatMoney } from '../lib/format'
import { createPayment, listStudentPayments } from '../lib/studentsApi'
import type { Payment, Student } from '../types'
import { ConfirmModal } from './ConfirmModal'
import {
  ArrowLeftIcon,
  PaymentIcon,
  PencilIcon,
  TrashIcon,
} from './icons'
import { PaymentFormModal } from './PaymentFormModal'

type Props = {
  student: Student
  onBack: () => void
  onEdit: () => void
  onDeleted: () => void
  onDelete: () => Promise<void>
}

export function StudentDetail({
  student,
  onBack,
  onEdit,
  onDeleted,
  onDelete,
}: Props) {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [payOpen, setPayOpen] = useState(false)
  const [payBusy, setPayBusy] = useState(false)
  const [payError, setPayError] = useState<string | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function loadPayments() {
    setLoading(true)
    setError(null)
    try {
      const data = await listStudentPayments(student.id)
      setPayments(
        [...data].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        ),
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : "To'lovlar yuklanmadi")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadPayments()
  }, [student.id])

  async function handleAddPayment(data: { amount: number; date: string }) {
    if (!data.amount || data.amount <= 0) {
      setPayError("To'g'ri summa kiriting")
      return
    }
    setPayBusy(true)
    setPayError(null)
    try {
      await createPayment({
        studentId: student.id,
        amount: data.amount,
        date: data.date,
      })
      setPayOpen(false)
      await loadPayments()
    } catch (err) {
      setPayError(err instanceof Error ? err.message : "To'lov qo'shilmadi")
    } finally {
      setPayBusy(false)
    }
  }

  async function handleConfirmDelete() {
    setDeleting(true)
    try {
      await onDelete()
      setDeleteOpen(false)
      onDeleted()
    } catch (err) {
      setError(err instanceof Error ? err.message : "O'chirish muvaffaqiyatsiz")
      setDeleting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.22 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2">
        <button type="button" onClick={onBack} className="btn-ghost gap-1.5">
          <ArrowLeftIcon />
          Orqaga
        </button>
        <div className="ml-auto flex gap-2">
          <button type="button" onClick={onEdit} className="btn-secondary">
            <PencilIcon />
            Tahrirlash
          </button>
          <button
            type="button"
            onClick={() => setDeleteOpen(true)}
            className="btn-danger"
          >
            <TrashIcon />
            O'chirish
          </button>
        </div>
      </div>

      <section className="rounded-2xl bg-white p-4 ring-1 ring-slate-200 sm:p-5">
        <p className="text-sm font-medium text-slate-500">O'quvchi</p>
        <h2 className="mt-1 text-xl font-semibold text-slate-900">
          {student.name}
        </h2>
        <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Info label="Telefon" value={student.phone} />
          <Info label="Guruh" value={student.group} />
          <Info label="Oylik to'lov" value={formatMoney(student.monthlyFee)} />
        </dl>
      </section>

      <section className="rounded-2xl bg-white p-4 ring-1 ring-slate-200 sm:p-5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-base font-semibold text-slate-900">To'lovlar</h3>
          <button
            type="button"
            onClick={() => {
              setPayError(null)
              setPayOpen(true)
            }}
            className="btn-primary"
          >
            <PaymentIcon />
            To'lov qo'shish
          </button>
        </div>

        {error && (
          <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        {loading ? (
          <p className="mt-4 text-sm text-slate-500">Yuklanmoqda…</p>
        ) : payments.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">Hali to'lov yo'q.</p>
        ) : (
          <ul className="mt-3 divide-y divide-slate-100">
            <AnimatePresence initial={false}>
              {payments.map((p) => (
                <motion.li
                  key={p.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-between gap-3 py-3"
                >
                  <div>
                    <p className="font-medium text-slate-800">
                      {formatMoney(p.amount)}
                    </p>
                    <p className="text-sm text-slate-500">{formatDate(p.date)}</p>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </section>

      <PaymentFormModal
        open={payOpen}
        defaultAmount={student.monthlyFee}
        busy={payBusy}
        error={payError}
        onClose={() => {
          if (payBusy) return
          setPayOpen(false)
          setPayError(null)
        }}
        onSubmit={handleAddPayment}
      />

      <ConfirmModal
        open={deleteOpen}
        title="O'chirish"
        message={`"${student.name}" o‘chirilsinmi? Bu amalni qaytarib bo‘lmaydi.`}
        busy={deleting}
        onClose={() => {
          if (!deleting) setDeleteOpen(false)
        }}
        onConfirm={() => void handleConfirmDelete()}
      />
    </motion.div>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 px-3 py-2">
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm font-medium text-slate-900">{value}</dd>
    </div>
  )
}
