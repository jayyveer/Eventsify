import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export function middleware(req: NextRequest) {
    const url = req.nextUrl;
  
    // Get all cookies
    const allCookies = req.cookies.getAll()
    
    // Get a specific cookie
    let userTokenCookie = req.cookies.get('nextjs')
  
    // Check if a specific cookie exists
    if (userTokenCookie) {
      console.log('User token:', userTokenCookie.value);
      // You can use the userToken for authorization purposes in your middleware logic
    } else {
      console.log('No user token cookie found.');
    }
  
    const response = NextResponse.next();
    return response;
  }

  export const config = {
    matcher: '/:path*',
  }
  