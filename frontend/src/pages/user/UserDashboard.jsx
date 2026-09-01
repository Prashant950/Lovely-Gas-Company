import { Link } from 'react-router-dom'
import {
  FaClipboardList, FaClock, FaCheckCircle, FaTools, FaWhatsapp,
  FaPlusCircle, FaArrowRight, FaHeadset, FaUserEdit, FaExclamationTriangle
} from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'
import { useGetMyInquiriesQuery } from '../../features/inquiries/inquiriesApiSlice'
import { whatsappLink, business } from '../../config/business'
import Reveal from '../../components/Reveal'

export default function UserDashboard() {
  const { user } = useAuth()
  const { data: inquiries = [], isLoading: loading } = useGetMyInquiriesQuery()

  const pending = inquiries.filter((i) => i.status === 'new' || i.status === 'contacted').length
  const inProgress = inquiries.filter((i) => i.status === 'in-progress').length
  const resolved = inquiries.filter((i) => i.status === 'resolved').length

  const stats = [
    { label: 'Total Inquiries', value: inquiries.length, icon: FaClipboardList, color: 'text-navy-700', bg: 'bg-navy-50' },
    { label: 'Pending / Contacted', value: pending, icon: FaClock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'In Progress', value: inProgress, icon: FaTools, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Resolved / Completed', value: resolved, icon: FaCheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ]

  const statusBadge = (st) => {
    switch (st) {
      case 'resolved':
        return <span className="badge badge-resolved">Resolved</span>
      case 'in-progress':
        return <span className="badge bg-blue-100 text-blue-800">In Progress</span>
      case 'contacted':
        return <span className="badge badge-contacted">Contacted</span>
      case 'cancelled':
        return <span className="badge bg-red-100 text-red-700">Cancelled</span>
      default:
        return <span className="badge badge-new">New</span>
    }
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-navy-gradient p-6 text-white shadow-card sm:p-8">
        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, #f5a623 0, transparent 40%)' }}
        />
        <div className="relative z-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-gold-300 backdrop-blur">
              ● Customer Portal
            </span>
            <h1 className="mt-3 font-display text-2xl font-extrabold sm:text-3xl">
              Hello, {user?.name}!
            </h1>
            <p className="mt-2 text-sm text-navy-100/85 sm:text-base">
              Manage your appliance repair bookings, request doorstep service, and track technician updates in real-time.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/user/book-service" className="btn btn-gold shadow-md">
              <FaPlusCircle /> Book New Service
            </Link>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp shadow-md"
            >
              <FaWhatsapp className="text-lg" /> WhatsApp Support
            </a>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, idx) => (
          <Reveal key={s.label} delay={idx * 0.05} className="card p-6">
            <div className="flex items-center justify-between">
              <span className={`grid h-12 w-12 place-items-center rounded-2xl ${s.bg} ${s.color}`}>
                <s.icon className="text-xl" />
              </span>
              <span className="font-display text-3xl font-extrabold text-navy-900">
                {loading ? '…' : s.value}
              </span>
            </div>
            <p className="mt-4 text-sm font-semibold text-navy-600">{s.label}</p>
          </Reveal>
        ))}
      </div>

      {/* Two Column Layout: Recent Inquiries + Quick Help */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Recent Inquiries (2 cols) */}
        <div className="card p-6 sm:p-7 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-navy-100 pb-4">
            <div>
              <h2 className="font-display text-lg font-bold text-navy-900">Recent Service Inquiries</h2>
              <p className="text-xs text-navy-500">Your latest repair requests and statuses</p>
            </div>
            <Link to="/user/inquiries" className="inline-flex items-center gap-1.5 text-xs font-bold text-gold-500 hover:text-gold-600">
              View All <FaArrowRight />
            </Link>
          </div>

          <div className="mt-5 divide-y divide-navy-50">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="py-4 space-y-2">
                  <div className="h-4 w-1/3 shimmer rounded" />
                  <div className="h-3 w-2/3 shimmer rounded" />
                </div>
              ))
            ) : inquiries.length === 0 ? (
              <div className="py-12 text-center">
                <FaClipboardList className="mx-auto text-4xl text-navy-200" />
                <p className="mt-3 text-sm font-medium text-navy-600">No service inquiries yet.</p>
                <p className="mt-1 text-xs text-navy-400">Need appliance repair or maintenance? Book right now.</p>
                <Link to="/user/book-service" className="btn btn-primary btn-sm mt-4">
                  <FaPlusCircle /> Request Doorstep Repair
                </Link>
              </div>
            ) : (
              inquiries.slice(0, 5).map((inq) => (
                <div key={inq._id} className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="font-display text-sm font-bold text-navy-900">
                        {inq.serviceName || 'General Home Service'}
                      </span>
                      {statusBadge(inq.status)}
                    </div>
                    <p className="mt-1 text-xs text-navy-500 line-clamp-1">
                      {inq.message || 'No description provided.'}
                    </p>
                    <span className="mt-1 block text-[11px] text-navy-400">
                      Booked on: {new Date(inq.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="shrink-0 pt-2 sm:pt-0">
                    <a
                      href={whatsappLink(inq.serviceName)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-outline text-xs !py-1.5"
                    >
                      <FaWhatsapp className="text-emerald-600" /> WhatsApp
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Help & Direct Contacts */}
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="font-display text-base font-bold text-navy-900">Need Instant Help?</h3>
            <p className="mt-1 text-xs text-navy-500 leading-relaxed">
              Our technicians operate 7 days a week from 8:00 AM to 9:00 PM across Greater Noida West.
            </p>
            <div className="mt-4 space-y-2.5">
              <a
                href={`tel:${business.phoneTel}`}
                className="flex items-center gap-3 rounded-xl border border-navy-100 bg-navy-50/50 p-3 text-xs font-semibold text-navy-800 transition hover:bg-navy-100/80"
              >
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-navy-900 text-gold-400">
                  <FaHeadset />
                </span>
                <div>
                  <p className="text-[10px] text-navy-400 uppercase">Emergency Helpline</p>
                  <p className="font-bold">{business.phoneDisplay}</p>
                </div>
              </a>
              <Link
                to="/user/profile"
                className="flex items-center gap-3 rounded-xl border border-navy-100 bg-navy-50/50 p-3 text-xs font-semibold text-navy-800 transition hover:bg-navy-100/80"
              >
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-navy-900 text-gold-400">
                  <FaUserEdit />
                </span>
                <div>
                  <p className="text-[10px] text-navy-400 uppercase">Account Settings</p>
                  <p className="font-bold">Edit Profile & Password</p>
                </div>
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-gold-300/40 bg-gold-50/50 p-5">
            <div className="flex items-start gap-3">
              <FaCheckCircle className="mt-0.5 shrink-0 text-gold-500 text-lg" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-navy-900">Service Guarantee</h4>
                <p className="mt-1 text-xs leading-relaxed text-navy-600">
                  Every appliance repair performed by Lovely Gas Company is backed by a doorstep service warranty and genuine spare parts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
