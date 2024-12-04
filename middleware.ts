import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Handle dynamic routes for activities
  if (pathname.startsWith('/api/activities/') && pathname !== '/api/activities') {
    const id = pathname.split('/').pop()
    const url = new URL(request.url)
    url.pathname = '/api/activities'
    url.searchParams.set('id', id!)
    return NextResponse.rewrite(url)
  }

  // Handle dynamic routes for deals
  if (pathname.startsWith('/api/deals/') && pathname !== '/api/deals') {
    const id = pathname.split('/').pop()
    const url = new URL(request.url)
    url.pathname = '/api/deals'
    url.searchParams.set('id', id!)
    return NextResponse.rewrite(url)
  }

  // Handle dynamic routes for contacts
  if (pathname.startsWith('/api/contacts/') && pathname !== '/api/contacts') {
    const id = pathname.split('/').pop()
    const url = new URL(request.url)
    url.pathname = '/api/contacts'
    url.searchParams.set('id', id!)
    return NextResponse.rewrite(url)
  }

  // Handle dynamic routes for tasks
  if (pathname.startsWith('/api/tasks/') && pathname !== '/api/tasks') {
    const id = pathname.split('/').pop()
    const url = new URL(request.url)
    url.pathname = '/api/tasks'
    url.searchParams.set('id', id!)
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/:path*/[id]']
}
