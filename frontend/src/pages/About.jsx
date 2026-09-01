import {
  FaCheckCircle, FaBullseye, FaEye, FaHandshake, FaWhatsapp, FaHeadset,
  FaShieldAlt, FaTools, FaUserCheck, FaAward, FaMapMarkerAlt, FaFileInvoice,
  FaPhoneAlt,
} from 'react-icons/fa'
import PageHeader from '../components/PageHeader'
import SectionHeading from '../components/SectionHeading'
import StatsCounter from '../components/StatsCounter'
import Reveal from '../components/Reveal'
import ImageWithFallback from '../components/ImageWithFallback'
import { business, whatsappLink, fullAddress, PHONE_DISPLAY, PHONE_TEL } from '../config/business'
import { useInquiry } from '../context/InquiryContext'

const points = [
  'Over 12 years of dedicated service in Greater Noida West & Noida Extension',
  'Certified technicians trained across all Indian & International appliance brands',
  '100% Genuine OEM spare parts with official repair warranty',
  'Transparent, fixed pricing schedule with zero hidden charges',
  'Fast doorstep arrival within 30 to 60 minutes across all local sectors',
  'Strict electrical & LPG safety testing after every repair',
]

const values = [
  {
    icon: FaBullseye,
    title: 'Our Mission',
    text: 'To deliver dependable, safe, and honest home appliance repair to every household — ensuring appliances work smoothly without expensive replacements.',
  },
  {
    icon: FaEye,
    title: 'Our Vision',
    text: 'To remain Greater Noida West’s most trusted household name in appliance engineering, known for unparalleled punctuality, skill, and genuine customer care.',
  },
  {
    icon: FaHandshake,
    title: 'Our Promise',
    text: 'Transparent quotes before starting, polite background-verified technicians, and a solid 90-day warranty on all repairs and parts.',
  },
]

const safetyProtocols = [
  {
    icon: FaUserCheck,
    title: 'Background-Verified Staff',
    text: 'All technicians undergo thorough police and background verification before joining our doorstep team.',
  },
  {
    icon: FaShieldAlt,
    title: 'Digital Gas Leak Detection',
    text: 'We use professional pressure gauges and electronic leak detectors for 100% kitchen safety.',
  },
  {
    icon: FaTools,
    title: 'Sealed OEM Spares Only',
    text: 'Every replacement pipe, burner, compressor, capacitor or valve is sealed and genuine.',
  },
  {
    icon: FaAward,
    title: 'Post-Repair Function Testing',
    text: 'We never leave until the appliance is tested under full operating load and approved by you.',
  },
  {
    icon: FaFileInvoice,
    title: 'Warranty & Digital Receipt',
    text: 'Instant digital invoice and service warranty card sent directly to your phone/email.',
  },
  {
    icon: FaPhoneAlt,
    title: 'Dedicated Customer Support',
    text: 'Direct phone & WhatsApp hotline active 7 days a week from 8:00 AM to 9:00 PM.',
  },
]

const coverageAreas = [
  'Greater Noida West (Noida Extension)',
  'Gaur City 1 & Gaur City 2',
  'Sector 16C & Sector 1',
  'Chipiyana Khurd Urf Tigri',
  'Dudheshwar Colony & Enclave',
  'Crossing Republik & NH-24',
  'Supertech Eco Village 1, 2 & 3',
  'Ace City & Cherry County',
  'Bisrakh & Taj Highway Area',
  'Panchsheel Greens & Arihant Arden',
]

