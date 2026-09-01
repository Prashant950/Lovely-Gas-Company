import { Link } from 'react-router-dom'
import {
  FaFireAlt, FaWhatsapp, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt,
  FaClock, FaFacebookF, FaInstagram, FaArrowRight,
} from 'react-icons/fa'
import { business, fullAddress, whatsappLink } from '../config/business'

const quickLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/services', label: 'Our Services' },
  { to: '/contact', label: 'Contact Us' },
]

const serviceLinks = [
  'Gas Stove Repair', 'AC Repair & Installation', 'Refrigerator Repair',
  'Geyser Service', 'RO / Water Purifier', 'Washing Machine Repair',
]

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-navy-100/80">
      <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/10 text-gold-400">
              <FaFireAlt className="text-xl" />
            </span>
            <span className="font-display text-lg font-extrabold text-white">
              Lovely Gas Company
            </span>
          </div>
          <p className="mt-4 text-sm leading-relaxed">
            Trusted doorstep repair & installation for gas stoves, AC, fridge,
            geyser, RO and all home appliances across Greater Noida West.
          </p>
          <div className="mt-5 flex gap-3">
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="grid h-10 w-10 place-items-center rounded-lg bg-white/10 text-white transition hover:bg-[#25D366]">
              <FaWhatsapp />
            </a>
            <a href="#" aria-label="Facebook"
              className="grid h-10 w-10 place-items-center rounded-lg bg-white/10 text-white transition hover:bg-gold-400 hover:text-navy-900">
              <FaFacebookF />
            </a>
            <a href="#" aria-label="Instagram"
              className="grid h-10 w-10 place-items-center rounded-lg bg-white/10 text-white transition hover:bg-gold-400 hover:text-navy-900">
              <FaInstagram />
            </a>
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="mb-4 font-display text-sm font-bold uppercase tracking-widest text-white">
            Quick Links
          </h4>
          <ul className="space-y-2.5 text-sm">
            {quickLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="group inline-flex items-center gap-2 transition hover:text-gold-400">
                  <FaArrowRight className="text-[10px] text-gold-400 opacity-0 transition group-hover:opacity-100" />
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div>
          <h4 className="mb-4 font-display text-sm font-bold uppercase tracking-widest text-white">
            Our Services
          </h4>
          <ul className="space-y-2.5 text-sm">
            {serviceLinks.map((s) => (
              <li key={s}>
                <Link to="/services" className="transition hover:text-gold-400">{s}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="mb-4 font-display text-sm font-bold uppercase tracking-widest text-white">
            Get in Touch
          </h4>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-3">
              <FaMapMarkerAlt className="mt-1 shrink-0 text-gold-400" />
              <span>{fullAddress}</span>
            </li>
            <li className="flex items-center gap-3">
              <FaPhoneAlt className="shrink-0 text-gold-400" />
              <a href={`tel:${business.phoneTel}`} className="hover:text-gold-400">{business.phoneDisplay}</a>
            </li>
            <li className="flex items-center gap-3">
              <FaEnvelope className="shrink-0 text-gold-400" />
              <a href={`mailto:${business.email}`} className="hover:text-gold-400">{business.email}</a>
            </li>
            <li className="flex items-center gap-3">
              <FaClock className="shrink-0 text-gold-400" />
              <span>{business.hours}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-5 text-xs text-navy-100/60 sm:flex-row">
          <p>© {new Date().getFullYear()} Nitecore Solutions Pvt Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
