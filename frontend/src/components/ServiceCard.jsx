import { useState } from 'react'
import { FaWhatsapp, FaHeadset, FaInfoCircle, FaArrowRight } from 'react-icons/fa'
import { motion } from 'framer-motion'
import ImageWithFallback from './ImageWithFallback'
import ServiceDetailModal from './ServiceDetailModal'
import { whatsappLink } from '../config/business'
import { useInquiry } from '../context/InquiryContext'

/**
 * Service card with interactive "View Details" modal and direct WhatsApp / Inquiry actions.
 */
export default function ServiceCard({ service, index = 0 }) {
  const [detailOpen, setDetailOpen] = useState(false)
  const { openInquiry } = useInquiry()
  const desc = service.shortDescription || service.description || ''

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
        className="card card-hover group flex flex-col overflow-hidden"
      >
        {/* Image - Clickable to open details */}
        <div
          onClick={() => setDetailOpen(true)}
          className="relative h-52 overflow-hidden cursor-pointer"
        >
          <ImageWithFallback
            src={service.imageUrl}
            seed={service.slug || service.title}
            alt={service.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 to-transparent" />
          
          {service.category && (
            <span className="badge absolute left-3 top-3 bg-white/95 text-navy-800 shadow">
              {service.category}
            </span>
          )}
          
          {service.icon && (
            <span className="absolute -bottom-6 right-4 grid h-14 w-14 place-items-center rounded-2xl bg-white text-2xl shadow-card ring-1 ring-navy-100">
              {service.icon}
            </span>
          )}

          {/* Quick hover badge */}
          <div className="absolute inset-0 grid place-items-center bg-navy-900/40 opacity-0 transition-opacity group-hover:opacity-100">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-navy-900 shadow">
              <FaInfoCircle className="text-gold-500" /> View Full Details
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col p-6 pt-7">
          <h3
            onClick={() => setDetailOpen(true)}
            className="font-display text-lg font-bold text-navy-900 cursor-pointer transition-colors hover:text-gold-600"
          >
            {service.title}
          </h3>

          <p className="mt-2 flex-1 text-sm leading-relaxed text-navy-500 line-clamp-3">
            {desc}
          </p>

          {/* Feature chips */}
          {Array.isArray(service.features) && service.features.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {service.features.slice(0, 3).map((f) => (
                <li key={f} className="rounded-md bg-navy-50 px-2 py-1 text-[11px] font-medium text-navy-600">
                  {f}
                </li>
              ))}
              {service.features.length > 3 && (
                <li
                  onClick={() => setDetailOpen(true)}
                  className="rounded-md bg-gold-50 px-2 py-1 text-[11px] font-bold text-gold-700 cursor-pointer hover:underline"
                >
                  +{service.features.length - 3} more
                </li>
              )}
            </ul>
          )}

          {/* "View Details" text link */}
          <div className="mt-4 pt-3 border-t border-navy-50 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setDetailOpen(true)}
              className="inline-flex items-center gap-1 text-xs font-bold text-gold-600 hover:text-gold-700 transition"
            >
              View Full Details <FaArrowRight className="text-[10px]" />
            </button>
          </div>

          {/* Actions */}
          <div className="mt-3 flex gap-2">
            <a
              href={whatsappLink(service.title)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp btn-sm flex-1 text-xs shadow-xs"
            >
              <FaWhatsapp className="text-base" /> WhatsApp
            </a>
          </div>
        </div>
      </motion.article>

      {/* Full Details Modal Popup */}
      <ServiceDetailModal
        service={service}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
      />
    </>
  )
}
