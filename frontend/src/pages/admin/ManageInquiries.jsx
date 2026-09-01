import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import {
  FaTrash, FaWhatsapp, FaPhoneAlt, FaEnvelope, FaClock, FaTag,
} from 'react-icons/fa'
import ConfirmDialog from '../../components/ConfirmDialog'
import Pagination from '../../components/Pagination'
import {
  useGetInquiriesQuery,
  useUpdateInquiryMutation,
  useDeleteInquiryMutation,
} from '../../features/inquiries/inquiriesApiSlice'

const STATUSES = ['new', 'contacted', 'in-progress', 'resolved', 'cancelled']
const statusStyle = {
  new: 'bg-gold-100 text-gold-600',
  contacted: 'bg-blue-100 text-blue-700',
  'in-progress': 'bg-indigo-100 text-indigo-700',
  resolved: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-600',
}

function waLink(phone, name) {
  const digits = (phone || '').replace(/\D/g, '')
  const msg = `Hello ${name || ''}, thank you for contacting Lovely Gas Company.`
  return `https://wa.me/${digits}?text=${encodeURIComponent(msg)}`
}

export default function ManageInquiries() {
  const { data: inquiries = [], isLoading: loading } = useGetInquiriesQuery()
  const [updateInquiry, { isLoading: isUpdating }] = useUpdateInquiryMutation()
  const [deleteInquiry, { isLoading: isDeleting }] = useDeleteInquiryMutation()

  const [filter, setFilter] = useState('all')
  const [deleteId, setDeleteId] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)
  const [page, setPage] = useState(1)
  const pageSize = 10

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter)
    setPage(1)
  }

  const changeStatus = async (inq, status) => {
    try {
      setUpdatingId(inq._id)
      await updateInquiry({ id: inq._id, status }).unwrap()
      toast.success(`Marked as ${status}.`)
    } catch (err) {
      toast.error(err?.data?.message || err.message || 'Could not update status.')
    } finally {
      setUpdatingId(null)
    }
  }

  const confirmDelete = async () => {
    try {
      await deleteInquiry(deleteId).unwrap()
      toast.success('Inquiry deleted.')
      setDeleteId(null)
    } catch (err) {
      toast.error(err?.data?.message || err.message || 'Could not delete inquiry.')
    }
  }

  const counts = useMemo(() => {
    const c = { all: inquiries.length, new: 0, contacted: 0, 'in-progress': 0, resolved: 0, cancelled: 0 }
    inquiries.forEach((i) => { c[i.status] = (c[i.status] || 0) + 1 })
    return c
  }, [inquiries])

  const visible = filter === 'all' ? inquiries : inquiries.filter((i) => i.status === filter)
  const paginated = visible.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div>
      <div>
        <h1 className="font-display text-2xl font-extrabold text-navy-900">Inquiries</h1>
        <p className="mt-1 text-sm text-navy-500">Messages from the contact form, inquiry button and service cards.</p>
      </div>

      {/* Filter tabs */}
      <div className="mt-5 flex flex-wrap gap-2">
        {['all', ...STATUSES].map((s) => (
          <button key={s} onClick={() => handleFilterChange(s)}
            className={`rounded-full px-4 py-2 text-sm font-semibold capitalize transition ${
              filter === s ? 'bg-navy-700 text-white shadow-card' : 'bg-navy-50 text-navy-700 hover:bg-navy-100'
            }`}>
            {s} <span className="ml-1 opacity-70">({counts[s] ?? 0})</span>
          </button>
        ))}
      </div>

      {/* List */}
      <div className="mt-6 space-y-4">
        {loading ? (
          <p className="py-10 text-center text-navy-400">Loading…</p>
        ) : visible.length === 0 ? (
          <p className="card py-12 text-center text-navy-400">No inquiries in this view.</p>
        ) : (
          paginated.map((i) => (
            <div key={i._id} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-lg font-bold text-navy-900">{i.name}</h3>
                    <span className={`badge ${statusStyle[i.status] || 'bg-navy-50 text-navy-600'}`}>{i.status}</span>
                    <span className="badge bg-navy-50 text-navy-500"><FaTag className="text-[10px]" /> {i.source}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-navy-600">
                    <a href={`tel:${i.phone}`} className="inline-flex items-center gap-1.5 hover:text-navy-900"><FaPhoneAlt className="text-xs text-gold-500" /> {i.phone}</a>
                    {i.email && <a href={`mailto:${i.email}`} className="inline-flex items-center gap-1.5 hover:text-navy-900"><FaEnvelope className="text-xs text-gold-500" /> {i.email}</a>}
                    {i.serviceName && <span className="inline-flex items-center gap-1.5"><FaTag className="text-xs text-gold-500" /> {i.serviceName}</span>}
                    <span className="inline-flex items-center gap-1.5 text-navy-400"><FaClock className="text-xs" /> {new Date(i.createdAt).toLocaleString()}</span>
                  </div>
                  {i.message && <p className="mt-3 rounded-xl bg-navy-50/70 px-4 py-2.5 text-sm text-navy-700">{i.message}</p>}
                </div>

                <div className="flex shrink-0 flex-col items-end gap-2">
                  <select
                    value={i.status}
                    disabled={updatingId === i._id}
                    onChange={(e) => changeStatus(i, e.target.value)}
                    className="input !py-2 text-sm capitalize"
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <div className="flex gap-2">
                    <a href={waLink(i.phone, i.name)} target="_blank" rel="noopener noreferrer"
                      aria-label="Reply on WhatsApp"
                      className="grid h-9 w-9 place-items-center rounded-lg bg-[#25D366]/10 text-[#1ebe5b] transition hover:bg-[#25D366] hover:text-white">
                      <FaWhatsapp />
                    </a>
                    <button onClick={() => setDeleteId(i._id)} aria-label="Delete"
                      className="grid h-9 w-9 place-items-center rounded-lg bg-red-50 text-red-600 transition hover:bg-red-600 hover:text-white">
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}

        {/* Pagination Controls */}
        <div className="card overflow-hidden">
          <Pagination
            currentPage={page}
            totalItems={visible.length}
            pageSize={pageSize}
            onPageChange={setPage}
          />
        </div>
      </div>

      <ConfirmDialog
        open={!!deleteId}
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        loading={isDeleting}
        title="Delete inquiry?"
        message="This inquiry will be permanently removed. This action cannot be undone."
      />
    </div>
  )
}
