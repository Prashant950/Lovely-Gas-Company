import CountUp from 'react-countup'
import { useInView } from 'react-intersection-observer'
import { FaRegSmile, FaSnowflake, FaAward, FaUsers } from 'react-icons/fa'
import { stats } from '../config/business'

const icons = [FaRegSmile, FaSnowflake, FaAward, FaUsers]

export default function StatsCounter({ dark = true }) {
  // Trigger the count-up once the band scrolls into view.
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 })

  return (
    <section
      ref={ref}
      className={dark ? 'relative overflow-hidden bg-navy-gradient' : 'bg-white'}
    >
      {dark && (
        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, #f5a623 0, transparent 40%), radial-gradient(circle at 80% 80%, #f5a623 0, transparent 40%)',
          }}
        />
      )}
      <div className="container-x relative grid grid-cols-2 gap-8 py-14 sm:py-16 lg:grid-cols-4">
        {stats.map((s, i) => {
          const Icon = icons[i % icons.length]
          return (
            <div key={s.label} className="flex flex-col items-center text-center">
              <span
                className={`mb-3 grid h-14 w-14 place-items-center rounded-2xl ${
                  dark ? 'bg-white/10 text-gold-400' : 'bg-navy-50 text-navy-700'
                }`}
              >
                <Icon className="text-2xl" />
              </span>
              <div
                className={`font-display text-4xl font-extrabold sm:text-5xl ${
                  dark ? 'text-white' : 'text-navy-900'
                }`}
              >
                {inView ? (
                  <CountUp end={s.value} duration={2.4} separator="," suffix={s.suffix} />
                ) : (
                  <span>0{s.suffix}</span>
                )}
              </div>
              <p className={`mt-2 text-sm font-medium ${dark ? 'text-navy-100/80' : 'text-navy-500'}`}>
                {s.label}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
