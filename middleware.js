import { NextResponse } from 'next/server';

export function middleware(request) {
	// Get the pathname of the request
	const pathname = request.nextUrl.pathname;

	// Only protect dashboard routes
	if (pathname.startsWith('/dashboard')) {
		// Get the HttpOnly token from the request cookies
		const token = request.cookies.get('clinic_token')?.value;
		
		// If no token is found, redirect to login
		if (!token || token.trim() === '') {
			// This line redirects any request without the 'clinic_token' cookie 
			// trying to access /dashboard to the /auth/login page.
			return NextResponse.redirect(new URL('/auth/login', request.url));
		}
		
		// For additional security, you could make a server-side request here
		// to verify the token with your backend, but for now we'll trust
		// that the presence of the cookie indicates authentication
	}

	return NextResponse.next();
}

export const config = {
	// This matcher ensures the middleware only runs for /dashboard and its subpaths.
	matcher: ['/dashboard/:path*']
};
