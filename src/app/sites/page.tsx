'use client'
import { useState } from 'react'
import Header from '@/components/customer/Header'
import SiteCard from '@/components/customer/SiteCard'
import { CAMPING_SITES } from '@/lib/constants'

export default function SitesPage() {
  const [filter, setFilter] = useState<'all' | 'single' | 'family'>('all')
  const filtered = filter === 'all' ? CAMPING_SITES : CAMPING_SITES.filter(s => s.type === filter)

  return (
    <div className="min-h-screen">
      <Header />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">캠핑 사이트</h1>
        <p className="text-gray-500 mb-6">법흥계곡캠핑오늘의 10개 사이트를 둘러보세요</p>

        {/* 필터 */}
        <div className="flex gap-2 mb-6">
          {(['all', 'single', 'family'] as const).map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                filter === type
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-600 border hover:border-green-400'
              }`}
            >
              {type === 'all' ? '전체' : type === 'single' ? '단독 사이트' : '두가족 사이트'}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(site => (
            <SiteCard key={site.id} site={site} />
          ))}
        </div>
      </div>
    </div>
  )
}
