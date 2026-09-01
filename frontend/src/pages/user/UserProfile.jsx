import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import {
  FaUser, FaEnvelope, FaPhone, FaLock, FaCheckCircle,
  FaShieldAlt, FaSave, FaKey
} from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'
import { useUpdateProfileMutation } from '../../features/auth/authApiSlice'

export default function UserProfile() {
  const { user } = useAuth()
  const [updateProfileApi] = useUpdateProfileMutation()

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [updatingProfile, setUpdatingProfile] = useState(false)

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [updatingPassword, setUpdatingPassword] = useState(false)

  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setPhone(user.phone || '')
    }
  }, [user])

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error('Name cannot be empty.')
      return
    }

    try {
      setUpdatingProfile(true)
      const res = await updateProfileApi({ name, phone }).unwrap()
      toast.success(res.message || 'Profile updated successfully!')
    } catch (err) {
      toast.error(err?.data?.message || err.message || 'Failed to update profile.')
    } finally {
      setUpdatingProfile(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (!currentPassword) {
      toast.error('Please enter your current password.')
      return
    }
    if (!newPassword || newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long.')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match.')
      return
    }

    try {
      setUpdatingPassword(true)
      const res = await updateProfileApi({
        currentPassword,
        password: newPassword,
      }).unwrap()
      toast.success(res.message || 'Password changed successfully!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      toast.error(err?.data?.message || err.message || 'Failed to update password.')
    } finally {
      setUpdatingPassword(false)
    }
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-extrabold text-navy-900">My Account & Profile</h1>
        <p className="mt-1 text-sm text-navy-500">
          Manage your personal details and secure your account credentials
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Personal Info Card */}
        <div className="card p-6 sm:p-7">
          <div className="flex items-center gap-3 border-b border-navy-100 pb-4">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-navy-gradient text-gold-400">
              <FaUser />
            </span>
            <div>
              <h2 className="font-display text-base font-bold text-navy-900">Personal Information</h2>
              <p className="text-xs text-navy-500">Update your name & phone number</p>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="mt-5 space-y-4">
            <div>
              <label className="label" htmlFor="p-name">Full Name</label>
              <div className="relative">
                <FaUser className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-300 text-xs" />
                <input
                  id="p-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input pl-9"
                  required
                />
              </div>
            </div>

            <div>
              <label className="label" htmlFor="p-email">Email Address (Non-editable)</label>
              <div className="relative">
                <FaEnvelope className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-300 text-xs" />
                <input
                  id="p-email"
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="input pl-9 bg-navy-50 text-navy-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="label" htmlFor="p-phone">Phone Number</label>
              <div className="relative">
                <FaPhone className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-300 text-xs" />
                <input
                  id="p-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="input pl-9"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={updatingProfile}
              className="btn btn-primary w-full shadow-sm"
            >
              <FaSave /> {updatingProfile ? 'Saving Changes…' : 'Save Details'}
            </button>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="card p-6 sm:p-7">
          <div className="flex items-center gap-3 border-b border-navy-100 pb-4">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-navy-gradient text-gold-400">
              <FaKey />
            </span>
            <div>
              <h2 className="font-display text-base font-bold text-navy-900">Account Security</h2>
              <p className="text-xs text-navy-500">Update your account password</p>
            </div>
          </div>

          <form onSubmit={handleChangePassword} className="mt-5 space-y-4">
            <div>
              <label className="label" htmlFor="p-curr-pass">Current Password</label>
              <div className="relative">
                <FaLock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-300 text-xs" />
                <input
                  id="p-curr-pass"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input pl-9"
                  required
                />
              </div>
            </div>

            <div>
              <label className="label" htmlFor="p-new-pass">New Password (Min 6 chars)</label>
              <div className="relative">
                <FaLock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-300 text-xs" />
                <input
                  id="p-new-pass"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input pl-9"
                  required
                />
              </div>
            </div>

            <div>
              <label className="label" htmlFor="p-conf-pass">Confirm New Password</label>
              <div className="relative">
                <FaLock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-300 text-xs" />
                <input
                  id="p-conf-pass"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input pl-9"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={updatingPassword}
              className="btn btn-outline w-full shadow-sm"
            >
              <FaLock /> {updatingPassword ? 'Updating Password…' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
