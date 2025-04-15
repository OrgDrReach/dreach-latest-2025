export class APIError extends Error {
	constructor(
		message: string,
		public status: number,
		public code?: string,
		public details?: any
	) {
		super(message);
		this.name = "APIError";
	}
}

export function handleAPIError(error: unknown): APIError {
	if (error instanceof APIError) {
		return error;
	}

	if (error instanceof Response) {
		return new APIError(
			"API request failed",
			error.status,
			undefined,
			error.statusText
		);
	}

	if (error instanceof Error) {
		return new APIError(error.message, 500);
	}

	return new APIError("An unknown error occurred", 500);
}

export function isNetworkError(error: unknown): boolean {
	return (
		error instanceof TypeError &&
		(error.message === "Failed to fetch" ||
			error.message === "Network request failed")
	);
}

export function getErrorMessage(error: unknown): string {
	if (error instanceof APIError) {
		if (error.status === 401) {
			return "Your session has expired. Please log in again.";
		}
		if (error.status === 403) {
			return "You do not have permission to perform this action.";
		}
		if (error.status === 404) {
			return "The requested resource was not found.";
		}
		if (error.status === 422) {
			return "The provided data is invalid.";
		}
		if (error.status >= 500) {
			return "A server error occurred. Please try again later.";
		}
		return error.message;
	}

	if (error instanceof Error) {
		if (isNetworkError(error)) {
			return "Unable to connect to the server. Please check your internet connection.";
		}
		return error.message;
	}

	return "An unknown error occurred";
}

export function createAPIError(response: Response, data: any): APIError {
	const message = data.message || response.statusText;
	const status = response.status;
	const code = data.code;
	const details = data.details;

	return new APIError(message, status, code, details);
}

export class ValidationError extends Error {
	constructor(
		message: string,
		public field?: string,
		public value?: any
	) {
		super(message);
		this.name = "ValidationError";
	}
}

export class AuthenticationError extends APIError {
	constructor(message = "Authentication failed") {
		super(message, 401);
		this.name = "AuthenticationError";
	}
}

export class AuthorizationError extends APIError {
	constructor(message = "Access denied") {
		super(message, 403);
		this.name = "AuthorizationError";
	}
}

export class ResourceNotFoundError extends APIError {
	constructor(resource: string) {
		super(`${resource} not found`, 404);
		this.name = "ResourceNotFoundError";
	}
}

export class ConflictError extends APIError {
	constructor(message: string) {
		super(message, 409);
		this.name = "ConflictError";
	}
}

export function handleAxiosError(error: any): APIError {
	if (error.response) {
		return new APIError(
			error.response.data.message || error.message,
			error.response.status,
			error.response.data.code,
			error.response.data.details
		);
	}

	if (error.request) {
		return new APIError("No response received from server", 0, "NO_RESPONSE");
	}

	return new APIError(error.message || "Request failed", 500, "REQUEST_FAILED");
}

export function isErrorWithMessage(
	error: unknown
): error is { message: string } {
	return (
		typeof error === "object" &&
		error !== null &&
		"message" in error &&
		typeof (error as any).message === "string"
	);
}

export function toErrorWithMessage(maybeError: unknown): { message: string } {
	if (isErrorWithMessage(maybeError)) return maybeError;

	try {
		return new Error(JSON.stringify(maybeError));
	} catch {
		return new Error(String(maybeError));
	}
}

export const AUTH_ERRORS = {
	INVALID_CREDENTIALS: "Invalid phone number or password",
	USER_NOT_FOUND: "User not found",
	USER_EXISTS: "User already exists with this phone number",
	INVALID_TOKEN: "Invalid or expired token",
	UNAUTHORIZED: "You are not authorized to perform this action",
} as const;

export const APPOINTMENT_ERRORS = {
	SLOT_UNAVAILABLE: "The selected time slot is no longer available",
	INVALID_SCHEDULE: "Invalid appointment schedule",
	BOOKING_FAILED: "Failed to book appointment",
	NOT_FOUND: "Appointment not found",
	ALREADY_BOOKED: "You already have an appointment at this time",
} as const;

export const PROVIDER_ERRORS = {
	NOT_FOUND: "Provider not found",
	INVALID_SCHEDULE: "Invalid provider schedule",
	VERIFICATION_PENDING: "Provider verification is pending",
	VERIFICATION_FAILED: "Provider verification failed",
} as const;

export const VALIDATION_ERRORS = {
	INVALID_PHONE: "Please enter a valid phone number",
	INVALID_EMAIL: "Please enter a valid email address",
	INVALID_PASSWORD: "Password must be at least 6 characters long",
	REQUIRED_FIELD: "This field is required",
} as const;
