import AdminNav from '@/components/admin/AdminNav'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminNav />
      {/* 모바일: 상단/하단 nav 공간 확보, 데스크톱: 사이드바 옆 */}
      <main className="flex-1 overflow-auto pt-14 pb-20 md:pt-0 md:pb-0">{children}</main>
    </div>
  )
}
