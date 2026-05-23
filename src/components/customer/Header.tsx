import Link from 'next/link'
import { CAMPING_INFO } from '@/lib/constants'
import { Tent } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center">
            <Tent size={20} className="text-white" />
          </div>
          <div>
            <div className="font-bold text-gray-900 leading-tight text-sm">{CAMPING_INFO.name}</div>
            <div className="text-xs text-gray-400">강원 영월</div>
          </div>
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/sites" className="text-sm text-gray-600 hover:text-green-700 font-medium transition-colors">
            사이트 보기
          </Link>
          <Link href="/reservation" className="bg-green-600 text-white text-sm px-4 py-2 rounded-xl font-semibold hover:bg-green-700 transition-colors">
            예약하기
          </Link>
        </nav>
      </div>
    </header>
  )
}
