import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  FaTools, FaCalendarAlt, FaMapMarkerAlt, FaPaperPlane,
  FaCheckCircle, FaShieldAlt, FaWhatsapp
} from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'
import { useGetServicesQuery } from '../../features/services/servicesApiSlice'
import { useCreateInquiryMutation } from '../../features/inquiries/inquiriesApiSlice'
import { whatsappLink, business } from '../../config/business'

export default function UserBookService() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { data: services = [], isLoading: loadingServices } = useGetServicesQuery()
  const [createInquiry, { isLoading: submitting }] = useCreateInquiryMutation()

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    serviceName: '',
    preferredDate: '',
    address: '',
    message: '',
  })

  // Sync user info
  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        name: f.name || user.name || '',
        phone: f.phone || user.phone || '',
        email: f.email || user.email || '',
      }))
    }
  }, [user])

  // Select default service once loaded
  useEffect(() => {
    if (services.length > 0 && !form.serviceName) {
      setForm((f) => ({ ...f, serviceName: services[0].title }))
    }
  }, [services, form.serviceName])

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error('Please provide your name and phone number.')
      return
    }

    try {
      await createInquiry({
        ...form,
        source: 'user-portal',
      }).unwrap()
      toast.success('Service booked successfully! Our team will contact you shortly.')
      navigate('/user/inquiries')
    } catch (err) {
      toast.error(err?.data?.message || err.message || 'Could not submit service booking.')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-extrabold text-navy-900">Book a Doorstep Service</h1>
        <p className="mt-1 text-sm text-navy-500">
          Select an appliance, specify your address, and our verified technician will arrive on time.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Form Column (2 cols) */}
        <div className="card p-6 sm:p-8 lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Service Selection */}
            <div>
              <label className="label" htmlFor="b-service">
                Select Service / Appliance *
              </label>
              <select
                id="b-service"
                name="serviceName"
                value={form.serviceName}
                onChange={handleChange}
                className="input"
                required
              >
                {loadingServices ? (
                  <option>Loading available services…</option>
                ) : (
                  services.map((s) => (
                    <option key={s._id} value={s.title}>
                      {s.icon} {s.title}
                    </option>
                  ))
                )}
                <option value="Other Appliance Repair">🔧 Other Appliance Repair</option>
              </select>
            </div>

            {/* Name & Phone */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="b-name">Your Full Name *</label>
                <input
                  id="b-name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Rahul Sharma"
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="label" htmlFor="b-phone">Phone Number *</label>
                <input
                  id="b-phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="e.g. +91 98765 43210"
                  className="input"
                  required
                />
              </div>
            </div>

            {/* Preferred Date & Email */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="b-date">Preferred Date / Time Slot</label>
                <input
                  id="b-date"
                  name="preferredDate"
                  type="text"
                  value={form.preferredDate}
                  onChange={handleChange}
                  placeholder="e.g. Today 4:00 PM or Tomorrow Morning"
                  className="input"
                />
              </div>
              <div>
                <label className="label" htmlFor="b-email">Email Address</label>
                <input
                  id="b-email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="input"
                />
              </div>
            </div>

            {/* Complete Address */}
            <div>
              <label className="label" htmlFor="b-address">Doorstep Address / Tower / Society *</label>
              <input
                id="b-address"
                name="address"
                type="text"
                value={form.address}
                onChange={handleChange}
                placeholder="e.g. Flat 504, Tower 3, Gaur City 2, Greater Noida West"
                className="input"
                required
              />
            </div>

            {/* Problem Details */}
            <div>
              <label className="label" htmlFor="b-msg">Describe the Issue / Symptoms</label>
              <textarea
                id="b-msg"
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={3}
                placeholder="e.g. AC is running but not cooling properly, low gas pressure or fan noise..."
                className="textarea"
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary flex-1 shadow-card"
              >
                {submitting ? (
                  'Submitting Request…'
                ) : (
                  <>
                    <FaPaperPlane /> Confirm & Book Visit
                  </>
                )}
              </button>
              <a
                href={whatsappLink(form.serviceName)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp"
              >
                <FaWhatsapp className="text-lg" /> Book via WhatsApp
              </a>
            </div>
          </form>
        </div>

        {/* Benefits Sidebar */}
        <div className="space-y-5">
          <div className="card p-6">
            <h3 className="font-display text-base font-bold text-navy-900">Why Book With Us?</h3>
            <ul className="mt-4 space-y-3">
              {[
                { title: 'Doorstep Same-Day Visit', text: 'Quick response across Greater Noida West.' },
                { title: 'Trained Technicians', text: 'Verified professionals with years of experience.' },
                { title: 'Genuine Spare Parts', text: '100% original parts with service warranty.' },
                { title: 'Transparent Pricing', text: 'Upfront estimate before repair starts.' },
              ].map((item) => (
                <li key={item.title} className="flex items-start gap-2.5 text-xs">
                  <FaCheckCircle className="mt-0.5 shrink-0 text-gold-500" />
                  <div>
                    <strong className="block text-navy-800">{item.title}</strong>
                    <span className="text-navy-500">{item.text}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-navy-900 p-6 text-white">
            <FaShieldAlt className="text-3xl text-gold-400" />
            <h4 className="mt-3 font-display text-sm font-bold">100% Satisfaction Guarantee</h4>
            <p className="mt-1 text-xs leading-relaxed text-navy-200">
              Your safety and appliance reliability is our top priority. We test every machine thoroughly before handover.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
