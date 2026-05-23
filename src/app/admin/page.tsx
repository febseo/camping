'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Tent, Lock } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      router.push('/admin/dashboard')
    } else {
      setError('비밀번호가 올바르지 않습니다.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Tent size={28} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">관리자 로그인</h1>
          <p className="text-sm text-gray-400 mt-1">법흥계곡캠핑오늘</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1.5">비밀번호</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="관리자 비밀번호"
                className="w-full pl-9 pr-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                required
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {loading ? '확인 중...' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  )
}
