import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Guards admin routes. Waits for auth bootstrap, then requires an admin user.
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy-900">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-gold-400" />
      </div>
    )
  }

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  return children
}
