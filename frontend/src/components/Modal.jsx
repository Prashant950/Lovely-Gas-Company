import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes } from 'react-icons/fa'

// Generic responsive modal shell used across admin & user panels
export default function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-3xl',
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-navy-900/75 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Card */}
          <motion.div
            role="dialog"
            aria-modal="true"
            className={`relative z-10 flex flex-col w-full ${maxWidth} max-h-[92vh] sm:max-h-[88vh] overflow-hidden rounded-3xl bg-white shadow-card-hover border border-navy-100`}
            initial={{ scale: 0.94, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ type: 'spring', damping: 24, stiffness: 260 }}
          >
            {/* Header (Sticky) */}
            <div className="shrink-0 flex items-start justify-between border-b border-navy-100 bg-white px-5 py-4 sm:px-7 sm:py-5">
              <div>
                <h3 className="font-display text-lg sm:text-xl font-bold text-navy-900">
                  {title}
                </h3>
                {subtitle && (
                  <p className="mt-0.5 text-xs sm:text-sm text-navy-500">
                    {subtitle}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                aria-label="Close modal"
                className="grid h-9 w-9 place-items-center rounded-xl text-navy-400 transition hover:bg-navy-50 hover:text-navy-700"
              >
                <FaTimes className="text-base" />
              </button>
            </div>

            {/* Scrollable Body with clean bottom clearance */}
            <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6 overscroll-contain">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
