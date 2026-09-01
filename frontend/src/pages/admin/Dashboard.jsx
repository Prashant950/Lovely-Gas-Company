import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FaTools, FaUsers, FaInbox, FaCheckCircle, FaBell, FaArrowRight,
} from 'react-icons/fa'
import Pagination from '../../components/Pagination'
import { useGetStatsQuery } from '../../features/stats/statsApiSlice'
import { useGetInquiriesQuery } from '../../features/inquiries/inquiriesApiSlice'

const statusStyle = {
  new: 'bg-gold-100 text-gold-600',
  contacted: 'bg-blue-100 text-blue-700',
  'in-progress': 'bg-indigo-100 text-indigo-700',
  resolved: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-600',
}

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useGetStatsQuery()
  const { data: inquiries = [], isLoading: inqLoading } = useGetInquiriesQuery()
  const [page, setPage] = useState(1)
  const pageSize = 5

  const loading = statsLoading || inqLoading
  const paginatedInquiries = inquiries.slice((page - 1) * pageSize, page * pageSize)

  const cards = [
    { label: 'Total Services', value: stats?.totalServices, sub: `${stats?.activeServices ?? 0} active`, icon: FaTools, to: '/admin/services' },
    { label: 'Users', value: stats?.totalUsers, sub: 'Registered accounts', icon: FaUsers, to: '/admin/users' },
    { label: 'Total Inquiries', value: stats?.totalInquiries, sub: 'All-time', icon: FaInbox, to: '/admin/inquiries' },
    { label: 'New Inquiries', value: stats?.newInquiries, sub: 'Awaiting response', icon: FaBell, to: '/admin/inquiries' },
  ]

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-navy-900">Dashboard</h1>
      <p className="mt-1 text-sm text-navy-500">Overview of your business at a glance.</p>

      {/* Stat cards */}
      <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.label} to={c.to} className="card card-hover group p-6">
            <div className="flex items-center justify-between">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-navy-gradient text-gold-400">
                <c.icon className="text-lg" />
              </span>
              <FaArrowRight className="text-navy-200 transition group-hover:translate-x-1 group-hover:text-navy-500" />
            </div>
            <p className="mt-4 font-display text-3xl font-extrabold text-navy-900">
              {loading ? '—' : (c.value ?? 0)}
            </p>
            <p className="text-sm font-semibold text-navy-700">{c.label}</p>
            <p className="text-xs text-navy-400">{c.sub}</p>
          </Link>
        ))}
      </div>

      {/* Recent inquiries */}
      <div className="mt-8 card overflow-hidden">
        <div className="p-6 pb-0 flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-navy-900">Recent Inquiries</h2>
            <p className="text-xs text-navy-500">Real-time incoming customer inquiries</p>
          </div>
          <Link to="/admin/inquiries" className="text-xs font-bold text-gold-600 hover:text-gold-700">
            View all →
          </Link>
        </div>

        <div className="mt-4 overflow-x-auto px-6">
          {loading ? (
            <p className="py-8 text-center text-navy-400">Loading…</p>
          ) : inquiries.length === 0 ? (
            <p className="flex items-center justify-center gap-2 py-8 text-navy-400">
              <FaCheckCircle className="text-green-500" /> No inquiries yet.
            </p>
          ) : (
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead>
                <tr className="border-b border-navy-100 text-xs uppercase tracking-wide text-navy-400">
                  <th className="pb-3 pr-4 font-semibold">Name</th>
                  <th className="pb-3 pr-4 font-semibold">Phone</th>
                  <th className="pb-3 pr-4 font-semibold">Service</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-50">
                {paginatedInquiries.map((i) => (
                  <tr key={i._id} className="text-navy-700">
                    <td className="py-3 pr-4 font-medium text-navy-900">{i.name}</td>
                    <td className="py-3 pr-4">{i.phone}</td>
                    <td className="py-3 pr-4">{i.serviceName || '—'}</td>
                    <td className="py-3">
                      <span className={`badge ${statusStyle[i.status] || 'bg-navy-50 text-navy-600'}`}>
                        {i.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Controls */}
        <Pagination
          currentPage={page}
          totalItems={inquiries.length}
          pageSize={pageSize}
          onPageChange={setPage}
        />
      </div>
    </div>
  )
}
