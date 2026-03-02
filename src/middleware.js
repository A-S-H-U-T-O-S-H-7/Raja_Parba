import { NextResponse } from 'next/server';

const PAYMENT_PAGE_PATHS = new Set([
  '/payment/success',
  '/payment/failed',
  '/payment/cancel',
  '/payment/status'
]);

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // CCAvenue callback may POST directly to UI URLs; rewrite to API handler.
  if (request.method === 'POST' && PAYMENT_PAGE_PATHS.has(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = '/api/payment/redirect';
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/payment/:path*']
};
