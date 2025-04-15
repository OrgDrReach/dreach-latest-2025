import React from "react";
import { APIError } from "@/lib/errors";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter } from "next/navigation";

interface Props {
	children: React.ReactNode;
}

interface State {
	hasError: boolean;
	error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error: Error) {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		// Log error to error reporting service
		console.error("Error caught by boundary:", error, errorInfo);
	}

	private getErrorMessage(error: Error | null): string {
		if (!error) return "An unknown error occurred";

		if (error instanceof APIError) {
			return error.message;
		}

		return error.message || "An unexpected error occurred";
	}

	private handleRetry = () => {
		this.setState({ hasError: false, error: null });
	};

	render() {
		if (this.state.hasError) {
			return (
				<div className="flex flex-col items-center justify-center min-h-[400px] p-4">
					<Alert variant="destructive" className="mb-4 max-w-lg">
						<AlertTitle>Something went wrong</AlertTitle>
						<AlertDescription>
							{this.getErrorMessage(this.state.error)}
						</AlertDescription>
					</Alert>

					<div className="flex gap-4">
						<Button onClick={this.handleRetry} variant="outline">
							Try again
						</Button>
						<Button onClick={() => window.location.reload()}>
							Reload page
						</Button>
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}

export function withErrorBoundary<P extends object>(
	WrappedComponent: React.ComponentType<P>,
	fallback?: React.ReactNode
) {
	return function WithErrorBoundary(props: P) {
		return (
			<ErrorBoundary>
				{fallback ?
					<React.Suspense fallback={fallback}>
						<WrappedComponent {...props} />
					</React.Suspense>
				:	<WrappedComponent {...props} />}
			</ErrorBoundary>
		);
	};
}

export function useErrorBoundary() {
	const router = useRouter();

	const throwError = (error: Error) => {
		throw error;
	};

	const handleError = (error: unknown) => {
		if (error instanceof APIError) {
			if (error.status === 401) {
				router.push("/auth/login");
				return;
			}
			if (error.status === 403) {
				router.push("/dashboard");
				return;
			}
		}
		throwError(error instanceof Error ? error : new Error(String(error)));
	};

	return { throwError, handleError };
}
