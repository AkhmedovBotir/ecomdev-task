import { useCallback, useEffect, useState } from 'react'
import { apiFetch } from '../lib/api'
import { formatMoney } from '../lib/format'
import {
  normalizeStudent,
  type Student,
  type StudentInput,
} from '../types'
import { ConfirmModal } from './ConfirmModal'
import { PencilIcon, PlusIcon, TrashIcon } from './icons'
import { StudentFormModal } from './StudentFormModal'

export function StudentsSection() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Student | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<Student | null>(null)
  const [deleteBusy, setDeleteBusy] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiFetch<Record<string, unknown>[]>('/students')
      setStudents(
        Array.isArray(data) ? data.map((s) => normalizeStudent(s)) : [],
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xatolik yuz berdi')
      setStudents([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  function openCreate() {
    setEditing(null)
    setFormError(null)
    setFormOpen(true)
  }

  function openEdit(s: Student) {
    setEditing(s)
    setFormError(null)
    setFormOpen(true)
  }

  async function onSubmit(data: StudentInput) {
    if (!data.name || !data.phone || !data.group) {
      setFormError('Ism, telefon va guruh majburiy')
      return
    }
    if (Number.isNaN(data.monthlyFee) || data.monthlyFee <= 0) {
      setFormError('Oylik to‘lov 0 dan katta bo‘lishi kerak')
      return
    }

    setSaving(true)
    setFormError(null)
    try {
      if (editing) {
        await apiFetch(`/students/${encodeURIComponent(editing.id)}`, {
          method: 'PUT',
          body: JSON.stringify(data),
        })
      } else {
        await apiFetch('/students', {
          method: 'POST',
          body: JSON.stringify(data),
        })
      }
      setFormOpen(false)
      setEditing(null)
      await load()
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Xatolik yuz berdi')
    } finally {
      setSaving(false)
    }
  }

  async function onConfirmDelete() {
    if (!deleting) return
    setDeleteBusy(true)
    setError(null)
    try {
      await apiFetch(`/students/${encodeURIComponent(deleting.id)}`, {
        method: 'DELETE',
      })
      setDeleting(null)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xatolik yuz berdi')
      setDeleting(null)
    } finally {
      setDeleteBusy(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-medium text-slate-700">O‘quvchilar</h2>
        <button type="button" onClick={openCreate} className="btn-primary">
          <PlusIcon />
          Qo‘shish
        </button>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-sm text-slate-500">Yuklanmoqda…</p>
      ) : students.length === 0 ? (
        <p className="text-sm text-slate-500">O‘quvchilar yo‘q.</p>
      ) : (
        <ul className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white">
          {students.map((s) => (
            <li key={s.id} className="px-4 py-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="font-medium text-slate-900">{s.name}</p>
                  <p className="text-sm text-slate-500">
                    {s.group} · {s.phone}
                  </p>
                  <p className="text-xs text-slate-400">
                    {formatMoney(s.monthlyFee)} / oy
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => openEdit(s)}
                    className="btn-secondary"
                  >
                    <PencilIcon />
                    Tahrir
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleting(s)}
                    className="btn-danger"
                  >
                    <TrashIcon />
                    O‘chirish
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <StudentFormModal
        open={formOpen}
        initial={editing}
        busy={saving}
        error={formError}
        onClose={() => {
          if (saving) return
          setFormOpen(false)
          setEditing(null)
          setFormError(null)
        }}
        onSubmit={onSubmit}
      />

      <ConfirmModal
        open={Boolean(deleting)}
        title="O‘chirish"
        message={
          deleting
            ? `“${deleting.name}” o‘chirilsinmi? Bu amalni qaytarib bo‘lmaydi.`
            : ''
        }
        busy={deleteBusy}
        onClose={() => {
          if (!deleteBusy) setDeleting(null)
        }}
        onConfirm={() => void onConfirmDelete()}
      />
    </div>
  )
}
