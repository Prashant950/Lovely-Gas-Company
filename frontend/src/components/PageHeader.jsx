import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaChevronRight } from 'react-icons/fa'

/**
 * Reusable page banner for interior pages. Includes top padding so content
 * clears the fixed navbar.
 */
export default function PageHeader({ title, subtitle, crumb, image }) {
  return (
    <section className="relative overflow-hidden bg-navy-gradient pt-24 pb-8 sm:pt-28 sm:pb-10">
      {image && (
        <div className="absolute inset-0">
          <img src={image} alt="" className="h-full w-full object-cover opacity-20" />
        </div>
      )}
      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'radial-gradient(circle at 15% 20%, #f5a623 0, transparent 35%), radial-gradient(circle at 85% 90%, #f5a623 0, transparent 35%)',
        }}
      />
      <div className="container-x relative text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-display text-4xl font-extrabold text-white sm:text-5xl"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto mt-4 max-w-2xl text-base text-navy-100/85"
          >
            {subtitle}
          </motion.p>
        )}
        <nav className="mt-6 flex items-center justify-center gap-2 text-sm text-navy-100/70">
          <Link to="/" className="transition hover:text-gold-400">Home</Link>
          <FaChevronRight className="text-[10px] text-gold-400" />
          <span className="font-semibold text-white">{crumb || title}</span>
        </nav>
      </div>
    </section>
  )
}
