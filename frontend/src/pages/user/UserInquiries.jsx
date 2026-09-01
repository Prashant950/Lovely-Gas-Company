import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  FaSearch, FaClipboardList, FaPlusCircle, FaWhatsapp,
  FaCalendarAlt, FaMapMarkerAlt, FaFilter, FaRedo,
} from 'react-icons/fa'
import Pagination from '../../components/Pagination'
import { useGetMyInquiriesQuery } from '../../features/inquiries/inquiriesApiSlice'
import { whatsappLink } from '../../config/business'

export default function UserInquiries() {
  const { data: inquiries = [], isLoading: loading, refetch } = useGetMyInquiriesQuery()
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)
  const pageSize = 10

  const fetchInquiries = () => {
    refetch()
  }

  const handleFilterChange = (tabId) => {
    setStatusFilter(tabId)
    setPage(1)
  }

  const filtered = useMemo(() => {
    return inquiries.filter((inq) => {
      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'pending' && (inq.status === 'new' || inq.status === 'contacted')) ||
        inq.status === statusFilter

      const q = query.toLowerCase().trim()
      const matchQuery =
        !q ||
        inq.serviceName?.toLowerCase().includes(q) ||
        inq.message?.toLowerCase().includes(q) ||
        inq.address?.toLowerCase().includes(q)

      return matchStatus && matchQuery
    })
  }, [inquiries, statusFilter, query])

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize)

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
        return <span className="badge badge-new">New Request</span>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-navy-900">My Bookings & Inquiries</h1>
          <p className="mt-1 text-sm text-navy-500">
            Track all your requested doorstep repair and servicing visits
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchInquiries}
            className="btn btn-outline btn-sm !p-2.5"
            title="Refresh list"
          >
            <FaRedo className={loading ? 'animate-spin' : ''} />
          </button>
          <Link to="/user/book-service" className="btn btn-primary btn-sm">
            <FaPlusCircle /> Book a Service
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Status Pills */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'All Requests' },
            { id: 'pending', label: 'Pending' },
            { id: 'in-progress', label: 'In Progress' },
            { id: 'resolved', label: 'Resolved' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleFilterChange(tab.id)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
                statusFilter === tab.id
                  ? 'bg-navy-900 text-white shadow-sm'
                  : 'bg-navy-50 text-navy-600 hover:bg-navy-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[220px]">
          <FaSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-navy-300" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setPage(1)
            }}
            placeholder="Search bookings…"
            className="input !py-1.5 pl-9 text-xs"
          />
        </div>
      </div>

      {/* Inquiries Content */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card p-6 space-y-3">
              <div className="h-4 w-1/4 shimmer rounded" />
              <div className="h-3 w-1/2 shimmer rounded" />
              <div className="h-3 w-3/4 shimmer rounded" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card py-16 text-center">
          <FaClipboardList className="mx-auto text-4xl text-navy-200" />
          <h3 className="mt-3 font-display text-base font-bold text-navy-800">
            {query || statusFilter !== 'all' ? 'No matching bookings found' : 'No service inquiries yet'}
          </h3>
          <p className="mt-1 text-xs text-navy-400">
            {query || statusFilter !== 'all'
              ? 'Try changing your search keywords or active status filter.'
              : 'Submit a service request and our certified technician will be dispatched to your doorstep.'}
          </p>
          <Link to="/user/book-service" className="btn btn-primary btn-sm mt-5">
            <FaPlusCircle /> Request Doorstep Service
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid gap-4">
            {paginated.map((inq) => (
              <div
                key={inq._id}
                className="card card-hover flex flex-col justify-between gap-5 p-6 sm:flex-row sm:items-start"
              >
                <div className="space-y-2.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="font-display text-base font-bold text-navy-900">
                      {inq.serviceName || 'Home Appliance Service'}
                    </h3>
                    {statusBadge(inq.status)}
                  </div>

                  <p className="text-xs leading-relaxed text-navy-600">
                    {inq.message || 'No description provided.'}
                  </p>

                  <div className="flex flex-wrap gap-x-6 gap-y-1.5 pt-1 text-[11px] text-navy-400">
                    <span className="inline-flex items-center gap-1.5">
                      <FaCalendarAlt className="text-gold-500" />
                      Booked: {new Date(inq.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {inq.preferredDate && (
                      <span className="inline-flex items-center gap-1.5 font-medium text-navy-700">
                        <FaCalendarAlt className="text-blue-500" /> Preferred Slot: {inq.preferredDate}
                      </span>
                    )}
                    {inq.address && (
                      <span className="inline-flex items-center gap-1.5">
                        <FaMapMarkerAlt className="text-red-400" /> {inq.address}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex shrink-0 items-center gap-2 pt-2 sm:pt-0">
                  <a
                    href={whatsappLink(inq.serviceName)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-whatsapp btn-sm text-xs"
                  >
                    <FaWhatsapp className="text-sm" /> Chat Support
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="card overflow-hidden">
            <Pagination
              currentPage={page}
              totalItems={filtered.length}
              pageSize={pageSize}
              onPageChange={setPage}
            />
          </div>
        </div>
      )}
    </div>
  )
}
