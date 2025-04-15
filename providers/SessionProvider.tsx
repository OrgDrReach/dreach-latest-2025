"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { ReactNode } from "react";

export function SessionProvider({
	children,
	session,
}: {
	children: ReactNode;
	session: any;
}) {
	return (
		<NextAuthSessionProvider session={session} refetchInterval={5 * 60}>
			{children}
		</NextAuthSessionProvider>
	);
}
