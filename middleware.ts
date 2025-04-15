import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
	const token = await getToken({ req: request });
	const path = request.nextUrl.pathname;

	// Public paths that don't require authentication
	if (
		path === "/" ||
		path.startsWith("/auth") ||
		path === "/about" ||
		path === "/contact" ||
		path === "/services" ||
		path === "/doctors" ||
		path.startsWith("/_next") ||
		path.startsWith("/api/auth")
	) {
		return NextResponse.next();
	}

	// Redirect to login if not authenticated
	if (!token) {
		const loginUrl = new URL("/auth/login", request.url);
		loginUrl.searchParams.set("callbackUrl", path);
		return NextResponse.redirect(loginUrl);
	}

	// Role-based route protection
	const userRole = (token.role as string) || "patient";

	if (path.startsWith("/dashboard")) {
		// Extract dashboard type from path
		const dashboardType = path.split("/")[2]; // e.g., "admin", "doctors", "hospitals"

		// Role-based access rules
		const allowedRoles: Record<string, string[]> = {
			admin: ["admin"],
			doctors: ["doctor", "admin"],
			hospitals: ["hospital", "admin"],
			patients: ["patient", "admin"],
			labs: ["lab", "admin"],
		};

		// Check if user has permission for this dashboard
		const isAllowed = allowedRoles[dashboardType]?.includes(userRole);

		if (!isAllowed) {
			// Redirect to appropriate dashboard based on role
			const roleDashboardMap: Record<string, string> = {
				admin: "/dashboard/admin",
				doctor: "/dashboard/doctors",
				hospital: "/dashboard/hospitals",
				patient: "/dashboard/patients",
				lab: "/dashboard/labs",
			};

			const redirectUrl = roleDashboardMap[userRole] || "/dashboard/patients";
			return NextResponse.redirect(new URL(redirectUrl, request.url));
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!api|next/static|next/image|favicon.ico).*)"],
};
