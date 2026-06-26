import { NextRequest, NextResponse } from 'next/server';

export function middleware(_request: NextRequest) {
  const response = NextResponse.next();

  // Add CORS headers
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-user-id');

  return response;
}

export const config = {
  matcher: ['/api/:path*'],
};
