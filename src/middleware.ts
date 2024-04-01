import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { COOKIE_NAME } from './app/lib/constants'

export function middleware(request: NextRequest) {
  const authenUrls = ['/login', '/register']
  const isAuthPage = authenUrls.some((item) => request.nextUrl.pathname.startsWith(item))
  const isHasAccessToken = request.cookies.has(COOKIE_NAME.ACCESS_TOKEN)

  if (isAuthPage && isHasAccessToken) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (!isAuthPage && !isHasAccessToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|404|500|walkthrough).*)']
}