export default function About() {
  const { openInquiry } = useInquiry()

  return (
    <div>
      <PageHeader
        title="About Us"
        crumb="About Us"
        subtitle={`${business.name} — your neighbourhood experts for gas, cooling, water and home appliance engineering.`}
        image="/images/hero-ac-service.jpg"
      />

      {/* ── Story ── */}
      <section className="section">
        <div className="container-x grid items-center gap-8 lg:grid-cols-2">
          <Reveal className="order-2 lg:order-1">
            <span className="eyebrow">Our Journey & Heritage</span>
            <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-navy-900">
              12+ years of honest craft & local trust
            </h2>
            <p className="mt-3 leading-relaxed text-sm sm:text-base text-navy-600">
              Established in 2013, <strong>{business.name}</strong> started with a clear commitment: appliance repair should be transparent, punctual, and safe. What began as a dedicated gas stove and burner repair shop in Greater Noida has grown into the region’s premier multi-appliance doorstep service network.
            </p>
            <p className="mt-2.5 leading-relaxed text-sm sm:text-base text-navy-600">
              Today, our certified engineers service split & window ACs, double-door refrigerators, RO purifiers, water heaters, automatic washing machines, chimneys, and micro-electronics across thousands of residential apartments and societies.
            </p>
            <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
              {points.map((p) => (
                <li key={p} className="flex items-start gap-2 text-xs sm:text-sm text-navy-700 font-medium">
                  <FaCheckCircle className="mt-0.5 shrink-0 text-gold-500" /> {p}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1} className="order-1 lg:order-2">
            <div className="overflow-hidden rounded-3xl shadow-card border border-navy-100 relative">
              <ImageWithFallback
                src="/images/technician-doorstep.jpg"
                seed="about-team"
                alt="Lovely Gas Company Indian technician team at work"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <p className="font-display text-lg sm:text-xl font-bold text-gold-400">Certified Technicians</p>
                <p className="text-xs text-navy-100/90">Always punctual, equipped with genuine parts and safety gear.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Stats Counter ── */}
      <StatsCounter />

      {/* ── Safety & Quality Standards ── */}
      <section className="section bg-navy-50/40">
        <div className="container-x">
          <SectionHeading
            eyebrow="Safety & Quality Protocols"
            title="How we guarantee 100% peace of mind"
            subtitle="Every doorstep visit adheres to our strict 6-point safety and service benchmark."
          />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {safetyProtocols.map((sp, i) => (
              <Reveal
                key={sp.title}
                delay={i * 0.05}
                className="card card-hover p-6 border border-navy-100 bg-white"
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-navy-gradient text-gold-400">
                  <sp.icon className="text-lg" />
                </span>
                <h3 className="mt-3 font-display text-sm sm:text-base font-bold text-navy-900">{sp.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-navy-500">{sp.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="section">
        <div className="container-x">
          <SectionHeading
            eyebrow="What Drives Us"
            title="Our mission, vision & promise"
          />
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.06} className="card card-hover group p-6 text-center border border-navy-100">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-navy-gradient text-gold-400 transition-transform group-hover:scale-110">
                  <v.icon className="text-xl" />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-navy-900">{v.title}</h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-navy-500">{v.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Service Coverage Areas ── */}
      <section className="section bg-navy-900 text-white">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-gold-400">Coverage Area</span>
            <h2 className="mt-1.5 text-xl sm:text-2xl lg:text-3xl font-bold font-display">
              Serving every corner of Greater Noida West
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-navy-200">
              Our mobile technicians are stationed across key junctions for rapid doorstep arrival.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {coverageAreas.map((area) => (
              <div
                key={area}
                className="flex items-center gap-2 rounded-xl bg-white/10 p-2.5 text-xs font-medium text-white backdrop-blur border border-white/10 transition hover:bg-gold-400 hover:text-navy-950"
              >
                <FaMapMarkerAlt className="shrink-0 text-gold-400 group-hover:text-navy-950" />
                <span>{area}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Location + CTA ── */}
      <section className="bg-navy-50/50 py-10">
        <div className="container-x flex flex-col items-center gap-4 text-center">
          <h2 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-navy-900">
            Need doorstep appliance repair today?
          </h2>
          <p className="max-w-xl text-navy-500 text-xs sm:text-sm">{fullAddress}</p>
          <div className="flex flex-wrap justify-center gap-3 pt-1">
            <button onClick={() => openInquiry()} className="btn btn-primary shadow-md">
              <FaHeadset /> Book Doorstep Service
            </button>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp shadow-md">
              <FaWhatsapp className="text-lg" /> WhatsApp Us Now
            </a>
            <a href={`tel:${PHONE_TEL}`} className="btn btn-outline shadow-xs">
              <FaPhoneAlt /> Call {PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
