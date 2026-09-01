import { FaExclamationTriangle } from 'react-icons/fa'
import Modal from './Modal'

// Confirmation dialog for destructive actions (delete, etc.).
export default function ConfirmDialog({
  open, onCancel, onConfirm, loading = false,
  title = 'Are you sure?', message = 'This action cannot be undone.',
  confirmText = 'Delete',
}) {
  return (
    <Modal open={open} onClose={onCancel} title={title} maxWidth="max-w-md">
      <div className="flex gap-4">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-red-50 text-red-500">
          <FaExclamationTriangle className="text-xl" />
        </span>
        <p className="pt-1 text-sm leading-relaxed text-navy-600">{message}</p>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <button onClick={onCancel} className="btn btn-ghost">Cancel</button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="btn bg-red-600 text-white hover:bg-red-700 hover:-translate-y-0.5"
        >
          {loading ? 'Please wait…' : confirmText}
        </button>
      </div>
    </Modal>
  )
}
