import { AnimatePresence, motion } from 'framer-motion'
import { formatMoney } from '../lib/format'
import type { Student } from '../types'
import { PlusIcon } from './icons'

type Props = {
  students: Student[]
  search: string
  onSearchChange: (value: string) => void
  onSelect: (student: Student) => void
  onCreate: () => void
  loading: boolean
  error: string | null
}

export function StudentList({
  students,
  search,
  onSearchChange,
  onSelect,
  onCreate,
  loading,
  error,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.22 }}
      className="space-y-4"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            O'quvchilar
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Ro'yxat, qidiruv va to'lovlar
          </p>
        </div>
        <button type="button" onClick={onCreate} className="btn-primary">
          <PlusIcon />
          Qo'shish
        </button>
      </div>

      <label className="block">
        <span className="sr-only">Qidirish</span>
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="input"
          placeholder="Ism, telefon yoki guruh bo'yicha qidirish…"
        />
      </label>

      {error && (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <section className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200">
        {loading ? (
          <p className="p-5 text-sm text-slate-500">Yuklanmoqda…</p>
        ) : students.length === 0 ? (
          <p className="p-5 text-sm text-slate-500">
            {search.trim()
              ? 'Hech narsa topilmadi.'
              : "Hali o'quvchi yo'q. Qo'shing."}
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            <AnimatePresence initial={false}>
              {students.map((student, index) => (
                <motion.li
                  key={student.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.03, 0.2) }}
                >
                  <button
                    type="button"
                    onClick={() => onSelect(student)}
                    className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-slate-50 active:bg-slate-100"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
                      {initials(student.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-slate-900">
                        {student.name}
                      </p>
                      <p className="truncate text-sm text-slate-500">
                        {student.group} · {student.phone}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-medium text-slate-700">
                        {formatMoney(student.monthlyFee)}
                      </p>
                      <p className="text-xs text-slate-400">oylik</p>
                    </div>
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </section>
    </motion.div>
  )
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}
