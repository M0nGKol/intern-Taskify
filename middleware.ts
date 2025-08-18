import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { rateLimit } from "./src/middleware/rate-limit";
 
export async function middleware(request: NextRequest) {
	const sessionCookie = getSessionCookie(request);
	const { pathname } = request.nextUrl;

	// Rate limiting for auth endpoints
	if (pathname.startsWith('/api/sign-in') || pathname.startsWith('/api/sign-up')) {
		const rateLimitResult = rateLimit(request, 5, 15 * 60 * 1000); // 5 attempts per 15 minutes
		if (rateLimitResult.status === 429) {
			return rateLimitResult;
		}
	}

	if (pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up') || pathname === '/') {
		return NextResponse.next();
	}
	if (pathname.startsWith('/dashboard') || pathname.startsWith('/projects')) {
		if (!sessionCookie) {
			return NextResponse.redirect(new URL("/sign-in", request.url));
		}
	}
 
	return NextResponse.next();
}
 
export const config = {
	matcher: [
		"/dashboard/:path*",
		"/projects/:path*",
		"/sign-in",
		"/sign-up",
		"/",
		"/api/:path*"
	],
};