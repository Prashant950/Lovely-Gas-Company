import { useState } from 'react'
import toast from 'react-hot-toast'
import { FaPlus, FaEdit, FaTrash, FaUserShield, FaUser } from 'react-icons/fa'
import Modal from '../../components/Modal'
import ConfirmDialog from '../../components/ConfirmDialog'
import Pagination from '../../components/Pagination'
import {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from '../../features/users/usersApiSlice'
import { useAuth } from '../../context/AuthContext'

const emptyForm = { name: '', email: '', phone: '', role: 'user', password: '' }

export default function ManageUsers() {
  const { user: currentUser } = useAuth()
  const { data: users = [], isLoading: loading } = useGetUsersQuery()
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation()
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation()
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation()

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [page, setPage] = useState(1)
  const pageSize = 10

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModalOpen(true) }
  const openEdit = (u) => {
    setEditing(u)
    setForm({ name: u.name || '', email: u.email || '', phone: u.phone || '', role: u.role || 'user', password: '' })
    setModalOpen(true)
  }
  const update = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const save = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim()) return toast.error('Name and email are required.')
    if (!editing && !form.password) return toast.error('Password is required for a new user.')

    try {
      if (editing) {
        const payload = { id: editing._id, name: form.name, email: form.email, phone: form.phone, role: form.role }
        if (form.password) payload.password = form.password
        await updateUser(payload).unwrap()
        toast.success('User updated.')
      } else {
        await createUser(form).unwrap()
        toast.success('User created.')
      }
      setModalOpen(false)
    } catch (err) {
      toast.error(err?.data?.message || err.message || 'Could not save user.')
    }
  }

  const confirmDelete = async () => {
    try {
      await deleteUser(deleteTarget._id).unwrap()
      toast.success('User deleted.')
      setDeleteTarget(null)
    } catch (err) {
      toast.error(err?.data?.message || err.message || 'Could not delete user.')
    }
  }

  const saving = isCreating || isUpdating

  // Paginated slice
  const paginatedUsers = users.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-navy-900">Manage Users</h1>
          <p className="mt-1 text-sm text-navy-500">Add, edit or remove admin and customer accounts.</p>
        </div>
        <button onClick={openCreate} className="btn btn-primary"><FaPlus /> Add User</button>
      </div>

      <div className="mt-6 card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-navy-50/70 text-xs uppercase tracking-wide text-navy-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Name</th>
                <th className="px-5 py-3 font-semibold">Email</th>
                <th className="px-5 py-3 font-semibold">Phone</th>
                <th className="px-5 py-3 font-semibold">Role</th>
                <th className="px-5 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-50">
              {loading ? (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-navy-400">Loading…</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-navy-400">No users found.</td></tr>
              ) : paginatedUsers.map((u) => (
                <tr key={u._id} className="transition hover:bg-navy-50/40">
                  <td className="px-5 py-3 font-semibold text-navy-900">
                    {u.name}
                    {currentUser?.id === u._id && <span className="ml-2 text-xs font-normal text-navy-400">(you)</span>}
                  </td>
                  <td className="px-5 py-3 text-navy-600">{u.email}</td>
                  <td className="px-5 py-3 text-navy-600">{u.phone || '—'}</td>
                  <td className="px-5 py-3">
                    <span className={`badge ${u.role === 'admin' ? 'bg-navy-700 text-white' : 'bg-navy-50 text-navy-600'}`}>
                      {u.role === 'admin' ? <FaUserShield className="text-[10px]" /> : <FaUser className="text-[10px]" />}
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(u)} aria-label="Edit"
                        className="grid h-9 w-9 place-items-center rounded-lg bg-navy-50 text-navy-700 transition hover:bg-navy-700 hover:text-white">
                        <FaEdit />
                      </button>
                      <button onClick={() => setDeleteTarget(u)} aria-label="Delete"
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
          totalItems={users.length}
          pageSize={pageSize}
          onPageChange={setPage}
        />
      </div>
      {/* Create / Edit modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit User' : 'Add User'}
      >
        <form onSubmit={save} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="u-name">Full Name *</label>
              <input id="u-name" name="name" value={form.name} onChange={update} className="input" placeholder="Full name" />
            </div>
            <div>
              <label className="label" htmlFor="u-phone">Phone</label>
              <input id="u-phone" name="phone" value={form.phone} onChange={update} className="input" placeholder="Mobile number" />
            </div>
          </div>
          <div>
            <label className="label" htmlFor="u-email">Email *</label>
            <input id="u-email" name="email" type="email" value={form.email} onChange={update} className="input" placeholder="email@example.com" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="u-role">Role</label>
              <select id="u-role" name="role" value={form.role} onChange={update} className="input">
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="label" htmlFor="u-pass">
                Password {editing ? <span className="font-normal text-navy-400">(leave blank to keep)</span> : '*'}
              </label>
              <input id="u-pass" name="password" type="password" value={form.password} onChange={update}
                className="input" placeholder={editing ? '••••••••' : 'Min 6 characters'} autoComplete="new-password" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn btn-ghost">Cancel</button>
            <button type="submit" disabled={saving} className="btn btn-primary">
              {saving ? 'Saving…' : editing ? 'Update User' : 'Create User'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        loading={isDeleting}
        title="Delete user?"
        message={`"${deleteTarget?.name}" will be permanently removed. This action cannot be undone.`}
      />
    </div>
  )
}
