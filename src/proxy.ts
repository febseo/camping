import { NextRequest, NextResponse } from 'next/server'

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname.startsWith('/admin') && pathname !== '/admin') {
    const auth = req.cookies.get('admin_auth')?.value
    if (auth !== 'true') {
      return NextResponse.redirect(new URL('/admin', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
