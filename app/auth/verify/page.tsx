import Verify from "@/components/auth/verify/Verify";
import { VerifyErrorBoundary } from "@/components/auth/verify/VerifyErrorBoundary";
import { redirect } from "next/navigation";

export default async function VerifyPage({
	searchParams,
}: {
	searchParams: Record<string, string | string[] | undefined>;
}) {
	const phone = searchParams.phone as string | undefined;

	if (!phone) {
		redirect("/auth/login");
	}

	return (
		<main className="min-h-screen">
			<VerifyErrorBoundary>
				<Verify phone={phone} />
			</VerifyErrorBoundary>
		</main>
	);
}
