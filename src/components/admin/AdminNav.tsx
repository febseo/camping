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
    <>
      {/* 데스크톱 사이드바 */}
      <aside className="hidden md:flex w-56 bg-gray-900 min-h-screen flex-col p-4">
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
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <LogOut size={16} />
          로그아웃
        </button>
      </aside>

      {/* 모바일 상단 헤더 */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-gray-900 flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-green-500 rounded-lg flex items-center justify-center">
            <Tent size={14} className="text-white" />
          </div>
          <span className="text-white text-sm font-bold">법흥계곡 관리자</span>
        </div>
        <button onClick={logout} className="text-gray-400 p-1">
          <LogOut size={18} />
        </button>
      </header>

      {/* 모바일 하단 탭바 */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-gray-900 border-t border-gray-800 flex">
        {nav.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs transition-colors ${
              pathname === href ? 'text-green-400' : 'text-gray-400'
            }`}
          >
            <Icon size={20} />
            {label}
          </Link>
        ))}
      </nav>
    </>
  )
}
