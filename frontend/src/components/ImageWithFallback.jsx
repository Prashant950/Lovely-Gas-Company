import { useEffect, useState } from 'react'

// A fallback used whenever a remote image fails to load, so the UI never
// shows a broken-image icon. Uses a deterministic Picsum photo per seed.
export default function ImageWithFallback({ src, alt = '', seed = 'lovely-gas', className = '', ...rest }) {
  const fallback = `https://picsum.photos/seed/${encodeURIComponent(seed)}/1200/800`
  const [current, setCurrent] = useState(src || fallback)

  // Keep in sync if the parent later passes a different src to the same instance.
  useEffect(() => { setCurrent(src || fallback) }, [src]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <img
      src={current}
      alt={alt}
      loading="lazy"
      onError={() => {
        if (current !== fallback) setCurrent(fallback)
      }}
      className={className}
      {...rest}
    />
  )
}
