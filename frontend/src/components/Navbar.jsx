import { useEffect, useState, useRef } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaFireAlt, FaBars, FaTimes, FaHeadset, FaUser, FaSignOutAlt,
  FaShieldAlt, FaChevronDown, FaThLarge, FaHome, FaInfoCircle,
  FaTools, FaPhoneAlt, FaWhatsapp
} from 'react-icons/fa'
import { business, whatsappLink, PHONE_DISPLAY, PHONE_TEL } from '../config/business'
import { useInquiry } from '../context/InquiryContext'
import { useAuth } from '../context/AuthContext'

const links = [
  { to: '/', label: 'Home', icon: FaHome, end: true },
  { to: '/about', label: 'About Us', icon: FaInfoCircle },
  { to: '/services', label: 'Our Services', icon: FaTools },
  { to: '/contact', label: 'Contact Us', icon: FaPhoneAlt },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  const { pathname } = useLocation()
  const { openInquiry } = useInquiry()
  const { user, isAuthenticated, isAdmin, logout } = useAuth()

  const isHome = pathname === '/'
  const transparent = isHome && !scrolled

  // Track scroll for the transparent-over-hero effect.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [pathname])

  // Close menus on route change
  useEffect(() => {
    setMenuOpen(false)
    setProfileDropdownOpen(false)
  }, [pathname])

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const shellClass = transparent
    ? 'bg-transparent'
    : 'bg-white/95 shadow-[0_6px_24px_-12px_rgba(0,38,77,0.35)] backdrop-blur'
  const textClass = transparent ? 'text-white' : 'text-navy-900'

  const dashboardPath = isAdmin ? '/admin' : '/user'

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${shellClass}`}>
        <nav className="container-x flex h-16 items-center justify-between sm:h-20">
          {/* Brand (left) */}
          <Link to="/" className="group flex items-center gap-2.5">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-navy-gradient text-gold-400 shadow-card transition-transform group-hover:scale-105">
              <FaFireAlt className="text-xl" />
            </span>
            <span className="leading-tight">
              <span className={`block font-display text-base font-extrabold sm:text-lg ${textClass}`}>
                Lovely Gas Company
              </span>
              <span className={`block text-[11px] font-medium ${transparent ? 'text-gold-300' : 'text-navy-400'}`}>
                & Home Service Provider
              </span>
            </span>
          </Link>

          {/* Links (center - Desktop) */}
          <div className="hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''} ${
                    transparent ? '!text-white/90 hover:!text-white' : ''
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>

          {/* Actions (right) */}
          <div className="flex items-center gap-2.5">
            {/* Authenticated Person Icon Dropdown - Desktop */}
            {isAuthenticated ? (
              <div className="relative hidden sm:block" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen((prev) => !prev)}
                  className={`flex items-center gap-2 rounded-full py-1.5 pl-2 pr-3 text-xs font-bold transition shadow-sm ${
                    transparent
                      ? 'bg-white/15 text-white hover:bg-white/25 border border-white/20'
                      : 'bg-navy-50 text-navy-800 hover:bg-navy-100 border border-navy-200/60'
                  }`}
                >
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-navy-900 text-gold-400 text-xs shadow-sm">
                    {isAdmin ? <FaShieldAlt /> : <FaUser />}
                  </span>
                  <span>{user?.name?.split(' ')[0] || 'My Account'}</span>
                  <FaChevronDown className={`text-[10px] transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Profile Dropdown Menu */}
                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-64 origin-top-right overflow-hidden rounded-2xl bg-white shadow-card-hover border border-navy-100 z-50"
                    >
                      {/* User Header */}
                      <div className="bg-navy-gradient p-4 text-white">
                        <div className="flex items-center gap-3">
                          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10 text-gold-400 font-bold text-sm">
                            {user?.name ? user.name[0].toUpperCase() : 'U'}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-display font-bold text-sm text-white">{user?.name}</p>
                            <p className="truncate text-xs text-navy-100/75">{user?.email}</p>
                          </div>
                        </div>
                        <div className="mt-2.5">
                          <span className="inline-flex items-center gap-1 rounded-md bg-gold-400/20 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-gold-300">
                            {isAdmin ? '👑 Administrator' : '👤 Customer Account'}
                          </span>
                        </div>
                      </div>

                      {/* Navigation Options */}
                      <div className="p-2 space-y-1 text-sm text-navy-700">
                        <Link
                          to={dashboardPath}
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold hover:bg-navy-50 transition"
                        >
                          <FaThLarge className="text-navy-400" />
                          <span>{isAdmin ? 'Admin Dashboard' : 'Customer Dashboard'}</span>
                        </Link>

                        <div className="border-t border-navy-100 my-1 pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              setProfileDropdownOpen(false)
                              logout()
                            }}
                            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition"
                          >
                            <FaSignOutAlt />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className={`hidden sm:inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition ${
                  transparent
                    ? 'border border-white/40 text-white hover:bg-white/20'
                    : 'border border-navy-200 text-navy-800 hover:bg-navy-50'
                }`}
              >
                <FaUser className="text-xs text-gold-400" /> Sign In
              </Link>
            )}

            <button onClick={() => openInquiry()} className="btn btn-gold btn-sm hidden sm:inline-flex shadow-sm">
              <FaHeadset /> Inquiry Now
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open mobile navigation menu"
              className={`grid h-10 w-10 place-items-center rounded-xl lg:hidden transition ${
                transparent ? 'text-white hover:bg-white/10' : 'text-navy-800 hover:bg-navy-50'
              }`}
            >
              <FaBars className="text-xl" />
            </button>
          </div>
        </nav>
      </header>

      {/* ── Sleek Mobile Off-Canvas Side Drawer ── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Dark Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-[70] bg-navy-950/70 backdrop-blur-sm lg:hidden"
            />

            {/* Side Drawer Container */}
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 260 }}
              className="fixed inset-y-0 right-0 z-[80] flex w-[85%] max-w-sm flex-col justify-between overflow-hidden bg-white shadow-2xl lg:hidden"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-navy-100 bg-navy-900 px-5 py-4 text-white">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-gold-400 text-navy-950 font-bold text-base shadow-sm">
                    <FaFireAlt />
                  </span>
                  <div>
                    <h3 className="font-display text-sm font-bold text-white leading-tight">
                      Lovely Gas Company
                    </h3>
                    <p className="text-[10px] text-gold-300">Home Service Provider</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                  className="grid h-8 w-8 place-items-center rounded-xl bg-white/10 text-white transition hover:bg-white/20"
                >
                  <FaTimes className="text-sm" />
                </button>
              </div>

              {/* Drawer Scrollable Content */}
              <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6 overscroll-contain">
                {/* User Status Card (If Logged In) */}
                {isAuthenticated && (
                  <div className="rounded-2xl bg-navy-50/80 p-3.5 border border-navy-100 flex items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-navy-900 text-gold-400 font-bold text-xs shadow-sm">
                        {user?.name ? user.name[0].toUpperCase() : 'U'}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-display font-bold text-xs text-navy-900 leading-tight">
                          {user?.name}
                        </p>
                        <span className="inline-block text-[10px] font-semibold text-navy-500">
                          {isAdmin ? '👑 Administrator' : '👤 Customer'}
                        </span>
                      </div>
                    </div>
                    <Link
                      to={dashboardPath}
                      onClick={() => setMenuOpen(false)}
                      className="shrink-0 rounded-xl bg-navy-900 px-2.5 py-1.5 text-[11px] font-bold text-gold-400 shadow-sm transition hover:bg-navy-800"
                    >
                      Dashboard →
                    </Link>
                  </div>
                )}

                {/* Main Navigation Links */}
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-navy-400 px-2 mb-2">
                    Menu Navigation
                  </p>
                  <div className="space-y-1">
                    {links.map((l) => (
                      <NavLink
                        key={l.to}
                        to={l.to}
                        end={l.end}
                        onClick={() => setMenuOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                            isActive
                              ? 'bg-navy-900 text-gold-400 shadow-sm'
                              : 'text-navy-700 hover:bg-navy-50'
                          }`
                        }
                      >
                        <l.icon className="text-base" />
                        <span>{l.label}</span>
                      </NavLink>
                    ))}
                  </div>
                </div>

                {/* Account & Action Buttons */}
                <div className="space-y-3 pt-3 border-t border-navy-100">
                  {/* Primary Gold CTA */}
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false)
                      openInquiry()
                    }}
                    className="btn btn-gold w-full justify-center font-bold shadow-sm py-3"
                  >
                    <FaHeadset /> Book Doorstep Service
                  </button>

                  {/* Secondary Account Actions */}
                  {isAuthenticated ? (
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        to={dashboardPath}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center justify-center gap-1.5 rounded-xl bg-navy-900 py-2.5 px-2 text-xs font-bold text-white shadow-xs transition hover:bg-navy-800"
                      >
                        <FaThLarge className="text-gold-400 text-[11px]" />
                        <span>Dashboard</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          setMenuOpen(false)
                          logout()
                        }}
                        className="flex items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-red-50/70 py-2.5 px-2 text-xs font-bold text-red-600 transition hover:bg-red-100"
                      >
                        <FaSignOutAlt className="text-[11px]" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-navy-200 bg-navy-50 py-2.5 text-xs font-bold text-navy-800 shadow-xs transition hover:bg-navy-100"
                    >
                      <FaUser className="text-gold-500 text-[11px]" />
                      <span>Sign In / Account</span>
                    </Link>
                  )}
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
