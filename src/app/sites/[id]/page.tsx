import { notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/customer/Header'
import { CAMPING_SITES } from '@/lib/constants'
import { MapPin, Users, Maximize2, ArrowLeft, CheckCircle } from 'lucide-react'
import Badge from '@/components/ui/Badge'

export default async function SiteDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ date?: string }>
}) {
  const { id } = await params
  const { date } = await searchParams
  const site = CAMPING_SITES.find(s => s.id === parseInt(id))
  if (!site) notFound()

  const reservationHref = date
    ? `/reservation?site=${site.id}&date=${date}`
    : `/reservation?site=${site.id}`

  return (
    <div className="min-h-screen">
      <Header />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link href="/sites" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
          <ArrowLeft size={16} /> 사이트 목록으로
        </Link>

        {/* 이미지 플레이스홀더 */}
        <div className="h-64 bg-gradient-to-br from-green-200 to-emerald-300 rounded-2xl flex items-center justify-center mb-6 relative">
          <div className="text-center">
            <div className="text-7xl mb-2">{site.type === 'single' ? '⛺' : '🏕️'}</div>
            <span className="text-emerald-800 font-semibold">{site.name}</span>
          </div>
          <div className="absolute top-4 left-4">
            <Badge variant={site.type === 'single' ? 'green' : 'amber'}>
              {site.type === 'single' ? '단독 사이트' : '두가족 사이트'}
            </Badge>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border mb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">{site.name}</h1>
          <p className="text-gray-600 mb-5 leading-relaxed">{site.description}</p>

          <div className="grid grid-cols-2 gap-4 mb-5">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin size={16} className="text-green-600" />
              <div>
                <div className="text-xs text-gray-400">위치</div>
                <div>{site.location}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Maximize2 size={16} className="text-green-600" />
              <div>
                <div className="text-xs text-gray-400">사이즈</div>
                <div>{site.size}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users size={16} className="text-green-600" />
              <div>
                <div className="text-xs text-gray-400">적정 인원</div>
                <div>최대 {site.capacity}인</div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-2 text-sm">사이트 특징</h3>
            <div className="flex flex-wrap gap-2">
              {site.features.map(f => (
                <div key={f} className="flex items-center gap-1 text-sm text-green-700 bg-green-50 px-3 py-1 rounded-full">
                  <CheckCircle size={13} />
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 가격 및 예약 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border sticky bottom-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-3xl font-bold text-green-700">{site.price.toLocaleString()}원</span>
              <span className="text-gray-400 text-sm"> / 1박</span>
            </div>
          </div>
          <Link
            href={reservationHref}
            className="block w-full bg-green-600 text-white text-center py-3.5 rounded-xl font-bold text-lg hover:bg-green-700 transition-colors"
          >
            이 사이트 예약하기
          </Link>
        </div>
      </div>
    </div>
  )
}
