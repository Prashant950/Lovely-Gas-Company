import { Routes, Route, Outlet } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import WhatsAppFloat from './components/WhatsAppFloat'
import ProtectedRoute from './components/ProtectedRoute'
import { InquiryProvider } from './context/InquiryContext'

// Public pages
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

// Admin pages
import AdminLogin from './pages/admin/AdminLogin'
import AdminLayout from './pages/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import ManageServices from './pages/admin/ManageServices'
import ManageUsers from './pages/admin/ManageUsers'
import ManageInquiries from './pages/admin/ManageInquiries'

// User pages
import UserProtectedRoute from './components/UserProtectedRoute'
import UserLayout from './pages/user/UserLayout'
import UserDashboard from './pages/user/UserDashboard'
import UserInquiries from './pages/user/UserInquiries'
import UserBookService from './pages/user/UserBookService'
import UserProfile from './pages/user/UserProfile'

// Layout shared by all public pages.
function PublicLayout() {
  return (
    <InquiryProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
        <WhatsAppFloat />
      </div>
    </InquiryProvider>
  )
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public site */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* Auth / Login */}
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="services" element={<ManageServices />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="inquiries" element={<ManageInquiries />} />
        </Route>

        {/* User Portal */}
        <Route
          path="/user"
          element={
            <UserProtectedRoute>
              <UserLayout />
            </UserProtectedRoute>
          }
        >
          <Route index element={<UserDashboard />} />
          <Route path="inquiries" element={<UserInquiries />} />
          <Route path="book-service" element={<UserBookService />} />
          <Route path="profile" element={<UserProfile />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}
