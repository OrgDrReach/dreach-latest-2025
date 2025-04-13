import Verify from "@/components/auth/verify/Verify";
import { VerifyErrorBoundary } from "@/components/auth/verify/VerifyErrorBoundary";
import { redirect } from "next/navigation";

export default function VerifyPage({
	searchParams,
}: {
	searchParams: { phone?: string };
}) {
	if (!searchParams.phone) {
		redirect("/auth/login");
	}

	return (
		<main className="min-h-screen">
			<VerifyErrorBoundary>
				<Verify phone={searchParams.phone} />
			</VerifyErrorBoundary>
		</main>
	);
}
