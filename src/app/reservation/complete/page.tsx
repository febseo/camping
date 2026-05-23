'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/customer/Header'
import { Reservation } from '@/lib/types'
import { CAMPING_SITES } from '@/lib/constants'
import { formatPrice, formatDate } from '@/lib/utils'
import { CheckCircle, MapPin, Calendar, User, Phone, Car } from 'lucide-react'

function CompleteContent() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const [reservation, setReservation] = useState<Reservation | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    fetch(`/api/reservations/${id}`)
      .then(r => r.json())
      .then(setReservation)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  const site = reservation ? CAMPING_SITES.find(s => s.id === reservation.site_id) : null

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-gray-400">
      예약 확인 중...
    </div>
  )

  return (
    <div className="min-h-screen">
      <Header />
      <div className="max-w-lg mx-auto px-4 py-12 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={40} className="text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">예약이 완료되었습니다!</h1>
        <p className="text-gray-500 mb-8">예약 정보를 확인해주세요</p>

        {reservation && site && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border text-left mb-6">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b">
              <span className="text-2xl">{site.type === 'single' ? '⛺' : '🏕️'}</span>
              <div>
                <div className="font-bold text-gray-900">{site.name}</div>
                <div className="text-xs text-gray-500">{site.type === 'single' ? '단독 사이트' : '두가족 사이트'}</div>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-gray-600">
                <Calendar size={16} className="text-green-600 flex-shrink-0" />
                <span className="text-gray-400 w-16 flex-shrink-0">날짜</span>
                <span className="font-medium text-gray-900">{formatDate(reservation.check_in_date)}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <MapPin size={16} className="text-green-600 flex-shrink-0" />
                <span className="text-gray-400 w-16 flex-shrink-0">위치</span>
                <span className="font-medium text-gray-900">{site.location}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <User size={16} className="text-green-600 flex-shrink-0" />
                <span className="text-gray-400 w-16 flex-shrink-0">이름</span>
                <span className="font-medium text-gray-900">{reservation.customer_name}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Phone size={16} className="text-green-600 flex-shrink-0" />
                <span className="text-gray-400 w-16 flex-shrink-0">연락처</span>
                <span className="font-medium text-gray-900">{reservation.customer_phone}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Car size={16} className="text-green-600 flex-shrink-0" />
                <span className="text-gray-400 w-16 flex-shrink-0">차량번호</span>
                <span className="font-medium text-gray-900">{reservation.car_number}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              {reservation.discount_amount > 0 && (
                <div className="flex justify-between text-sm text-amber-600 mb-1">
                  <span>이벤트 할인</span>
                  <span>-{formatPrice(reservation.discount_amount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-gray-900 text-lg">
                <span>결제 금액</span>
                <span className="text-green-700">{formatPrice(reservation.total_price)}</span>
              </div>
            </div>

            <div className="mt-4 bg-blue-50 rounded-xl p-3 text-xs text-blue-700">
              <strong>현장 사이트 변경 안내:</strong> 당일 현장에서 관리자에게 요청하시면 빈 사이트로 변경 가능합니다.
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <Link href="/" className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
            홈으로
          </Link>
          <Link href="/reservation" className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors">
            추가 예약
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function CompletePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400">로딩 중...</div>}>
      <CompleteContent />
    </Suspense>
  )
}
