import { useState } from 'react'
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom'
import {
  FaFireAlt, FaThLarge, FaTools, FaUsers, FaInbox,
  FaSignOutAlt, FaExternalLinkAlt, FaBars,
} from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'

const nav = [
  { to: '/admin', label: 'Dashboard', icon: FaThLarge, end: true },
  { to: '/admin/services', label: 'Services', icon: FaTools },
  { to: '/admin/users', label: 'Users', icon: FaUsers },
  { to: '/admin/inquiries', label: 'Inquiries', icon: FaInbox },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/admin/login', { replace: true })
  }

  const Sidebar = (
    <div className="flex h-full flex-col bg-navy-gradient p-5 text-white">
      <Link to="/admin" className="flex items-center gap-2.5 px-2">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/10 text-gold-400">
          <FaFireAlt className="text-xl" />
        </span>
        <span className="leading-tight">
          <span className="block font-display text-base font-extrabold">Lovely Gas</span>
          <span className="block text-[11px] text-navy-100/70">Admin Panel</span>
        </span>
      </Link>

      <nav className="mt-8 flex flex-1 flex-col gap-1.5">
        {nav.map((n) => (
          <NavLink key={n.to} to={n.to} end={n.end}
            onClick={() => setOpen(false)}
            className={({ isActive }) => `admin-link ${isActive ? 'active' : ''}`}>
            <n.icon className="text-base" /> {n.label}
          </NavLink>
        ))}
      </nav>

      <div className="space-y-1.5 border-t border-white/10 pt-4">
        <a href="/" target="_blank" rel="noopener noreferrer" className="admin-link">
          <FaExternalLinkAlt className="text-base" /> View Website
        </a>
        <button onClick={handleLogout} className="admin-link w-full text-left text-red-200 hover:bg-red-500/20 hover:text-white">
          <FaSignOutAlt className="text-base" /> Logout
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-navy-50/50">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 lg:block">{Sidebar}</aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-navy-900/60" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-64">{Sidebar}</div>
        </div>
      )}

      {/* Main */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-navy-100 bg-white/90 px-4 backdrop-blur sm:px-6">
          <button onClick={() => setOpen(true)} className="grid h-10 w-10 place-items-center rounded-lg text-navy-800 hover:bg-navy-50 lg:hidden" aria-label="Open menu">
            <FaBars />
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-navy-900">{user?.name}</p>
              <p className="text-xs text-navy-400">Administrator</p>
            </div>
            <span className="grid h-10 w-10 place-items-center rounded-full bg-navy-gradient font-display font-bold text-gold-400">
              {user?.name?.charAt(0)?.toUpperCase() || 'A'}
            </span>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
