import { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import api from '../services/api'
import { setToken } from '../utils/storage'

export default function Login() {
  const [email, setEmail] = useState('admin@clms.com')
  const [password, setPassword] = useState('admin123')
  const [loading, setLoading] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', { email, password })
      setToken(data.token)
      toast.success('Welcome back')
      setTimeout(() => (window.location.href = '/'), 300)
    } catch {
      // error toast handled by interceptor; keep minimal here
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-500/10 via-transparent to-primary-600/10 p-4">
      <Toaster position="top-right" />
      <form onSubmit={submit} className="glass w-full max-w-sm space-y-4 p-6">
        <div className="text-center text-xl font-semibold">CLMS Login</div>
        <div>
          <label className="mb-1 block text-sm">Email</label>
          <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-sm">Password</label>
          <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button disabled={loading} className="btn-primary w-full">
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
        <div className="text-xs text-gray-500">Default admin is seeded on server start.</div>
      </form>
    </div>
  )
}
