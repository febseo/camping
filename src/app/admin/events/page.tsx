'use client'
import { useEffect, useState } from 'react'
import { Event } from '@/lib/types'
import { formatPrice, formatDateShort } from '@/lib/utils'
import { Plus, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'
import Badge from '@/components/ui/Badge'

const EMPTY_EVENT = {
  name: '',
  description: '',
  start_date: '',
  end_date: '',
  discount_type: 'percent' as 'percent' | 'fixed',
  discount_value: 10,
  applies_to: 'all' as 'single' | 'family' | 'all',
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_EVENT)
  const [saving, setSaving] = useState(false)

  const fetchAll = async () => {
    setLoading(true)
    // 관리자는 모든 이벤트 조회 (비활성 포함)
    const res = await fetch('/api/events/all')
    const data = await res.json()
    setEvents(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { fetchAll() }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      setShowForm(false)
      setForm(EMPTY_EVENT)
      fetchAll()
    } else {
      alert('이벤트 생성 실패')
    }
    setSaving(false)
  }

  const handleToggle = async (ev: Event) => {
    await fetch(`/api/events/${ev.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !ev.is_active }),
    })
    fetchAll()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('이 이벤트를 삭제하시겠습니까?')) return
    await fetch(`/api/events/${id}`, { method: 'DELETE' })
    fetchAll()
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h1 className="text-2xl font-bold text-gray-900">이벤트 / 할인 관리</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors"
        >
          <Plus size={16} /> 이벤트 추가
        </button>
      </div>

      {/* 이벤트 생성 폼 */}
      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl p-5 shadow-sm border mb-6">
          <h2 className="font-semibold text-gray-800 mb-4">새 이벤트 설정</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div className="col-span-2">
              <label className="block text-xs text-gray-500 mb-1">이벤트 이름 *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="예: 여름 성수기 할인"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-gray-500 mb-1">설명</label>
              <input
                type="text"
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="이벤트 상세 설명"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">시작일 *</label>
              <input
                type="date"
                required
                value={form.start_date}
                onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">종료일 *</label>
              <input
                type="date"
                required
                value={form.end_date}
                onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">할인 유형</label>
              <select
                value={form.discount_type}
                onChange={e => setForm(f => ({ ...f, discount_type: e.target.value as 'percent' | 'fixed' }))}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none"
              >
                <option value="percent">퍼센트 (%)</option>
                <option value="fixed">정액 (원)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                할인 값 ({form.discount_type === 'percent' ? '%' : '원'}) *
              </label>
              <input
                type="number"
                required
                min={1}
                max={form.discount_type === 'percent' ? 100 : 999999}
                value={form.discount_value}
                onChange={e => setForm(f => ({ ...f, discount_value: parseInt(e.target.value) }))}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">적용 사이트</label>
              <select
                value={form.applies_to}
                onChange={e => setForm(f => ({ ...f, applies_to: e.target.value as 'single' | 'family' | 'all' }))}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none"
              >
                <option value="all">전체</option>
                <option value="single">단독 사이트만</option>
                <option value="family">두가족 사이트만</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              disabled={saving}
              className="bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
            >
              {saving ? '저장 중...' : '저장'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="border text-gray-600 px-6 py-2 rounded-lg text-sm hover:bg-gray-50"
            >
              취소
            </button>
          </div>
        </form>
      )}

      {/* 이벤트 목록 */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {loading ? (
          <div className="text-center py-10 text-gray-400">로딩 중...</div>
        ) : events.length === 0 ? (
          <div className="text-center py-10 text-gray-400">등록된 이벤트가 없습니다.</div>
        ) : (
          <div className="divide-y">
            {events.map(ev => (
              <div key={ev.id} className="px-4 py-4 md:px-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">{ev.name}</span>
                      <Badge variant={ev.is_active ? 'green' : 'gray'}>
                        {ev.is_active ? '활성' : '비활성'}
                      </Badge>
                      <Badge variant="gray">
                        {ev.applies_to === 'all' ? '전체' : ev.applies_to === 'single' ? '단독만' : '두가족만'}
                      </Badge>
                    </div>
                    {ev.description && <p className="text-sm text-gray-500 mb-1">{ev.description}</p>}
                    <div className="text-xs text-gray-400">
                      {formatDateShort(ev.start_date)} ~ {formatDateShort(ev.end_date)} ·{' '}
                      {ev.discount_type === 'percent'
                        ? `${ev.discount_value}% 할인`
                        : `${formatPrice(ev.discount_value)} 할인`}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleToggle(ev)}
                    className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-colors ${
                      ev.is_active
                        ? 'text-green-700 bg-green-50 hover:bg-green-100'
                        : 'text-gray-500 bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    {ev.is_active ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                    {ev.is_active ? '비활성화' : '활성화'}
                  </button>
                  <button
                    onClick={() => handleDelete(ev.id)}
                    className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
