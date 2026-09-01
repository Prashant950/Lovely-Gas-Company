import { createContext, useCallback, useContext, useState } from 'react'
import InquiryModal from '../components/InquiryModal'

const InquiryContext = createContext(null)

// Provides a global `openInquiry(serviceName)` used by the navbar, hero CTAs
// and service cards. Renders a single shared InquiryModal.
export function InquiryProvider({ children }) {
  const [open, setOpen] = useState(false)
  const [service, setService] = useState('')

  const openInquiry = useCallback((serviceName = '') => {
    setService(serviceName)
    setOpen(true)
  }, [])

  const closeInquiry = useCallback(() => setOpen(false), [])

  return (
    <InquiryContext.Provider value={{ openInquiry, closeInquiry }}>
      {children}
      <InquiryModal open={open} onClose={closeInquiry} prefillService={service} />
    </InquiryContext.Provider>
  )
}

export function useInquiry() {
  const ctx = useContext(InquiryContext)
  if (!ctx) throw new Error('useInquiry must be used within an InquiryProvider')
  return ctx
}
