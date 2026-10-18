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
  confirmLabel = "O'chirish",
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
          className="btn-secondary flex-1"
        >
          Bekor qilish
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={busy}
          className="btn-danger flex-1"
        >
          {!busy && <TrashIcon />}
          {busy ? 'Kutilmoqda…' : confirmLabel}
        </button>
      </div>
    </Modal>
  )
}
