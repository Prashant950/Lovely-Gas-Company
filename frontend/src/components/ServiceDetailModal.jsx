import { motion, AnimatePresence } from 'framer-motion'
import {
  FaTimes, FaWhatsapp, FaHeadset, FaCheckCircle,
  FaShieldAlt, FaClock, FaTools, FaMapMarkerAlt
} from 'react-icons/fa'
import ImageWithFallback from './ImageWithFallback'
import { whatsappLink, business } from '../config/business'
import { useInquiry } from '../context/InquiryContext'

export default function ServiceDetailModal({ service, open, onClose }) {
  const { openInquiry } = useInquiry()

  if (!service) return null

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-navy-900/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            role="dialog"
            aria-modal="true"
            className="relative z-10 flex flex-col w-full max-w-2xl max-h-[92vh] sm:max-h-[88vh] overflow-hidden rounded-3xl bg-white shadow-card-hover border border-navy-100"
            initial={{ scale: 0.94, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ type: 'spring', damping: 24, stiffness: 260 }}
          >
            {/* Header Image & Close button */}
            <div className="relative h-56 sm:h-64 w-full shrink-0 overflow-hidden bg-navy-900">
              <ImageWithFallback
                src={service.imageUrl}
                seed={service.slug || service.title}
                alt={service.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-navy-900/40 to-transparent" />

              {/* Close Button */}
              <button
                onClick={onClose}
                aria-label="Close"
                className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-navy-900/70 text-white backdrop-blur transition hover:bg-navy-900"
              >
                <FaTimes />
              </button>

              {/* Badges and Icon */}
              <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
                <div>
                  {service.category && (
                    <span className="inline-flex items-center rounded-md bg-gold-400 px-2.5 py-0.5 text-xs font-bold text-navy-900 shadow-sm">
                      {service.category}
                    </span>
                  )}
                  <h2 className="mt-2 font-display text-xl sm:text-2xl font-bold text-white drop-shadow-sm">
                    {service.title}
                  </h2>
                </div>
                {service.icon && (
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/95 text-2xl shadow-lg backdrop-blur">
                    {service.icon}
                  </span>
                )}
              </div>
            </div>

            {/* Scrollable Details Body */}
            <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6 space-y-6 overscroll-contain">
              {/* Short summary */}
              {service.shortDescription && (
                <div className="rounded-2xl bg-navy-50/70 p-4 border border-navy-100">
                  <p className="text-sm font-semibold text-navy-800 leading-relaxed">
                    {service.shortDescription}
                  </p>
                </div>
              )}

              {/* Full Detailed Description */}
              <div>
                <h3 className="font-display text-sm font-bold uppercase tracking-wider text-navy-400">
                  Detailed Service Overview
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-600 whitespace-pre-line">
                  {service.description || service.shortDescription || 'Professional doorstep service with genuine parts and full testing.'}
                </p>
              </div>

              {/* Features List */}
              {Array.isArray(service.features) && service.features.length > 0 && (
                <div>
                  <h3 className="font-display text-sm font-bold uppercase tracking-wider text-navy-400">
                    What's Included & Highlights
                  </h3>
                  <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                    {service.features.map((feat, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2.5 rounded-xl border border-navy-100 bg-white p-3 text-xs shadow-xs"
                      >
                        <FaCheckCircle className="mt-0.5 shrink-0 text-gold-500 text-sm" />
                        <span className="font-medium text-navy-800">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
