import { AnimatePresence } from 'framer-motion'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { StudentDetail } from './components/StudentDetail'
import { StudentFormModal } from './components/StudentFormModal'
import { StudentList } from './components/StudentList'
import {
  createStudent,
  deleteStudent,
  listStudents,
  updateStudent,
} from './lib/studentsApi'
import type { Student, StudentInput } from './types'
import { RefreshIcon } from './components/icons'

type View = 'list' | 'detail'

function App() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [view, setView] = useState<View>('list')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Student | null>(null)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const loadStudents = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await listStudents()
      setStudents(data)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "O'quvchilar yuklanmadi",
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadStudents()
  }, [loadStudents])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return students
    return students.filter((s) => {
      return (
        s.name.toLowerCase().includes(q) ||
        s.phone.toLowerCase().includes(q) ||
        s.group.toLowerCase().includes(q)
      )
    })
  }, [students, search])

  const selected = useMemo(
    () => students.find((s) => s.id === selectedId) ?? null,
    [students, selectedId],
  )

  async function handleSave(data: StudentInput) {
    setSaving(true)
    setFormError(null)
    try {
      if (editing) {
        const updated = await updateStudent(editing.id, data)
        setStudents((prev) =>
          prev.map((s) => (s.id === updated.id ? updated : s)),
        )
      } else {
        const created = await createStudent(data)
        setStudents((prev) => [created, ...prev])
      }
      setFormOpen(false)
      setEditing(null)
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : 'Saqlash muvaffaqiyatsiz',
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="min-h-screen">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3 sm:px-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Training Center
            </p>
            <p className="text-sm font-semibold text-slate-800">
              O'quvchilar paneli
            </p>
          </div>
          <button
            type="button"
            onClick={() => void loadStudents()}
            className="btn-ghost inline-flex items-center gap-1.5 text-sm"
          >
            <RefreshIcon />
            Yangilash
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-5 sm:px-6 sm:py-8">
        {error && view === 'detail' && (
          <p className="mb-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}
        <AnimatePresence mode="wait">
          {view === 'list' || !selected ? (
            <StudentList
              key="list"
              students={filtered}
              search={search}
              onSearchChange={setSearch}
              loading={loading}
              error={error}
              onCreate={() => {
                setEditing(null)
                setFormError(null)
                setFormOpen(true)
              }}
              onSelect={(student) => {
                setSelectedId(student.id)
                setView('detail')
                setError(null)
              }}
            />
          ) : (
            <StudentDetail
              key={selected.id}
              student={selected}
              onBack={() => {
                setView('list')
                setSelectedId(null)
              }}
              onEdit={() => {
                setEditing(selected)
                setFormError(null)
                setFormOpen(true)
              }}
              onDelete={async () => {
                await deleteStudent(selected.id)
              }}
              onDeleted={() => {
                setStudents((prev) => prev.filter((s) => s.id !== selected.id))
                setView('list')
                setSelectedId(null)
              }}
            />
          )}
        </AnimatePresence>
      </div>

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
        onSubmit={handleSave}
      />
    </main>
  )
}

export default App
