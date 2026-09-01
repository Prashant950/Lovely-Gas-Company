import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FaCheckCircle, FaWhatsapp, FaHeadset, FaArrowRight, FaTools,
  FaClock, FaShieldAlt, FaRupeeSign, FaUserCheck, FaBolt, FaMedal,
  FaPhoneAlt, FaStar, FaChevronDown, FaQuoteLeft, FaMapMarkerAlt,
  FaWrench, FaCheck, FaExclamationTriangle,
} from 'react-icons/fa'
import HeroCarousel from '../components/HeroCarousel'
import StatsCounter from '../components/StatsCounter'
import SectionHeading from '../components/SectionHeading'
import ServiceCard from '../components/ServiceCard'
import Reveal from '../components/Reveal'
import ImageWithFallback from '../components/ImageWithFallback'
import { useGetServicesQuery } from '../features/services/servicesApiSlice'
import { whatsappLink, business, PHONE_DISPLAY, PHONE_TEL } from '../config/business'
import { useInquiry } from '../context/InquiryContext'

const highlights = [
  'Doorstep service across Greater Noida West within 30-60 mins',
  'Certified & background-verified technicians',
  '100% genuine OEM spare parts with warranty',
  'Transparent & upfront pricing — zero hidden charges',
]

const whyChoose = [
  {
    icon: FaClock,
    title: 'Rapid Doorstep Response',
    text: 'Our technicians are stationed locally across Greater Noida West for fast same-day arrival.',
  },
  {
    icon: FaShieldAlt,
    title: '90-Day Service Warranty',
    text: 'Complete peace of mind. Every repair and replacement part comes backed by warranty.',
  },
  {
    icon: FaUserCheck,
    title: 'Background-Verified Experts',
    text: 'Experienced, polite, and verified professionals with 10+ years of hands-on expertise.',
  },
  {
    icon: FaRupeeSign,
    title: 'Fair & Upfront Pricing',
    text: 'Clear quotes before work begins. No surprises, no hidden diagnostic fees with repair.',
  },
  {
    icon: FaBolt,
    title: 'All Appliance Brands',
    text: 'Gas stove, AC, fridge, geyser, RO purifier, washing machine, chimney & electronics.',
  },
  {
    icon: FaMedal,
    title: '12+ Years Local Trust',
    text: 'Serving 5,200+ homes with pride across Noida Extension and Greater Noida West since 2013.',
  },
]

const steps = [
  {
    num: '01',
    title: 'Book in 30 Seconds',
    desc: 'Choose your appliance and send a quick request on WhatsApp or via our online booking form.',
  },
  {
    num: '02',
    title: 'Doorstep Inspection',
    desc: 'Our certified technician visits your home on time, diagnoses the issue and provides upfront pricing.',
  },
  {
    num: '03',
    title: 'Fixed & Guaranteed',
    desc: 'The appliance is repaired using genuine parts, tested thoroughly, and issued a warranty card.',
  },
]

const testimonials = [
  {
    name: 'Vikram Rajput',
    loc: 'Gaur City 2, Greater Noida West',
    rating: 5,
    service: 'Gas Stove & Burner Repair',
    text: 'My gas stove had a dangerous gas leak and low flame. Lovely Gas Company technician arrived within 40 minutes, replaced the damaged pipe with genuine fitting and fixed both burners. Very polite and professional!',
  },
  {
    name: 'Anjali Srivastava',
    loc: 'Supertech Eco Village 1, Sector 16C',
    rating: 5,
    service: 'Split AC Gas Charging & Service',
    text: 'Booked AC gas refill and deep jet pump cleaning. The technician checked pressure gauges in front of me and cooling became instant like new. Honest pricing compared to other apps.',
  },
  {
    name: 'Rajat Choudhary',
    loc: 'Ace City, Noida Extension',
    rating: 5,
    service: 'RO Water Purifier Service',
    text: 'Prompt doorstep RO service. Replaced choked membrane and filters with authentic parts and tested TDS level right in front of us. Highly recommended in Greater Noida West.',
  },
]

const galleryItems = [
  {
    src: '/images/hero-gas-stove.jpg',
    title: 'Gas Stove Burner & Leak Repair',
    tag: 'Kitchen Care',
  },
  {
    src: '/images/hero-ac-service.jpg',
    title: 'Split AC Jet Pump Servicing',
    tag: 'Cooling',
  },
  {
    src: '/images/gallery-outdoor-ac.jpg',
    title: 'Outdoor AC Gas Charging & Pressure Test',
    tag: 'AC Specialist',
  },
  {
    src: '/images/service-ro.jpg',
    title: 'RO Membrane & TDS Filter Replacement',
    tag: 'Water Purifier',
  },
  {
    src: '/images/service-fridge.jpg',
    title: 'Double Door Refrigerator Repair',
    tag: 'Refrigeration',
  },
  {
    src: '/images/service-geyser.jpg',
    title: 'Water Heater & Geyser Element Service',
    tag: 'Heating',
  },
  {
    src: '/images/gallery-pcb-repair.jpg',
    title: 'Multimeter & Inverter PCB Circuit Diagnostics',
    tag: 'Electronics',
  },
  {
    src: '/images/service-microwave-electronics.jpg',
    title: 'Microwave Oven Magnetron & Chimney Repair',
    tag: 'Appliances',
  },
]

