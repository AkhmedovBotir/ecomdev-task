import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { DebtorsSection } from './components/DebtorsSection'
import { PaymentsSection } from './components/PaymentsSection'
import { StudentsSection } from './components/StudentsSection'

const tabs = [
  { id: 'debtors', label: 'Qarzdorlar' },
  { id: 'payments', label: "To'lovlar" },
  { id: 'students', label: "O'quvchilar" },
] as const

type TabId = (typeof tabs)[number]['id']

function App() {
  const [tab, setTab] = useState<TabId>('debtors')

  return (
    <div className="mx-auto min-h-screen max-w-2xl px-4 py-6 sm:px-6 sm:py-8">
      <header className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
          Admin
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          O‘quvchilar, to‘lovlar va qarzdorlar
        </p>
      </header>

      <nav
        className="mb-6 flex gap-1 rounded-xl border border-slate-200 bg-white p-1"
        aria-label="Bo‘limlar"
      >
        {tabs.map((t) => {
          const active = tab === t.id
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`flex-1 rounded-lg px-2 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {t.label}
            </button>
          )
        })}
      </nav>

      <AnimatePresence mode="wait">
        <motion.section
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5"
        >
          {tab === 'debtors' && <DebtorsSection />}
          {tab === 'payments' && <PaymentsSection />}
          {tab === 'students' && <StudentsSection />}
        </motion.section>
      </AnimatePresence>
    </div>
  )
}

export default App
