import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaWhatsapp, FaTimes } from 'react-icons/fa'
import { whatsappLink } from '../config/business'

export default function WhatsAppFloat() {
  const [showTooltip, setShowTooltip] = useState(true)

  // Auto show tooltip after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2.5">
      {/* Floating Interactive Speech Bubble / Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="relative hidden sm:flex items-center gap-2.5 rounded-2xl bg-white/95 px-4 py-2.5 text-xs text-navy-900 shadow-[0_8px_30px_rgb(0,0,0,0.15)] backdrop-blur border border-navy-100/80"
          >
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <div>
                <p className="font-bold text-navy-900">Need appliance repair?</p>
                <p className="text-[11px] text-navy-500">Chat with technician on WhatsApp</p>
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setShowTooltip(false)
              }}
              className="ml-1 text-navy-400 hover:text-navy-700 transition"
              aria-label="Close tooltip"
            >
              <FaTimes className="text-[10px]" />
            </button>

            {/* Little Triangle Pointer */}
            <div className="absolute -bottom-1.5 right-6 h-3 w-3 rotate-45 bg-white border-r border-b border-navy-100/80" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Floating Button */}
      <a
        href={whatsappLink()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="group relative flex items-center justify-center h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-gradient-to-tr from-[#128C7E] via-[#25D366] to-[#2bd86e] text-white shadow-[0_10px_25px_-4px_rgba(37,211,102,0.6)] transition-all duration-300 hover:scale-110 active:scale-95"
      >
        {/* Animated Radial Pulse Rings */}
        <span className="pointer-events-none absolute -inset-1.5 rounded-full bg-[#25D366]/35 animate-ping duration-1000" />
        <span className="pointer-events-none absolute -inset-3 rounded-full bg-[#25D366]/15 animate-pulse" />

        {/* 3D Glass Shine Layer */}
        <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white/30 to-transparent" />

        {/* WhatsApp Icon */}
        <FaWhatsapp className="relative z-10 text-3xl sm:text-4xl filter drop-shadow-md transition-transform duration-300 group-hover:rotate-12" />

        {/* Online Status Badge */}
        <span className="absolute top-0 right-0 z-20 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-400 border-2 border-white shadow-sm"></span>
        </span>
      </a>
    </div>
  )
}
