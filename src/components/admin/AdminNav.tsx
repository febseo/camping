'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Tag, Tent, LogOut } from 'lucide-react'

const nav = [
  { href: '/admin/dashboard', label: '예약 현황', icon: LayoutDashboard },
  { href: '/admin/events', label: '이벤트 관리', icon: Tag },
]

export default function AdminNav() {
  const pathname = usePathname()
  const router = useRouter()

  const logout = async () => {
    await fetch('/api/admin/login', { method: 'DELETE' })
    router.push('/admin')
  }

  return (
    <aside className="w-56 bg-gray-900 min-h-screen flex flex-col p-4">
      <div className="flex items-center gap-2 mb-8 px-2">
        <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
          <Tent size={16} className="text-white" />
        </div>
        <div>
          <div className="text-white text-xs font-bold leading-tight">법흥계곡</div>
          <div className="text-gray-400 text-xs">관리자</div>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {nav.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
              pathname === href
                ? 'bg-green-600 text-white font-medium'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <Icon size={16} />
            {label}
          </Link>
        ))}
      </nav>

      <button
        onClick={logout}
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors mt-auto"
      >
        <LogOut size={16} />
        로그아웃
      </button>
    </aside>
  )
}
