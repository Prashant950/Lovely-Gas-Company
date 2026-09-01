import { useState } from 'react'
import toast from 'react-hot-toast'
import {
  FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock, FaWhatsapp, FaPaperPlane,
} from 'react-icons/fa'
import PageHeader from '../components/PageHeader'
import { useCreateInquiryMutation } from '../features/inquiries/inquiriesApiSlice'
import { business, fullAddress, mapEmbedUrl, mapDirectionsUrl, whatsappLink } from '../config/business'

const empty = { name: '', phone: '', email: '', serviceName: '', message: '' }

const infoCards = [
  { icon: FaMapMarkerAlt, label: 'Our Address', value: fullAddress, href: mapDirectionsUrl },
  { icon: FaPhoneAlt, label: 'Call Us', value: business.phoneDisplay, href: `tel:${business.phoneTel}` },
  { icon: FaEnvelope, label: 'Email Us', value: business.email, href: `mailto:${business.email}` },
  { icon: FaClock, label: 'Working Hours', value: business.hours },
]

export default function Contact() {
  const [form, setForm] = useState(empty)
  const [createInquiry, { isLoading: submitting }] = useCreateInquiryMutation()

  const update = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error('Please enter your name and phone number.')
      return
    }
    try {
      await createInquiry({ ...form, source: 'contact-form' }).unwrap()
      toast.success("Message sent! We'll get back to you soon.")
      setForm(empty)
    } catch (err) {
      toast.error(err?.data?.message || err.message || 'Could not send your message.')
    }
  }

  return (
    <div>
      <PageHeader
        title="Contact Us"
        crumb="Contact Us"
        subtitle="Have a question or need a repair? Reach out — we're happy to help."
      />

      {/* Info cards */}
      <section className="section pb-0">
        <div className="container-x grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {infoCards.map((c) => {
            const Inner = (
              <>
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-navy-gradient text-gold-400">
                  <c.icon className="text-lg" />
                </span>
                <h3 className="mt-4 font-display text-sm font-bold uppercase tracking-wide text-navy-900">
                  {c.label}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-navy-500">{c.value}</p>
              </>
            )
            return c.href ? (
              <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer"
                className="card card-hover block p-6">{Inner}</a>
            ) : (
              <div key={c.label} className="card p-6">{Inner}</div>
            )
          })}
        </div>
      </section>

      {/* Form + Map */}
      <section className="section">
        <div className="container-x grid gap-8 lg:grid-cols-2">
          {/* Form */}
          <div className="card p-7 sm:p-8">
            <h2 className="font-display text-2xl font-bold text-navy-900">Send us a message</h2>
            <p className="mt-1.5 text-sm text-navy-500">
              Fill in the form and our team will call you back shortly.
            </p>
            <form onSubmit={submit} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label" htmlFor="c-name">Full Name *</label>
                  <input id="c-name" name="name" value={form.name} onChange={update} className="input" placeholder="Your name" />
                </div>
                <div>
                  <label className="label" htmlFor="c-phone">Phone *</label>
                  <input id="c-phone" name="phone" value={form.phone} onChange={update} className="input" placeholder="Mobile number" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label" htmlFor="c-email">Email</label>
                  <input id="c-email" name="email" type="email" value={form.email} onChange={update} className="input" placeholder="Optional" />
                </div>
                <div>
                  <label className="label" htmlFor="c-service">Service Needed</label>
                  <input id="c-service" name="serviceName" value={form.serviceName} onChange={update} className="input" placeholder="e.g. AC Repair" />
                </div>
              </div>
              <div>
                <label className="label" htmlFor="c-msg">Message</label>
                <textarea id="c-msg" name="message" value={form.message} onChange={update} className="textarea" placeholder="How can we help?" />
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button type="submit" disabled={submitting} className="btn btn-primary flex-1">
                  {submitting ? 'Sending…' : (<><FaPaperPlane /> Send Message</>)}
                </button>
                <a href={whatsappLink(form.serviceName)} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp flex-1">
                  <FaWhatsapp className="text-lg" /> WhatsApp
                </a>
              </div>
            </form>
          </div>

          {/* Map */}
          <div className="flex flex-col overflow-hidden rounded-2xl shadow-card">
            <iframe
              title="Lovely Gas Company location"
              src={mapEmbedUrl}
              className="h-full min-h-[360px] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </section>
    </div>
  )
}
