///admin/login
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [adminKey, setAdminKey] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showAdminKey, setShowAdminKey] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const res = await signIn('credentials', { email, password, adminKey, redirect: false })
    setLoading(false)
    if (res?.error) {
      setError(res.error)
      return
    }
    router.push('/admin')
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }} className="flex items-center justify-center bg-slate-50">
      {/* Background image — inline styles so it always renders regardless of Tailwind config */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: "url('/images/dashboard.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.15,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Login card sits above the background */}
      <div style={{ position: 'relative', zIndex: 1 }} className="w-full max-w-sm px-4">
        <Card className="p-8 w-full">
          <h1 className="text-xl font-semibold mb-1">Admin Access</h1>
          <p className="text-sm text-slate-500 mb-6">Restricted login</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />

            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div className="relative">
              <Input
                type={showAdminKey ? 'text' : 'password'}
                placeholder="Admin Access Key"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowAdminKey((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                tabIndex={-1}
              >
                {showAdminKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Verifying...' : 'Log In'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}