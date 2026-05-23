'use client'
import { useEffect, useState } from 'react'
import { Reservation } from '@/lib/types'
import { CAMPING_SITES } from '@/lib/constants'
import { formatPrice, formatDate, toDateString } from '@/lib/utils'
import { Calendar, ArrowLeftRight, X, ChevronDown } from 'lucide-react'
import Badge from '@/components/ui/Badge'

export default function DashboardPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [date, setDate] = useState(toDateString(new Date()))
  const [loading, setLoading] = useState(true)
  const [changingId, setChangingId] = useState<string | null>(null)
  const [newSiteId, setNewSiteId] = useState<number>(0)
  const [changeNote, setChangeNote] = useState('')
  const [saving, setSaving] = useState(false)

  const fetchReservations = async () => {
    setLoading(true)
    const res = await fetch(`/api/reservations?date=${date}`)
    const data = await res.json()
    setReservations(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { fetchReservations() }, [date])

  const handleCancel = async (id: string) => {
    if (!confirm('이 예약을 취소하시겠습니까?')) return
    await fetch(`/api/reservations/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'cancelled' }),
    })
    fetchReservations()
  }

  const handleChangeSite = async (id: string) => {
    if (!newSiteId) return alert('변경할 사이트를 선택하세요.')
    setSaving(true)
    const res = await fetch(`/api/reservations/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ new_site_id: newSiteId, notes: changeNote }),
    })
    if (res.ok) {
      setChangingId(null)
      setNewSiteId(0)
      setChangeNote('')
      fetchReservations()
    } else {
      const d = await res.json()
      alert(d.error || '변경 실패')
    }
    setSaving(false)
  }

  const bookedSiteIds = reservations.filter(r => r.status === 'confirmed').map(r => r.site_id)
  const totalRevenue = reservations.filter(r => r.status !== 'cancelled').reduce((sum, r) => sum + r.total_price, 0)

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">예약 현황</h1>
        <div className="flex items-center gap-2">
          <Calendar size={15} className="text-gray-400" />
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="border rounded-xl px-2 py-1.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-3 gap-2 md:gap-4 mb-4 md:mb-6">
        <div className="bg-white rounded-xl p-3 md:p-4 shadow-sm border">
          <div className="text-xs text-gray-400 mb-1">예약 건수</div>
          <div className="text-xl md:text-2xl font-bold text-gray-900">{reservations.filter(r => r.status !== 'cancelled').length}건</div>
        </div>
        <div className="bg-white rounded-xl p-3 md:p-4 shadow-sm border">
          <div className="text-xs text-gray-400 mb-1">잔여 사이트</div>
          <div className="text-xl md:text-2xl font-bold text-green-600">{10 - bookedSiteIds.length}개</div>
        </div>
        <div className="bg-white rounded-xl p-3 md:p-4 shadow-sm border">
          <div className="text-xs text-gray-400 mb-1">당일 매출</div>
          <div className="text-lg md:text-2xl font-bold text-gray-900 truncate">{formatPrice(totalRevenue)}</div>
        </div>
      </div>

      {/* 사이트 현황 그리드 */}
      <div className="bg-white rounded-xl p-3 md:p-4 shadow-sm border mb-4 md:mb-6">
        <h2 className="font-semibold text-gray-800 mb-3 text-sm">사이트 현황 ({formatDate(date)})</h2>
        <div className="grid grid-cols-5 md:grid-cols-5 gap-1.5 md:gap-2">
          {CAMPING_SITES.map(site => {
            const reserved = reservations.find(r => r.site_id === site.id && r.status !== 'cancelled')
            return (
              <div
                key={site.id}
                className={`p-1.5 md:p-2 rounded-lg border text-center text-xs ${
                  reserved ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
                }`}
              >
                <div className="font-medium text-gray-800 truncate text-xs">{site.name.split(' ')[0]}</div>
                <div className={`text-xs ${reserved ? 'text-red-600' : 'text-green-600'}`}>
                  {reserved ? '예약' : '빈자리'}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 예약 목록 - 모바일: 카드형, 데스크톱: 테이블 */}
      <div>
        <h2 className="font-semibold text-gray-800 mb-3 text-sm">예약 목록</h2>

        {loading ? (
          <div className="bg-white rounded-xl p-8 text-center text-gray-400 shadow-sm border">로딩 중...</div>
        ) : reservations.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center text-gray-400 shadow-sm border">해당 날짜 예약이 없습니다.</div>
        ) : (
          <>
            {/* 모바일 카드 */}
            <div className="md:hidden space-y-3">
              {reservations.map(r => {
                const site = CAMPING_SITES.find(s => s.id === r.site_id)
                const originalSite = r.original_site_id ? CAMPING_SITES.find(s => s.id === r.original_site_id) : null
                return (
                  <div key={r.id} className={`bg-white rounded-xl p-4 shadow-sm border ${r.status === 'cancelled' ? 'opacity-50' : ''}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-semibold text-gray-900">{site?.name ?? `사이트 ${r.site_id}`}</div>
                        {originalSite && <div className="text-xs text-amber-600 mt-0.5">원래: {originalSite.name}</div>}
                      </div>
                      <Badge variant={r.status === 'confirmed' ? 'green' : r.status === 'changed' ? 'blue' : 'red'}>
                        {r.status === 'confirmed' ? '확정' : r.status === 'changed' ? '변경됨' : '취소됨'}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-y-1.5 text-sm text-gray-600 mb-3">
                      <div><span className="text-gray-400 text-xs">예약자</span><br />{r.customer_name}</div>
                      <div><span className="text-gray-400 text-xs">연락처</span><br />{r.customer_phone}</div>
                      <div><span className="text-gray-400 text-xs">차량번호</span><br />{r.car_number}</div>
                      <div>
                        <span className="text-gray-400 text-xs">금액</span><br />
                        <span className="font-medium text-green-700">{formatPrice(r.total_price)}</span>
                        {r.discount_amount > 0 && <span className="text-xs text-amber-600 ml-1">(-{formatPrice(r.discount_amount)})</span>}
                      </div>
                    </div>
                    {r.status !== 'cancelled' && (
                      <div className="flex gap-2 pt-2 border-t">
                        <button
                          onClick={() => { setChangingId(changingId === r.id ? null : r.id); setNewSiteId(0) }}
                          className="flex-1 flex items-center justify-center gap-1 text-sm text-blue-600 border border-blue-200 py-2 rounded-lg hover:bg-blue-50"
                        >
                          <ArrowLeftRight size={14} /> 사이트 변경
                        </button>
                        <button
                          onClick={() => handleCancel(r.id)}
                          className="flex-1 flex items-center justify-center gap-1 text-sm text-red-600 border border-red-200 py-2 rounded-lg hover:bg-red-50"
                        >
                          <X size={14} /> 예약 취소
                        </button>
                      </div>
                    )}
                    {changingId === r.id && (
                      <div className="mt-3 pt-3 border-t space-y-2">
                        <select
                          value={newSiteId}
                          onChange={e => setNewSiteId(parseInt(e.target.value))}
                          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                          <option value={0}>변경할 사이트 선택</option>
                          {CAMPING_SITES
                            .filter(s => s.id !== r.site_id && !bookedSiteIds.includes(s.id))
                            .map(s => (
                              <option key={s.id} value={s.id}>{s.name} ({s.type === 'single' ? '단독' : '두가족'})</option>
                            ))
                          }
                        </select>
                        <input
                          value={changeNote}
                          onChange={e => setChangeNote(e.target.value)}
                          placeholder="메모 (선택)"
                          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleChangeSite(r.id)}
                            disabled={saving}
                            className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                          >
                            {saving ? '저장 중...' : '변경 확정'}
                          </button>
                          <button onClick={() => setChangingId(null)} className="px-4 border text-gray-500 rounded-lg text-sm">
                            취소
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* 데스크톱 테이블 */}
            <div className="hidden md:block bg-white rounded-xl shadow-sm border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">사이트</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">예약자</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">연락처</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">차량번호</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">금액</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">상태</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {reservations.map(r => {
                    const site = CAMPING_SITES.find(s => s.id === r.site_id)
                    const originalSite = r.original_site_id ? CAMPING_SITES.find(s => s.id === r.original_site_id) : null
                    return (
                      <>
                        <tr key={r.id} className={r.status === 'cancelled' ? 'opacity-50 bg-gray-50' : ''}>
                          <td className="px-4 py-3">
                            <div className="font-medium text-gray-900">{site?.name ?? `사이트 ${r.site_id}`}</div>
                            {originalSite && <div className="text-xs text-amber-600">원래: {originalSite.name}</div>}
                          </td>
                          <td className="px-4 py-3 text-gray-700">{r.customer_name}</td>
                          <td className="px-4 py-3 text-gray-700">{r.customer_phone}</td>
                          <td className="px-4 py-3 text-gray-700">{r.car_number}</td>
                          <td className="px-4 py-3 text-gray-700">
                            <div>{formatPrice(r.total_price)}</div>
                            {r.discount_amount > 0 && <div className="text-xs text-amber-600">-{formatPrice(r.discount_amount)} 할인</div>}
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant={r.status === 'confirmed' ? 'green' : r.status === 'changed' ? 'blue' : 'red'}>
                              {r.status === 'confirmed' ? '확정' : r.status === 'changed' ? '변경됨' : '취소됨'}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            {r.status !== 'cancelled' && (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => { setChangingId(changingId === r.id ? null : r.id); setNewSiteId(0) }}
                                  className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                                >
                                  <ArrowLeftRight size={13} /> 변경
                                </button>
                                <button
                                  onClick={() => handleCancel(r.id)}
                                  className="flex items-center gap-1 text-xs text-red-600 hover:text-red-800"
                                >
                                  <X size={13} /> 취소
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                        {changingId === r.id && (
                          <tr key={`change-${r.id}`} className="bg-blue-50">
                            <td colSpan={7} className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-700 font-medium">사이트 변경:</span>
                                <select
                                  value={newSiteId}
                                  onChange={e => setNewSiteId(parseInt(e.target.value))}
                                  className="border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                >
                                  <option value={0}>사이트 선택</option>
                                  {CAMPING_SITES
                                    .filter(s => s.id !== r.site_id && !bookedSiteIds.includes(s.id))
                                    .map(s => (
                                      <option key={s.id} value={s.id}>{s.name} ({s.type === 'single' ? '단독' : '두가족'})</option>
                                    ))
                                  }
                                </select>
                                <input
                                  value={changeNote}
                                  onChange={e => setChangeNote(e.target.value)}
                                  placeholder="메모 (선택)"
                                  className="border rounded-lg px-3 py-1.5 text-sm flex-1 focus:outline-none"
                                />
                                <button
                                  onClick={() => handleChangeSite(r.id)}
                                  disabled={saving}
                                  className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                                >
                                  {saving ? '저장 중...' : '변경 확정'}
                                </button>
                                <button onClick={() => setChangingId(null)} className="text-gray-400 hover:text-gray-600">
                                  <X size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
