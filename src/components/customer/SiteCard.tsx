'use client'
import Link from 'next/link'
import { CampingSite } from '@/lib/types'
import { formatPrice } from '@/lib/utils'
import { Users, Maximize2, MapPin } from 'lucide-react'
import Badge from '@/components/ui/Badge'

interface SiteCardProps {
  site: CampingSite
  isAvailable?: boolean
  selectedDate?: string
}

export default function SiteCard({ site, isAvailable = true, selectedDate }: SiteCardProps) {
  const href = selectedDate
    ? `/sites/${site.id}?date=${selectedDate}`
    : `/sites/${site.id}`

  return (
    <div className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition-all hover:shadow-md ${!isAvailable ? 'opacity-50' : ''}`}>
      {/* 사이트 이미지 플레이스홀더 */}
      <div className="h-48 bg-gradient-to-br from-green-200 to-emerald-300 relative flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-2">{site.type === 'single' ? '⛺' : '🏕️'}</div>
          <span className="text-emerald-800 font-semibold text-sm">{site.name}</span>
        </div>
        {!isAvailable && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white font-bold text-lg bg-red-500 px-4 py-2 rounded-full">예약마감</span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <Badge variant={site.type === 'single' ? 'green' : 'amber'}>
            {site.type === 'single' ? '단독 사이트' : '두가족 사이트'}
          </Badge>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-lg mb-1">{site.name}</h3>
        <p className="text-gray-500 text-sm mb-3 line-clamp-2">{site.description}</p>

        <div className="flex flex-wrap gap-2 mb-3">
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <MapPin size={14} className="text-green-600" />
            {site.location}
          </div>
        </div>

        <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Maximize2 size={14} className="text-green-600" />
            {site.size}
          </div>
          <div className="flex items-center gap-1">
            <Users size={14} className="text-green-600" />
            적정 {site.capacity}인
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {site.features.slice(0, 3).map(f => (
            <span key={f} className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">{f}</span>
          ))}
          {site.features.length > 3 && (
            <span className="text-xs bg-gray-50 text-gray-500 px-2 py-0.5 rounded-full">+{site.features.length - 3}</span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-green-700">{formatPrice(site.price)}</span>
            <span className="text-gray-400 text-sm"> / 1박</span>
          </div>
          {isAvailable ? (
            <Link href={href} className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors">
              예약하기
            </Link>
          ) : (
            <span className="text-gray-400 text-sm">선택 불가</span>
          )}
        </div>
      </div>
    </div>
  )
}
