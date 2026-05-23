import Link from 'next/link'
import Header from '@/components/customer/Header'
import { CAMPING_INFO, CAMPING_SITES } from '@/lib/constants'
import { MapPin, Clock, Phone, Trees, Waves, Star } from 'lucide-react'

export default function HomePage() {
  const singleSites = CAMPING_SITES.filter(s => s.type === 'single')
  const familySites = CAMPING_SITES.filter(s => s.type === 'family')

  return (
    <div className="min-h-screen">
      <Header />

      {/* 히어로 */}
      <section className="bg-gradient-to-br from-green-800 via-green-700 to-emerald-600 text-white py-12 md:py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full text-sm mb-4 md:mb-6">
            <MapPin size={14} />
            강원 영월 법흥계곡
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4 leading-tight">
            법흥계곡캠핑오늘
          </h1>
          <p className="text-green-100 text-base md:text-lg mb-6 md:mb-8 leading-relaxed">
            맑은 계곡물 소리와 울창한 숲이 어우러진<br />
            영월 최고의 자연 캠핑장에서 특별한 하룻밤을
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/reservation"
              className="bg-white text-green-700 px-8 py-3.5 rounded-2xl font-bold text-lg hover:bg-green-50 transition-colors shadow-lg"
            >
              지금 예약하기
            </Link>
            <Link
              href="/sites"
              className="border-2 border-white text-white px-8 py-3.5 rounded-2xl font-bold text-lg hover:bg-white/10 transition-colors"
            >
              사이트 둘러보기
            </Link>
          </div>
        </div>
      </section>

      {/* 특징 카드 */}
      <section className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-3 gap-3 md:gap-4 mb-8 md:mb-12">
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border text-center">
            <Waves className="w-6 h-6 md:w-8 md:h-8 text-blue-500 mx-auto mb-2 md:mb-3" />
            <h3 className="font-bold text-gray-900 mb-1 text-sm md:text-base">계곡 인접</h3>
            <p className="text-gray-500 text-xs md:text-sm hidden md:block">맑고 시원한 계곡에서 물놀이와 트레킹을 즐기세요</p>
          </div>
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border text-center">
            <Trees className="w-6 h-6 md:w-8 md:h-8 text-green-500 mx-auto mb-2 md:mb-3" />
            <h3 className="font-bold text-gray-900 mb-1 text-sm md:text-base">울창한 숲</h3>
            <p className="text-gray-500 text-xs md:text-sm hidden md:block">깊은 숲 속에서 도시의 소음을 잊고 자연을 만끽하세요</p>
          </div>
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border text-center">
            <Star className="w-6 h-6 md:w-8 md:h-8 text-amber-500 mx-auto mb-2 md:mb-3" />
            <h3 className="font-bold text-gray-900 mb-1 text-sm md:text-base">별 관측</h3>
            <p className="text-gray-500 text-xs md:text-sm hidden md:block">빛 공해 없는 맑은 하늘에서 은하수를 감상하세요</p>
          </div>
        </div>

        {/* 사이트 타입 */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">캠핑 사이트 안내</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <div className="text-3xl mb-3">⛺</div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-bold text-gray-900 text-lg">단독 사이트</h3>
              <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">{singleSites.length}개</span>
            </div>
            <p className="text-gray-500 text-sm mb-4">한 팀을 위한 프라이빗 사이트. 조용하고 아늑한 분위기를 즐기실 수 있습니다.</p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-green-700">60,000원</span>
              <span className="text-gray-400 text-sm">1박 / 최대 4인</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <div className="text-3xl mb-3">🏕️</div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-bold text-gray-900 text-lg">두가족 사이트</h3>
              <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full font-medium">{familySites.length}개</span>
            </div>
            <p className="text-gray-500 text-sm mb-4">두 가족이 함께 사용하는 넓은 사이트. 바베큐와 함께 특별한 추억을 만드세요.</p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-amber-700">120,000원</span>
              <span className="text-gray-400 text-sm">1박 / 최대 8-10인</span>
            </div>
          </div>
        </div>

        {/* 이용 안내 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">이용 안내</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-3">
              <Clock size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-gray-800">체크인 / 체크아웃</div>
                <div className="text-gray-500">체크인 14:00 / 체크아웃 11:00</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-gray-800">주소</div>
                <div className="text-gray-500">{CAMPING_INFO.address}</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-gray-800">문의</div>
                <div className="text-gray-500">{CAMPING_INFO.phone}</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Star size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-gray-800">현장 사이트 변경</div>
                <div className="text-gray-500">당일 현장에서 변경 가능 (관리자 확인 후)</div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link href="/reservation" className="inline-block bg-green-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-green-700 transition-colors shadow-md">
            예약하러 가기
          </Link>
        </div>
      </section>

      <footer className="bg-gray-800 text-gray-400 py-8 px-4 text-center text-sm mt-8">
        <p className="font-medium text-white mb-1">{CAMPING_INFO.name}</p>
        <p>{CAMPING_INFO.address}</p>
        <p className="mt-1">Tel: {CAMPING_INFO.phone}</p>
      </footer>
    </div>
  )
}
