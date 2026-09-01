import { useState, useRef } from 'react'
import toast from 'react-hot-toast'
import {
  FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaCloudUploadAlt,
  FaImage, FaSpinner
} from 'react-icons/fa'
import Modal from '../../components/Modal'
import ConfirmDialog from '../../components/ConfirmDialog'
import ImageWithFallback from '../../components/ImageWithFallback'
import Pagination from '../../components/Pagination'
import {
  useGetServicesQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
  useUploadImageMutation,
} from '../../features/services/servicesApiSlice'

const emptyForm = {
  title: '', category: '', shortDescription: '', description: '',
  imageUrl: '', icon: '', features: '', order: 0, isActive: true,
}

// Convert a service document into editable form state.
function toForm(s) {
  return {
    title: s.title || '', category: s.category || '',
    shortDescription: s.shortDescription || '', description: s.description || '',
    imageUrl: s.imageUrl || '', icon: s.icon || '',
    features: (s.features || []).join(', '),
    order: s.order ?? 0, isActive: s.isActive ?? true,
  }
}

export default function ManageServices() {
  const { data: services = [], isLoading: loading } = useGetServicesQuery({ all: true })
  const [createService, { isLoading: isCreating }] = useCreateServiceMutation()
  const [updateService, { isLoading: isUpdating }] = useUpdateServiceMutation()
  const [deleteService, { isLoading: isDeleting }] = useDeleteServiceMutation()
  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation()

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [deleteId, setDeleteId] = useState(null)
  const [page, setPage] = useState(1)
  const pageSize = 10
  const fileInputRef = useRef(null)

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModalOpen(true) }
  const openEdit = (s) => { setEditing(s); setForm(toForm(s)); setModalOpen(true) }

  const update = (e) => {
    const { name, value, type, checked } = e.target
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  // Handle direct image file upload to Cloudinary
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file.')
      return
    }

    const formData = new FormData()
    formData.append('image', file)

    try {
      toast.loading('Uploading to Cloudinary…', { id: 'upload' })
      const res = await uploadImage(formData).unwrap()
      if (res.url) {
        setForm((f) => ({ ...f, imageUrl: res.url }))
        toast.success('Image uploaded to Cloudinary!', { id: 'upload' })
      }
    } catch (err) {
      toast.error(err?.data?.message || err.message || 'Image upload failed', { id: 'upload' })
    }
  }

  const save = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return toast.error('Title is required.')

    const payload = {
      ...form,
      order: Number(form.order) || 0,
      features: form.features.split(',').map((f) => f.trim()).filter(Boolean),
    }

    try {
      if (editing) {
        await updateService({ id: editing._id, ...payload }).unwrap()
        toast.success('Service updated.')
      } else {
        await createService(payload).unwrap()
        toast.success('Service created.')
      }
      setModalOpen(false)
    } catch (err) {
      toast.error(err?.data?.message || err.message || 'Could not save service.')
    }
  }

  const confirmDelete = async () => {
    try {
      await deleteService(deleteId).unwrap()
      toast.success('Service deleted.')
      setDeleteId(null)
    } catch (err) {
      toast.error(err?.data?.message || err.message || 'Could not delete service.')
    }
  }

  const saving = isCreating || isUpdating

  // Paginated slice
  const paginatedServices = services.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-navy-900">Manage Services</h1>
          <p className="mt-1 text-sm text-navy-500">Create, edit and remove services shown on your website in real-time.</p>
        </div>
        <button onClick={openCreate} className="btn btn-primary"><FaPlus /> Add Service</button>
      </div>

      <div className="mt-6 card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-navy-50/70 text-xs uppercase tracking-wide text-navy-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Service</th>
                <th className="px-5 py-3 font-semibold">Category</th>
                <th className="px-5 py-3 font-semibold">Order</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-50">
              {loading ? (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-navy-400">Loading services…</td></tr>
              ) : services.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-navy-400">No services yet. Click “Add Service”.</td></tr>
              ) : paginatedServices.map((s) => (
                <tr key={s._id} className="transition hover:bg-navy-50/40">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <ImageWithFallback src={s.imageUrl} seed={s.slug || s.title} alt={s.title}
                        className="h-11 w-14 shrink-0 rounded-lg object-cover" />
                      <div>
                        <p className="font-semibold text-navy-900">{s.icon} {s.title}</p>
                        <p className="max-w-xs truncate text-xs text-navy-400">{s.shortDescription}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-navy-600">{s.category || '—'}</td>
                  <td className="px-5 py-3 text-navy-600">{s.order}</td>
                  <td className="px-5 py-3">
                    <span className={`badge ${s.isActive ? 'bg-green-100 text-green-700' : 'bg-navy-100 text-navy-500'}`}>
                      {s.isActive ? <><FaCheck className="text-[10px]" /> Active</> : <><FaTimes className="text-[10px]" /> Hidden</>}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(s)} aria-label="Edit"
                        className="grid h-9 w-9 place-items-center rounded-lg bg-navy-50 text-navy-700 transition hover:bg-navy-700 hover:text-white">
                        <FaEdit />
                      </button>
                      <button onClick={() => setDeleteId(s._id)} aria-label="Delete"
                        className="grid h-9 w-9 place-items-center rounded-lg bg-red-50 text-red-600 transition hover:bg-red-600 hover:text-white">
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <Pagination
          currentPage={page}
          totalItems={services.length}
          pageSize={pageSize}
          onPageChange={setPage}
        />
      </div>

      {/* Create / Edit modal with Cloudinary upload */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Service' : 'Add Service'}
        subtitle="Manage details and upload service photos directly"
      >
        <form onSubmit={save} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="s-title">Title *</label>
              <input id="s-title" name="title" value={form.title} onChange={update} className="input" placeholder="e.g. AC Repair & Installation" />
            </div>
            <div>
              <label className="label" htmlFor="s-cat">Category</label>
              <input id="s-cat" name="category" value={form.category} onChange={update} className="input" placeholder="e.g. Air Conditioning" />
            </div>
          </div>

          <div>
            <label className="label" htmlFor="s-short">Short Title</label>
            <input id="s-short" name="shortDescription" value={form.shortDescription} onChange={update} className="input" placeholder="One line shown on the service card" />
          </div>

          <div>
            <label className="label" htmlFor="s-desc">Full Description</label>
            <textarea id="s-desc" name="description" value={form.description} onChange={update} className="textarea" placeholder="Detailed description of the service" />
          </div>

          {/* Cloudinary Image Upload & Preview */}
          <div className="rounded-2xl border border-navy-100 bg-navy-50/50 p-4">
            <label className="label mb-2 flex items-center justify-between">
              <span>Service Image</span>
              {isUploading && <span className="flex items-center gap-1.5 text-xs text-gold-500"><FaSpinner className="animate-spin" /> Uploading…</span>}
            </label>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {form.imageUrl ? (
                <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border border-navy-200">
                  <img src={form.imageUrl} alt="Preview" className="h-full w-full object-cover" />
                </div>
              ) : (
                <div className="grid h-16 w-24 shrink-0 place-items-center rounded-xl border border-dashed border-navy-200 bg-white text-navy-300">
                  <FaImage className="text-xl" />
                </div>
              )}

              <div className="flex-1 space-y-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="btn btn-outline btn-sm inline-flex items-center gap-2"
                >
                  <FaCloudUploadAlt /> Choose File from Computer
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="s-icon">Icon (emoji)</label>
              <input id="s-icon" name="icon" value={form.icon} onChange={update} className="input" placeholder="e.g. ❄️" />
            </div>
            <div>
              <label className="label" htmlFor="s-order">Display Order</label>
              <input id="s-order" name="order" type="number" value={form.order} onChange={update} className="input" />
            </div>
          </div>

          <div>
            <label className="label" htmlFor="s-feat">Features <span className="font-normal text-navy-400">(comma separated)</span></label>
            <input id="s-feat" name="features" value={form.features} onChange={update} className="input" placeholder="Doorstep service, Genuine parts, Warranty" />
          </div>

          <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-navy-50 px-4 py-3">
            <input type="checkbox" name="isActive" checked={form.isActive} onChange={update}
              className="h-5 w-5 rounded accent-navy-700" />
            <span className="text-sm font-semibold text-navy-800">Show on website (active)</span>
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn btn-ghost">Cancel</button>
            <button type="submit" disabled={saving || isUploading} className="btn btn-primary">
              {saving ? 'Saving…' : editing ? 'Update Service' : 'Create Service'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        loading={isDeleting}
        title="Delete service?"
        message="This service will be permanently removed from your website. This action cannot be undone."
      />
    </div>
  )
}

