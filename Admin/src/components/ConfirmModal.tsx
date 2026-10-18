import { TrashIcon } from './icons'
import { Modal } from './Modal'

type Props = {
  open: boolean
  title?: string
  message: string
  confirmLabel?: string
  busy?: boolean
  onClose: () => void
  onConfirm: () => void
}

export function ConfirmModal({
  open,
  title = 'Tasdiqlash',
  message,
  confirmLabel = 'O‘chirish',
  busy = false,
  onClose,
  onConfirm,
}: Props) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={() => {
        if (!busy) onClose()
      }}
    >
      <p className="text-sm text-slate-600">{message}</p>
      <div className="mt-5 flex gap-2">
        <button
          type="button"
          onClick={onClose}
          disabled={busy}
          className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          Bekor qilish
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={busy}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-500 disabled:opacity-50"
        >
          {!busy && <TrashIcon />}
          {busy ? 'Kutilmoqda…' : confirmLabel}
        </button>
      </div>
    </Modal>
  )
}
