import Reveal from './Reveal'

// Centered section heading with an eyebrow label + optional subtitle.
export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  light = false,
}) {
  const alignment =
    align === 'left' ? 'text-left items-start' : 'text-center items-center mx-auto'
  return (
    <Reveal className={`flex max-w-2xl flex-col ${alignment}`}>
      {eyebrow && (
        <span
          className={`eyebrow ${
            light ? 'bg-white/10 text-gold-300' : ''
          }`}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={`mt-2.5 text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl ${
          light ? 'text-white' : 'text-navy-900'
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-2.5 text-sm leading-relaxed sm:text-base ${
            light ? 'text-navy-100/80' : 'text-navy-500'
          }`}
        >
          {subtitle}
        </p>
      )}
      <span className="mt-3.5 h-1 w-16 rounded-full bg-gold-gradient" />
    </Reveal>
  )
}
