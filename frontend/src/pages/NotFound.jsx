import { Link } from 'react-router-dom'
import { FaHome } from 'react-icons/fa'

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-navy-50/40 px-4 pt-24 text-center">
      <p className="font-display text-7xl font-extrabold text-gradient sm:text-8xl">404</p>
      <h1 className="mt-4 font-display text-2xl font-bold text-navy-900">Page not found</h1>
      <p className="mt-2 max-w-md text-navy-500">
        The page you're looking for doesn't exist or has moved.
      </p>
      <Link to="/" className="btn btn-primary mt-6">
        <FaHome /> Back to Home
      </Link>
    </div>
  )
}
