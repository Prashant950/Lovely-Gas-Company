// =============================================================
//  CENTRAL BUSINESS CONFIG  —  edit this one file to update
//  the phone number, address, socials, map, and copy site-wide.
// =============================================================

// 👉 IMPORTANT: replace this placeholder with the owner's REAL number.
//    Use full international format, digits only, no "+" and no spaces
//    (this is what WhatsApp's wa.me links require).
//    Example for +91 98765 43210  ->  '919876543210'
export const WHATSAPP_NUMBER = '9905969905' // TODO: replace with real number

// Human-friendly version shown in text / tel: links.
export const PHONE_DISPLAY = '+91 9905969905' // TODO: replace with real number
export const PHONE_TEL = '+919905969905' // TODO: replace with real number

export const business = {
  name: 'Lovely Gas Company & Home Service Provider',
  shortName: 'Lovely Gas Company',
  tagline: 'Your trusted doorstep repair & installation experts',
  email: 'lovelygascompany@gmail.com', // TODO: replace with real email
  phoneDisplay: PHONE_DISPLAY,
  phoneTel: PHONE_TEL,
  whatsapp: WHATSAPP_NUMBER,
  address: {
    line1: 'G. No-1, H. No-127, Dudheshwar Colony',
    line2: 'Chipiyana Khurd Urf Tigri, Sector 16C',
    line3: 'Taj Highway, Greater Noida West',
    city: 'Greater Noida',
    state: 'Uttar Pradesh',
    country: 'India',
  },
  hours: 'Mon – Sun · 8:00 AM – 9:00 PM',
  established: 2013, // used for "years of experience" fallback
}

// Full one-line address string shown in text and info cards.
export const fullAddress = [
  business.address.line1,
  business.address.line2,
  business.address.line3,
  `${business.address.city}, ${business.address.state}, ${business.address.country}`,
].join(', ')

// Precise search query for Google Maps Geocoding to locate Dudheshwar Colony pinpoint accurately
const mapLocationQuery = encodeURIComponent(
  'Dudheshwar Colony, Chipiyana Khurd, Sector 16C, Greater Noida West, Uttar Pradesh 201009'
)

// Google Maps embed (with 16x zoom centered directly on Dudheshwar Colony).
export const mapEmbedUrl = `https://maps.google.com/maps?q=${mapLocationQuery}&t=&z=16&ie=UTF8&iwloc=&output=embed`

// Google Maps "get directions" link.
export const mapDirectionsUrl = `https://www.google.com/maps/search/?api=1&query=${mapLocationQuery}`

/**
 * Build a wa.me deep link that opens WhatsApp with a pre-filled message.
 * @param {string} serviceName - optional service the customer is interested in
 */
export function whatsappLink(serviceName) {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`
  const msg = serviceName
    ? `Hello ${business.shortName}, I am interested in your "${serviceName}" service. Please contact me.`
    : `Hello ${business.shortName}, I would like to enquire about your home services. Please contact me.`
  return `${base}?text=${encodeURIComponent(msg)}`
}

// Animated stat counters shown on Home / About.
export const stats = [
  { label: 'Happy Clients', value: 5200, suffix: '+' },
  { label: 'AC Installations & Repairs', value: 3800, suffix: '+' },
  { label: 'Years of Experience', value: 12, suffix: '+' },
  { label: 'Expert Team Members', value: 25, suffix: '+' },
]

// Hero carousel slides (Full-HD background + business copy).
export const heroSlides = [
  {
    image: '/images/hero-gas-stove.jpg',
    title: 'Gas Stove & Kitchen Appliance Care',
    subtitle:
      'Safe, certified repairs for every brand — chulha, burner & pipe servicing right at your doorstep.',
  },
  {
    image: '/images/hero-ac-service.jpg',
    title: 'AC Installation & Servicing Experts',
    subtitle:
      'Trained technicians, genuine spare parts and same-day service you can rely on across Greater Noida West.',
  },
  {
    image: '/images/hero-washing-machine.jpg',
    title: 'Home Appliance Repair, Done Right',
    subtitle:
      'Washing machine, fridge, geyser, RO & electronics — expert doorstep service at honest prices.',
  },
]

export default business
