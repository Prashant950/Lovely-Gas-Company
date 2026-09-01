import { useCallback, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaChevronLeft, FaChevronRight, FaHeadset, FaWrench } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { heroSlides } from '../config/business'
import { useInquiry } from '../context/InquiryContext'
import ImageWithFallback from './ImageWithFallback'

const AUTOPLAY_MS = 5500

export default function HeroCarousel() {
  const [index, setIndex] = useState(0)
  const { openInquiry } = useInquiry()
  const count = heroSlides.length

  // Preload all hero slide images for instant switching
  useEffect(() => {
    heroSlides.forEach((slide) => {
      const img = new Image()
      img.src = slide.image
    })
  }, [])

  const go = useCallback((dir) => setIndex((i) => (i + dir + count) % count), [count])
  const goTo = useCallback((i) => setIndex(i), [])

  // Autoplay
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS)
    return () => clearInterval(id)
  }, [count, index])

  const slide = heroSlides[index]

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-navy-900">
      {/* Background slides */}
      {heroSlides.map((s, i) => (
        <div
          key={s.image}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${i === index ? 'opacity-100 z-0' : 'opacity-0 -z-10 pointer-events-none'
            }`}
        >
          <img
            src={s.image}
            alt={s.title}
            loading={i === 0 ? 'eager' : 'lazy'}
            fetchPriority={i === 0 ? 'high' : 'auto'}
            className="h-full w-full object-cover scale-105 transition-transform duration-[6000ms] ease-out"
            style={{ transform: i === index ? 'scale(1)' : 'scale(1.08)' }}
          />
        </div>
      ))}

      {/* Soft & Elegant Navy-Blue Left-to-Right Scrim */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#00264d]/75 via-[#00264d]/30 via-45% to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#00264d]/25 via-transparent to-transparent" />

      {/* Content */}
      <div className="container-x relative z-10 pt-24 pb-16 sm:pt-28">
        <div className="max-w-2xl">
          <motion.span
            key={`eyebrow-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-gold-300 backdrop-blur"
          >
            ● Trusted since 2013 · Greater Noida West
          </motion.span>

          <AnimatePresence mode="wait">
            <motion.h1
              key={`title-${index}`}
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5 }}
              className="mt-5 font-display text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl"
            >
              {slide.title}
            </motion.h1>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.p
              key={`sub-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="mt-5 max-w-xl text-base leading-relaxed text-navy-100/90 sm:text-lg"
            >
              {slide.subtitle}
            </motion.p>
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <button onClick={() => openInquiry()} className="btn btn-gold">
              <FaHeadset /> Inquiry Now
            </button>
            <Link to="/services" className="btn btn-outline !border-white !text-white hover:!bg-white hover:!text-navy-900">
              <FaWrench /> Explore Services
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Arrows */}
      <button onClick={() => go(-1)} aria-label="Previous slide"
        className="absolute left-3 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/25 sm:grid">
        <FaChevronLeft />
      </button>
      <button onClick={() => go(1)} aria-label="Next slide"
        className="absolute right-3 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/25 sm:grid">
        <FaChevronRight />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2.5">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2.5 rounded-full transition-all duration-300 ${i === index ? 'w-8 bg-gold-400' : 'w-2.5 bg-white/50 hover:bg-white/80'
              }`}
          />
        ))}
      </div>
    </section>
  )
}
