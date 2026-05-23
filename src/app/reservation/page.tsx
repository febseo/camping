'use client'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Header from '@/components/customer/Header'
import { CAMPING_SITES } from '@/lib/constants'
import { CampingSite, Event } from '@/lib/types'
import { formatPrice, calculateDiscount, toDateString } from '@/lib/utils'
import { ChevronDown, Tag } from 'lucide-react'

function ReservationForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initSiteId = searchParams.get('site') ? parseInt(searchParams.get('site')!) : null
  const initDate = searchParams.get('date') || toDateString(new Date())

  const [selectedSite, setSelectedSite] = useState<CampingSite | null>(
    initSiteId ? CAMPING_SITES.find(s => s.id === initSiteId) ?? null : null
  )
  const [date, setDate] = useState(initDate)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [carNumber, setCarNumber] = useState('')
  const [events, setEvents] = useState<Event[]>([])
  const [activeEvent, setActiveEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [bookedSiteIds, setBookedSiteIds] = useState<number[]>([])

  // 이벤트 로드
  useEffect(() => {
    fetch('/api/events').then(r => r.json()).then(setEvents).catch(() => {})
  }, [])

  // 날짜/사이트 변경 시 예약된 사이트 조회
  useEffect(() => {
    if (!date) return
    fetch(`/api/reservations/available?date=${date}`)
      .then(r => r.json())
      .then(data => setBookedSiteIds(data.bookedSiteIds ?? []))
      .catch(() => {})
  }, [date])

  // 이벤트 적용 계산
  useEffect(() => {
    if (!selectedSite || !date || events.length === 0) {
      setActiveEvent(null)
      return
    }
    const ev = events.find(e => {
      if (!e.is_active) return false
      if (date < e.start_date || date > e.end_date) return false
      if (e.applies_to !== 'all' && e.applies_to !== selectedSite.type) return false
      return true
    }) ?? null
    setActiveEvent(ev)
  }, [selectedSite, date, events])

  const discount = activeEvent && selectedSite ? calculateDiscount(selectedSite.price, activeEvent) : 0
  const finalPrice = selectedSite ? selectedSite.price - discount : 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSite) return setError('사이트를 선택해주세요.')
    if (!date) return setError('날짜를 선택해주세요.')
    if (!name.trim()) return setError('이름을 입력해주세요.')
    if (!phone.trim()) return setError('연락처를 입력해주세요.')
    if (!carNumber.trim()) return setError('차량번호를 입력해주세요.')

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          site_id: selectedSite.id,
          check_in_date: date,
          customer_name: name,
          customer_phone: phone,
          car_number: carNumber,
          total_price: finalPrice,
          discount_amount: discount,
          event_id: activeEvent?.id ?? null,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '예약 실패')
      router.push(`/reservation/complete?id=${data.id}`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '예약 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const today = toDateString(new Date())

  return (
    <div className="min-h-screen">
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">예약하기</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 날짜 선택 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              날짜 선택 <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={date}
              min={today}
              onChange={e => setDate(e.target.value)}
              className="w-full border rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* 사이트 선택 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              사이트 선택 <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 gap-2">
              {CAMPING_SITES.map(site => {
                const isBooked = bookedSiteIds.includes(site.id)
                const isSelected = selectedSite?.id === site.id
                return (
                  <button
                    key={site.id}
                    type="button"
                    disabled={isBooked}
                    onClick={() => !isBooked && setSelectedSite(site)}
                    className={`flex items-center justify-between p-3 rounded-xl border-2 text-left transition-all ${
                      isBooked
                        ? 'opacity-40 cursor-not-allowed bg-gray-50 border-gray-200'
                        : isSelected
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{site.type === 'single' ? '⛺' : '🏕️'}</span>
                      <div>
                        <div className="font-medium text-gray-900 text-sm">{site.name}</div>
                        <div className="text-xs text-gray-500">{site.location} · 최대 {site.capacity}인</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-sm text-green-700">{formatPrice(site.price)}</div>
                      {isBooked && <div className="text-xs text-red-500">예약마감</div>}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 할인 이벤트 표시 */}
          {activeEvent && selectedSite && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
              <Tag size={18} className="text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-semibold text-amber-800 text-sm">{activeEvent.name} 이벤트 할인 적용!</div>
                <div className="text-amber-600 text-xs mt-0.5">{activeEvent.description}</div>
                <div className="text-amber-700 text-sm mt-1 font-medium">
                  {formatPrice(selectedSite.price)} → <span className="text-lg font-bold">{formatPrice(finalPrice)}</span>
                  <span className="text-xs ml-1">(-{formatPrice(discount)})</span>
                </div>
              </div>
            </div>
          )}

          {/* 고객 정보 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border space-y-4">
            <h2 className="font-semibold text-gray-800">고객 정보</h2>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                이름 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="예약자 이름"
                className="w-full border rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                연락처 <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="010-0000-0000"
                className="w-full border rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                차량번호 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={carNumber}
                onChange={e => setCarNumber(e.target.value)}
                placeholder="12가 3456"
                className="w-full border rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
          </div>

          {/* 최종 금액 */}
          {selectedSite && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>사이트 금액</span>
                <span>{formatPrice(selectedSite.price)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-amber-600 mb-1">
                  <span>이벤트 할인</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-gray-900 text-lg border-t border-green-200 pt-2 mt-2">
                <span>최종 결제금액</span>
                <span className="text-green-700">{formatPrice(finalPrice)}</span>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !selectedSite}
            className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '예약 중...' : '예약 완료하기'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function ReservationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400">로딩 중...</div>}>
      <ReservationForm />
    </Suspense>
  )
}
