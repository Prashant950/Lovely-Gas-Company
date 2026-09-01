import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { FaWhatsapp, FaTimes } from 'react-icons/fa'
import { useCreateInquiryMutation } from '../features/inquiries/inquiriesApiSlice'
import { whatsappLink, business } from '../config/business'

const empty = { name: '', phone: '', email: '', serviceName: '', message: '' }

// Modal form for the "Inquiry Now" flow. Submits to the backend and also
// offers a one-tap WhatsApp handoff to the owner.
export default function InquiryModal({ open, onClose, prefillService = '' }) {
  const [form, setForm] = useState(empty)
  const [createInquiry, { isLoading: submitting }] = useCreateInquiryMutation()

  useEffect(() => {
    if (open) setForm({ ...empty, serviceName: prefillService })
  }, [open, prefillService])

  // Close on Escape + lock background scroll while the modal is open.
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

  const update = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error('Please enter your name and phone number.')
      return
    }
    try {
      await createInquiry({ ...form, source: 'inquiry-now' }).unwrap()
      toast.success("Thank you! We'll contact you shortly.")
      onClose()
    } catch (err) {
      toast.error(err?.data?.message || err.message || 'Could not send your inquiry.')
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-navy-900/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Send an inquiry"
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-card-hover"
            initial={{ scale: 0.92, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 22, stiffness: 260 }}
          >
            <div className="flex items-start justify-between bg-navy-gradient px-6 py-5 text-white">
              <div>
                <h3 className="text-lg font-bold">Send an Inquiry</h3>
                <p className="text-sm text-navy-100/80">
                  {business.shortName} · we reply fast
                </p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="rounded-lg p-2 text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={submit} className="space-y-4 px-6 py-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label" htmlFor="i-name">Full Name *</label>
                  <input id="i-name" name="name" value={form.name} onChange={update}
                    className="input" placeholder="Your name" />
                </div>
                <div>
                  <label className="label" htmlFor="i-phone">Phone *</label>
                  <input id="i-phone" name="phone" value={form.phone} onChange={update}
                    className="input" placeholder="Mobile number" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label" htmlFor="i-email">Email</label>
                  <input id="i-email" name="email" type="email" value={form.email}
                    onChange={update} className="input" placeholder="Optional" />
                </div>
                <div>
                  <label className="label" htmlFor="i-service">Service</label>
                  <input id="i-service" name="serviceName" value={form.serviceName}
                    onChange={update} className="input" placeholder="e.g. AC Repair" />
                </div>
              </div>
              <div>
                <label className="label" htmlFor="i-msg">Message</label>
                <textarea id="i-msg" name="message" value={form.message} onChange={update}
                  className="textarea" placeholder="Tell us about the issue…" />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button type="submit" disabled={submitting} className="btn btn-primary flex-1">
                  {submitting ? 'Sending…' : 'Submit Inquiry'}
                </button>
               
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
