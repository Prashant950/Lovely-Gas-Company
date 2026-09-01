import { useMemo, useState } from 'react'
import {
  FaWhatsapp, FaHeadset, FaSearch, FaShieldAlt, FaClock, FaCheckCircle,
  FaWrench, FaBolt, FaPhoneAlt, FaChevronDown, FaTag,
} from 'react-icons/fa'
import PageHeader from '../components/PageHeader'
import ServiceCard from '../components/ServiceCard'
import SectionHeading from '../components/SectionHeading'
import { useGetServicesQuery } from '../features/services/servicesApiSlice'
import { whatsappLink, PHONE_DISPLAY, PHONE_TEL } from '../config/business'
import { useInquiry } from '../context/InquiryContext'

const commonIssues = [
  {
    category: 'Gas Stove & Chulha',
    icon: '🔥',
    issues: [
      'Low or flickering yellow flame (burner carbon clogging)',
      'Gas smell around pipe or burner connection (LPG leakage check)',
      'Automatic piezo/spark ignition button not working',
      'Stiff or broken gas control knobs & valves',
    ],
  },
  {
    category: 'Split & Window AC',
    icon: '❄️',
    issues: [
      'AC blowing normal air instead of cooling (Gas leakage / compressor trip)',
      'Water leaking from the indoor unit inside the room',
      'Foul smell or low airflow due to choked cooling coils',
      'PCB circuit failure, noisy outdoor fan motor, or error codes',
    ],
  },
  {
    category: 'RO Water Purifier',
    icon: '💧',
    issues: [
      'Water taste changed or high TDS output (Membrane expiry)',
      'Water not filling into tank or continuous waste water flow',
      'Booster pump vibration, buzzing noise, or power adapter failure',
      'Sediment and pre-carbon filter clogging',
    ],
  },
  {
    category: 'Fridge & Washing Machine',
    icon: '🧊',
    issues: [
      'Refrigerator freezer cooling but bottom compartment warm',
      'Excess ice buildup or continuous compressor humming',
      'Washing machine not spinning or vibrating violently during dry cycle',
      'Water not draining from washing machine or inlet valve error',
    ],
  },
]

export default function Services() {
  const { data: services = [], isLoading: loading } = useGetServicesQuery()
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [openIssue, setOpenIssue] = useState(0)
  const { openInquiry } = useInquiry()

  const categories = useMemo(() => {
    const set = new Set(services.map((s) => s.category).filter(Boolean))
    return ['All', ...Array.from(set)]
  }, [services])

  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      const matchCat = filter === 'All' || s.category === filter
      const q = search.toLowerCase().trim()
      const matchSearch =
        !q ||
        s.title?.toLowerCase().includes(q) ||
        s.shortDescription?.toLowerCase().includes(q) ||
        s.description?.toLowerCase().includes(q) ||
        s.category?.toLowerCase().includes(q)

      return matchCat && matchSearch
    })
  }, [services, filter, search])

  return (
    <div>
      <PageHeader
        title="Our Services & Repairs"
        crumb="Services"
        subtitle="Certified doorstep repair, maintenance, and genuine parts installation for every home appliance."
        image="/images/hero-gas-stove.jpg"
      />


      {/* ── Services Directory ── */}
      <section className="section">
        <div className="container-x">
          {/* Search & Category Filter Controls */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
            {/* Category pills */}
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  className={`rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition ${
                    filter === c
                      ? 'bg-navy-900 text-gold-400 shadow-card'
                      : 'bg-navy-50 text-navy-700 hover:bg-navy-100'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Live Search Input */}
            <div className="relative w-full md:w-72">
              <FaSearch className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search services (e.g. AC, Stove, RO)…"
                className="input !py-2 pl-10 text-xs sm:text-sm"
              />
            </div>
          </div>

          {/* Service Cards Grid */}
          {loading ? (
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="card overflow-hidden">
                  <div className="h-52 shimmer" />
                  <div className="space-y-3 p-6">
                    <div className="h-4 w-2/3 rounded shimmer" />
                    <div className="h-3 w-full rounded shimmer" />
                    <div className="h-3 w-4/5 rounded shimmer" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="card py-16 text-center">
              <FaWrench className="mx-auto text-4xl text-navy-200" />
              <h3 className="mt-3 font-display text-base font-bold text-navy-800">
                No matching service found
              </h3>
              <p className="mt-1 text-xs text-navy-400">
                Try different keywords or click below to request custom appliance assistance.
              </p>
              <button onClick={() => openInquiry()} className="btn btn-primary btn-sm mt-5">
                <FaHeadset /> Request Custom Service
              </button>
            </div>
          ) : (
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {filteredServices.map((s, i) => (
                <ServiceCard key={s._id || i} service={s} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Common Appliance Problems Solved ── */}
      <section className="section bg-navy-50/40">
        <div className="container-x max-w-5xl">
          <SectionHeading
            eyebrow="Common Issues We Fix"
            title="What's going wrong with your appliance?"
            subtitle="Here are the frequent repair requests we solve daily across Greater Noida West."
          />

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {commonIssues.map((item, idx) => (
              <div
                key={item.category}
                className="card p-6 border border-navy-100 bg-white"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-navy-50 text-xl">
                    {item.icon}
                  </span>
                  <h3 className="font-display text-base font-bold text-navy-900">
                    {item.category}
                  </h3>
                </div>

                <ul className="mt-4 space-y-2 text-xs leading-relaxed text-navy-600">
                  {item.issues.map((iss, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <FaCheckCircle className="mt-0.5 shrink-0 text-gold-500 text-xs" />
                      <span>{iss}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-5 pt-3 border-t border-navy-50 flex items-center justify-between">
                  <a
                    href={whatsappLink(item.category)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-gold-600 hover:text-gold-700"
                  >
                    <FaWhatsapp className="text-sm text-green-500" /> Book for {item.category} →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
