import Verify from "@/components/auth/verify/Verify";
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
		<div>
			<Verify phone={searchParams.phone} />
		</div>
	);
}