const faqs = [
  {
    q: 'How fast can your technician reach my doorstep in Greater Noida West?',
    a: 'We have technicians stationed locally across Greater Noida West (Sector 16C, Gaur City 1 & 2, Tigri, Chipiyana Khurd, Bisrakh). Most requests receive a doorstep visit within 30 to 60 minutes.',
  },
  {
    q: 'Do you provide a warranty on repairs and spare parts?',
    a: 'Yes, all our repair work and replacement spare parts carry a service warranty (up to 90 days depending on the component). If any issue recurs during the warranty period, we fix it free of charge.',
  },
  {
    q: 'Are your technicians background-verified and certified?',
    a: 'Absolutely. Every technician is fully trained, background-verified, and follows strict electrical and gas safety protocols while working at your home.',
  },
  {
    q: 'What if I need urgent help for a gas stove leak or AC breakdown?',
    a: 'We offer priority same-day response for urgent safety concerns such as gas leakage or complete appliance breakdown. You can tap the Emergency Call or WhatsApp button for immediate technician dispatch.',
  },
  {
    q: 'What are your inspection and visiting charges?',
    a: 'We maintain 100% transparent pricing. Our nominal visiting charge is fully adjusted/waived off once you approve the repair work.',
  },
]

export default function Home() {
  const { data: services = [], isLoading: loading } = useGetServicesQuery()
  const { openInquiry } = useInquiry()
  const [openFaq, setOpenFaq] = useState(0)

  return (
    <div>
      {/* ── 1. Hero Carousel ── */}
      <HeroCarousel />

      {/* ── 3. Intro / About ── */}
      <section className="section">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <Reveal className="relative">
            <div className="overflow-hidden rounded-3xl shadow-card border border-navy-100">
              <ImageWithFallback
                src="/images/technician-doorstep.jpg"
                seed="repair-person"
                alt="Lovely Gas Company Indian technician at customer doorstep"
                className="h-full w-full object-cover"
              />
            </div>
            {/* Floating experience badge */}
            <div className="absolute -bottom-6 -right-3 rounded-2xl bg-navy-gradient px-6 py-4 text-white shadow-card-hover sm:right-6 animate-float border border-gold-400/20">
              <p className="font-display text-3xl font-extrabold text-gold-400">12+</p>
              <p className="text-xs font-medium text-navy-100/80">Years of Experience</p>
            </div>
          </Reveal>

          <div>
            <span className="eyebrow">About Us</span>
            <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-navy-900">
              Reliable home appliance care, right at your doorstep
            </h2>
            <p className="mt-3 leading-relaxed text-sm sm:text-base text-navy-600">
              <strong>{business.name}</strong> is Greater Noida West’s most trusted local home-services team. From domestic gas stoves and commercial burners to split ACs, refrigerators, geysers, RO purifiers, and washing machines, we fix it all — safely, swiftly, and with genuine parts.
            </p>
            <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
              {highlights.map((h) => (
                <li key={h} className="flex items-start gap-2 text-xs sm:text-sm text-navy-700 font-medium">
                  <FaCheckCircle className="mt-0.5 shrink-0 text-gold-500" /> {h}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <button onClick={() => openInquiry()} className="btn btn-primary">
                <FaHeadset /> Book Doorstep Service
              </button>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
                <FaWhatsapp className="text-lg" /> WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. How It Works: 3-Step Seamless Process ── */}
      <section className="section bg-navy-50/50">
        <div className="container-x">
          <SectionHeading
            eyebrow="Simple Process"
            title="How our doorstep service works"
            subtitle="Get your faulty appliances fixed in three quick and easy steps."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {steps.map((step, idx) => (
              <div
                key={step.num}
                className="relative card card-hover p-8 group border border-navy-100 bg-white"
              >
                <span className="font-display text-4xl font-extrabold text-gold-400/80 group-hover:text-gold-500 transition">
                  {step.num}
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-navy-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-500">
                  {step.desc}
                </p>
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-navy-300 text-xl font-bold">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Animated counters ── */}
      <StatsCounter />

      {/* ── 6. Services preview (Live from DB via RTK Query) ── */}
      <section className="section bg-navy-50/30">
        <div className="container-x">
          <SectionHeading
            eyebrow="Our Services"
            title="What we repair & install"
            subtitle="Professional doorstep service for every major home appliance — backed by genuine parts & warranty."
          />
          <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="card overflow-hidden">
                    <div className="h-52 shimmer" />
                    <div className="space-y-3 p-6">
                      <div className="h-4 w-2/3 rounded shimmer" />
                      <div className="h-3 w-full rounded shimmer" />
                      <div className="h-3 w-4/5 rounded shimmer" />
                    </div>
                  </div>
                ))
              : services
                  .slice(0, 6)
                  .map((s, i) => <ServiceCard key={s._id || i} service={s} index={i} />)}
          </div>
          {!loading && services.length === 0 && (
            <p className="mt-10 text-center text-navy-400">
              Services will appear here once added from the admin panel.
            </p>
          )}
          <div className="mt-10 text-center">
            <Link to="/services" className="btn btn-primary">
              View All Services <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Why choose us ── */}
      <section className="section">
        <div className="container-x">
          <SectionHeading
            eyebrow="Why Choose Us"
            title="Service you can rely on every single time"
            subtitle="We combine certified technicians, genuine parts and honest pricing for total peace of mind."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {whyChoose.map((w, i) => (
              <Reveal
                key={w.title}
                delay={(i % 3) * 0.08}
                className="card card-hover group p-7 border border-navy-100"
              >
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-navy-gradient text-gold-400 transition-transform group-hover:scale-110">
                  <w.icon className="text-2xl" />
                </span>
                <h3 className="mt-5 font-display text-lg font-bold text-navy-900">{w.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-500">{w.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. Work gallery: Premium Bento Grid ("On the job, every day") ── */}
      <section className="section bg-navy-50/50">
        <div className="container-x">
          <SectionHeading
            eyebrow="Real Work Gallery"
            title="On the job, every day"
            subtitle="A glimpse of our verified technicians serving homes across Greater Noida West."
          />
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {galleryItems.map((item, i) => (
              <Reveal
                key={i}
                delay={(i % 4) * 0.06}
                className="group relative overflow-hidden rounded-2xl bg-navy-900 shadow-card border border-navy-100 h-64 cursor-pointer"
              >
                <ImageWithFallback
                  src={item.src}
                  seed={`gallery-bento-${i}`}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/30 to-transparent transition-opacity duration-300" />
                
                {/* Top category tag */}
                <span className="absolute top-3 left-3 rounded-md bg-white/90 px-2 py-0.5 text-[10px] font-bold text-navy-900 backdrop-blur shadow-xs">
                  {item.tag}
                </span>

                {/* Bottom Title & Verification badge */}
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-xs font-bold text-white leading-snug drop-shadow-sm">
                    {item.title}
                  </p>
                  <p className="mt-1 text-[10px] text-gold-400 flex items-center gap-1 font-medium">
                    <FaCheck className="text-[8px]" /> Verified Doorstep Service
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 10. Customer Testimonials & Reviews ── */}
      <section className="section">
        <div className="container-x">
          <SectionHeading
            eyebrow="Customer Reviews"
            title="Trusted by 5,200+ local families"
            subtitle="Read what residents across Gaur City, Sector 16C, and Greater Noida West have to say."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.map((t, idx) => (
              <Reveal
                key={t.name}
                delay={idx * 0.08}
                className="card card-hover p-7 flex flex-col justify-between border border-navy-100"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex text-gold-400 text-sm gap-1">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <FaStar key={i} />
                      ))}
                    </div>
                    <FaQuoteLeft className="text-navy-200 text-xl" />
                  </div>
                  <p className="mt-4 text-xs font-bold uppercase tracking-wider text-gold-600">
                    {t.service}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-navy-600 italic">
                    "{t.text}"
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-navy-50">
                  <h4 className="font-display text-sm font-bold text-navy-900">{t.name}</h4>
                  <p className="text-xs text-navy-400 flex items-center gap-1 mt-0.5">
                    <FaMapMarkerAlt className="text-gold-500 text-[10px]" /> {t.loc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 11. FAQ Accordion ── */}
      <section className="section bg-navy-50/40">
        <div className="container-x max-w-4xl">
          <SectionHeading
            eyebrow="Got Questions?"
            title="Frequently Asked Questions"
            subtitle="Everything you need to know about our home appliance repair and booking service."
          />
          <div className="mt-10 space-y-3.5">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-xs transition"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                  className="flex w-full items-center justify-between p-5 text-left font-display text-base font-bold text-navy-900 hover:text-gold-600 transition"
                >
                  <span>{faq.q}</span>
                  <FaChevronDown
                    className={`ml-3 shrink-0 text-xs text-navy-400 transition-transform duration-300 ${
                      openFaq === i ? 'rotate-180 text-gold-500' : ''
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-sm leading-relaxed text-navy-600 border-t border-navy-50 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 12. Final High-Converting CTA Band ── */}
      <section className="relative overflow-hidden bg-navy-gradient">
        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, #f5a623 0, transparent 40%)' }}
        />
        <div className="container-x relative flex flex-col items-center gap-6 py-16 text-center sm:py-20">
          <FaTools className="text-4xl text-gold-400" />
          <h2 className="max-w-2xl font-display text-3xl font-extrabold text-white sm:text-4xl">
            Appliance acting up? We can fix it today.
          </h2>
          <p className="max-w-xl text-navy-100/85">
            Book a certified technician in seconds — message us on WhatsApp or request a doorstep visit and our team will be on the way.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button onClick={() => openInquiry()} className="btn btn-gold font-bold shadow-lg">
              <FaHeadset /> Request Doorstep Visit
            </button>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp font-bold shadow-lg">
              <FaWhatsapp className="text-lg" /> WhatsApp Now
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
