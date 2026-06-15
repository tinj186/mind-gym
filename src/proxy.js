import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// 🚨 MAINTENANCE MODE SWITCH 🚨
// Set to true to lock the entire website. Set to false to open to the public.
const MAINTENANCE_MODE = true; 

export default withAuth(
  function middleware(req) {
    const url = req.nextUrl.clone();

    // 1. Maintenance Mode Interceptor
    if (MAINTENANCE_MODE) {
      // 1a. The Secret Developer Bypass
      // If you visit thelearnreps.com/?bypass=admin, it sets a secure cookie to let you in.
      if (url.searchParams.get('bypass') === 'admin') {
        const response = NextResponse.redirect(new URL('/', req.url));
        response.cookies.set('learnreps_bypass', 'true', { maxAge: 60 * 60 * 24 * 30 }); // Good for 30 days
        return response;
      }

      // 1b. Check if user has the bypass ticket
      const hasBypass = req.cookies.has('learnreps_bypass');
      
      // 1c. If they don't have the ticket, and they aren't already on the /offline page, kick them out!
      // (We also allow /api/webhooks to pass through so HitPay doesn't break if a payment is processing)
      if (!hasBypass && !url.pathname.startsWith('/offline') && !url.pathname.startsWith('/api/webhooks')) {
        return NextResponse.redirect(new URL('/offline', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        // 2. Original NextAuth Security Rules
        // We only enforce strict login checks on these specific private routes.
        const path = req.nextUrl.pathname;
        const isProtectedRoute = 
          path.startsWith('/hub') || 
          path.startsWith('/math') || 
          path.startsWith('/parent') || 
          path.startsWith('/admin');
        
        if (isProtectedRoute) {
          return !!token; // Must be logged in
        }
        return true; // Let them through to public pages (like /login or /offline)
      }
    }
  }
);

// We run this middleware on EVERY single page across the whole website
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
