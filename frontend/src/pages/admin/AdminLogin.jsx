import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  FaFireAlt, FaLock, FaEnvelope, FaUser, FaPhone,
  FaArrowLeft, FaEye, FaEyeSlash, FaKey, FaCheckCircle, FaSpinner
} from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'
import {
  useRegisterMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} from '../../features/auth/authApiSlice'

export default function AdminLogin() {
  const [mode, setMode] = useState('login') // 'login' | 'register' | 'forgot'
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  // Login form state
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginSubmitting, setLoginSubmitting] = useState(false)

  // Register form state
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPhone, setRegPhone] = useState('')
  const [regPassword, setRegPassword] = useState('')

  // Forgot password OTP flow state
  const [forgotEmail, setForgotEmail] = useState('')
  const [otpStep, setOtpStep] = useState(1) // 1: enter email, 2: enter otp + new pass
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')

  const { login, setSession } = useAuth()
  const [registerApi, { isLoading: regLoading }] = useRegisterMutation()
  const [forgotPasswordApi, { isLoading: forgotLoading }] = useForgotPasswordMutation()
  const [resetPasswordApi, { isLoading: resetLoading }] = useResetPasswordMutation()

  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname

  // 1. Handle Login
  const handleLogin = async (e) => {
    e.preventDefault()
    if (!loginEmail.trim() || !loginPassword) {
      return toast.error('Please enter email and password.')
    }
    try {
      setLoginSubmitting(true)
      const user = await login(loginEmail.trim(), loginPassword)
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`)
      if (user.role === 'admin') {
        navigate(from || '/admin', { replace: true })
      } else {
        navigate(from || '/user', { replace: true })
      }
    } catch (err) {
      toast.error(err.message || 'Invalid email or password.')
    } finally {
      setLoginSubmitting(false)
    }
  }

  // 2. Handle Register (Create Account)
  const handleRegister = async (e) => {
    e.preventDefault()
    if (!regName.trim() || !regEmail.trim() || !regPassword) {
      return toast.error('Please fill in all required fields.')
    }
    if (regPassword.length < 6) {
      return toast.error('Password must be at least 6 characters.')
    }

    try {
      const res = await registerApi({
        name: regName.trim(),
        email: regEmail.trim(),
        phone: regPhone.trim(),
        password: regPassword,
      }).unwrap()

      toast.success('Account created successfully! Logging you in…')
      if (res.token && res.user) {
        setSession(res.token, res.user)
        navigate('/user', { replace: true })
      } else {
        setMode('login')
      }
    } catch (err) {
      toast.error(err?.data?.message || err.message || 'Registration failed.')
    }
  }

  // 3. Handle Send OTP Email
  const handleSendOtp = async (e) => {
    e.preventDefault()
    if (!forgotEmail.trim()) {
      return toast.error('Please enter your email address.')
    }

    try {
      const res = await forgotPasswordApi({ email: forgotEmail.trim() }).unwrap()
      toast.success(res.message || 'OTP sent to your email!')
      setOtpStep(2)
    } catch (err) {
      toast.error(err?.data?.message || err.message || 'Failed to send OTP.')
    }
  }

  // 4. Handle Verify OTP & Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (!otp.trim() || !newPassword) {
      return toast.error('Please enter the OTP and new password.')
    }
    if (newPassword.length < 6) {
      return toast.error('Password must be at least 6 characters.')
    }

    try {
      const res = await resetPasswordApi({
        email: forgotEmail.trim(),
        otp: otp.trim(),
        newPassword,
      }).unwrap()

      toast.success(res.message || 'Password reset successfully! Please sign in.')
      setLoginEmail(forgotEmail)
      setMode('login')
      setOtpStep(1)
      setOtp('')
      setNewPassword('')
    } catch (err) {
      toast.error(err?.data?.message || err.message || 'Invalid or expired OTP.')
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-navy-gradient px-4 py-10">
      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, #f5a623 0, transparent 40%), radial-gradient(circle at 80% 80%, #f5a623 0, transparent 40%)',
        }}
      />

      <div className="relative w-full max-w-md">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-navy-100/80 transition hover:text-white"
        >
          <FaArrowLeft /> Back to website
        </Link>

        <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-card-hover">
          {/* Header */}
          <div className="flex flex-col items-center text-center">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-navy-gradient text-gold-400 shadow-md">
              <FaFireAlt className="text-2xl" />
            </span>
            <h1 className="mt-4 font-display text-2xl font-extrabold text-navy-900">
              {mode === 'login' && 'Welcome Back'}
              {mode === 'register' && 'Create an Account'}
              {mode === 'forgot' && 'Reset Password'}
            </h1>
            <p className="mt-1 text-xs text-navy-500">
              {mode === 'login' && 'Sign in to access your dashboard & doorstep bookings'}
              {mode === 'register' && 'Join Lovely Gas Company for hassle-free appliance care'}
              {mode === 'forgot' && 'Receive a secure 6-digit OTP on your registered email'}
            </p>
          </div>

          {/* Mode Switcher Tabs (Login vs Register) */}
          {mode !== 'forgot' && (
            <div className="mt-6 grid grid-cols-2 gap-1 rounded-2xl bg-navy-50 p-1">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`rounded-xl py-2 text-xs font-bold transition ${
                  mode === 'login'
                    ? 'bg-white text-navy-900 shadow-sm'
                    : 'text-navy-500 hover:text-navy-800'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setMode('register')}
                className={`rounded-xl py-2 text-xs font-bold transition ${
                  mode === 'register'
                    ? 'bg-white text-navy-900 shadow-sm'
                    : 'text-navy-500 hover:text-navy-800'
                }`}
              >
                Create Account
              </button>
            </div>
          )}

          {/* 1. SIGN IN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              <div>
                <label className="label" htmlFor="a-email">Email Address</label>
                <div className="relative">
                  <FaEnvelope className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-300" />
                  <input
                    id="a-email"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="input pl-10"
                    placeholder="name@example.com"
                    autoComplete="username"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="label" htmlFor="a-pass">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(loginEmail)
                      setMode('forgot')
                      setOtpStep(1)
                    }}
                    className="text-xs font-semibold text-gold-600 hover:text-gold-700"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <FaLock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-300" />
                  <input
                    id="a-pass"
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="input pl-10 pr-10"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-700"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loginSubmitting}
                className="btn btn-primary w-full shadow-card"
              >
                {loginSubmitting ? 'Signing in…' : 'Sign In'}
              </button>
            </form>
          )}

          {/* 2. REGISTER / CREATE ACCOUNT FORM */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="mt-6 space-y-4">
              <div>
                <label className="label" htmlFor="r-name">Full Name *</label>
                <div className="relative">
                  <FaUser className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-300" />
                  <input
                    id="r-name"
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="input pl-10"
                    placeholder="Rahul Sharma"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="label" htmlFor="r-email">Email Address *</label>
                <div className="relative">
                  <FaEnvelope className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-300" />
                  <input
                    id="r-email"
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="input pl-10"
                    placeholder="rahul@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="label" htmlFor="r-phone">Mobile Phone (Optional)</label>
                <div className="relative">
                  <FaPhone className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-300" />
                  <input
                    id="r-phone"
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="input pl-10"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div>
                <label className="label" htmlFor="r-pass">Create Password (Min 6 chars) *</label>
                <div className="relative">
                  <FaLock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-300" />
                  <input
                    id="r-pass"
                    type={showPassword ? 'text' : 'password'}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="input pl-10 pr-10"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-700"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={regLoading}
                className="btn btn-primary w-full shadow-card"
              >
                {regLoading ? 'Creating Account…' : 'Create Customer Account'}
              </button>
            </form>
          )}

          {/* 3. FORGOT PASSWORD (EMAIL OTP & RESET) */}
          {mode === 'forgot' && (
            <div className="mt-6">
              {otpStep === 1 ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="label" htmlFor="f-email">Registered Email Address</label>
                    <div className="relative">
                      <FaEnvelope className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-300" />
                      <input
                        id="f-email"
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        className="input pl-10"
                        placeholder="your-email@example.com"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="btn btn-primary w-full shadow-card"
                  >
                    {forgotLoading ? (
                      <span className="inline-flex items-center gap-2"><FaSpinner className="animate-spin" /> Sending OTP…</span>
                    ) : (
                      'Send 6-Digit OTP'
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="btn btn-ghost btn-sm w-full text-xs"
                  >
                    ← Back to Sign In
                  </button>
                </form>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="rounded-xl border border-gold-300/40 bg-gold-50/60 p-3 text-xs text-navy-700">
                    <p>OTP has been sent to <strong>{forgotEmail}</strong>. Please check your inbox.</p>
                  </div>

                  <div>
                    <label className="label" htmlFor="f-otp">Enter 6-Digit OTP</label>
                    <div className="relative">
                      <FaKey className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-300" />
                      <input
                        id="f-otp"
                        type="text"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="input pl-10 tracking-widest font-mono text-base font-bold"
                        placeholder="123456"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label" htmlFor="f-newpass">New Password (Min 6 chars)</label>
                    <div className="relative">
                      <FaLock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-300" />
                      <input
                        id="f-newpass"
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="input pl-10 pr-10"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-700"
                      >
                        {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="btn btn-primary w-full shadow-card"
                  >
                    {resetLoading ? 'Resetting Password…' : 'Reset Password & Sign In'}
                  </button>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <button
                      type="button"
                      onClick={() => setOtpStep(1)}
                      className="text-navy-500 hover:text-navy-800"
                    >
                      Resend OTP
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="font-semibold text-gold-600 hover:text-gold-700"
                    >
                      Back to Sign In
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
