// middleware.js
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (pathname === '/login' || pathname === '/register') {
    return NextResponse.next();
  }

  // Get token from HTTP-only cookie
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    // Optionally attach user info to request
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', payload.id);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (err) {
    console.error('Token verification failed:', err);
    return NextResponse.json({ message: 'Invalid token' }, { status: 403 });
  }
}

export const config = {
  matcher: ['/api/users/:path*'],
};
