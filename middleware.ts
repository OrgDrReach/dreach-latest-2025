import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
	const token = await getToken({ req: request });
	const isAuthPage =
		request.nextUrl.pathname.startsWith("/auth/login") ||
		request.nextUrl.pathname.startsWith("/auth/register") ||
		request.nextUrl.pathname.startsWith("/auth/verify");

	// Protect all dashboard routes
	if (request.nextUrl.pathname.startsWith("/dashboard")) {
		if (!token) {
			return NextResponse.redirect(new URL("/auth/login", request.url));
		}
	}

	// Redirect to dashboard if trying to access auth pages while logged in
	if (isAuthPage && token) {
		return NextResponse.redirect(new URL("/dashboard", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/dashboard/:path*",
		"/auth/login",
		"/auth/register",
		"/auth/verify",
	],
};
