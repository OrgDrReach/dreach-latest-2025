import { z } from "zod";
import { ValidationError } from "@/lib/errors";

export class ValidationService {
	static validatePhoneNumber(phone: string): boolean {
		const phoneRegex = /^(\+91|0)?[6-9]\d{9}$/;
		return phoneRegex.test(phone);
	}

	static validateEmail(email: string): boolean {
		return z.string().email().safeParse(email).success;
	}

	static validatePassword(password: string): {
		isValid: boolean;
		errors: string[];
	} {
		const errors: string[] = [];

		if (password.length < 8) {
			errors.push("Password must be at least 8 characters long");
		}
		if (!/[A-Z]/.test(password)) {
			errors.push("Password must contain at least one uppercase letter");
		}
		if (!/[a-z]/.test(password)) {
			errors.push("Password must contain at least one lowercase letter");
		}
		if (!/[0-9]/.test(password)) {
			errors.push("Password must contain at least one number");
		}
		if (!/[!@#$%^&*]/.test(password)) {
			errors.push(
				"Password must contain at least one special character (!@#$%^&*)"
			);
		}

		return {
			isValid: errors.length === 0,
			errors,
		};
	}

	static sanitizeHtml(html: string): string {
		// Basic HTML sanitization
		return html
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#039;");
	}

	static validateConsultationFee(fee: number): boolean {
		return fee >= 0 && fee <= 10000; // Maximum consultation fee limit
	}

	static validateDuration(minutes: number): boolean {
		return minutes >= 15 && minutes <= 120; // 15 minutes to 2 hours
	}

	static validateTimeSlot(startTime: string, endTime: string): boolean {
		const start = new Date(`1970-01-01T${startTime}`);
		const end = new Date(`1970-01-01T${endTime}`);

		return start < end && end.getTime() - start.getTime() <= 2 * 60 * 60 * 1000; // Max 2 hours
	}

	static validatePincode(pincode: string): boolean {
		return /^\d{6}$/.test(pincode); // 6-digit pincode
	}

	static validateMedicalRegistrationNumber(number: string): boolean {
		// Format: State Code (2) + Year (2) + Registration Number (5)
		return /^[A-Z]{2}\d{2}\d{5}$/.test(number);
	}

	static validateQualification(qualification: string): boolean {
		const validQualifications = [
			"MBBS",
			"MD",
			"MS",
			"DNB",
			"DM",
			"MCh",
			"BDS",
			"MDS",
			"BHMS",
			"BAMS",
		];
		return validQualifications.includes(qualification);
	}

	static validateSpecialization(specialization: string): boolean {
		const validSpecializations = [
			"Cardiology",
			"Dermatology",
			"ENT",
			"Gastroenterology",
			"General Medicine",
			"General Surgery",
			"Gynecology",
			"Neurology",
			"Ophthalmology",
			"Orthopedics",
			"Pediatrics",
			"Psychiatry",
			"Pulmonology",
			"Urology",
		];
		return validSpecializations.includes(specialization);
	}

	static validateAge(age: number): boolean {
		return age >= 0 && age <= 120;
	}

	static validateBloodGroup(bloodGroup: string): boolean {
		const validBloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
		return validBloodGroups.includes(bloodGroup);
	}

	static validateGender(gender: string): boolean {
		return ["male", "female", "other"].includes(gender.toLowerCase());
	}

	static validateDate(date: string): boolean {
		const dateObj = new Date(date);
		return !isNaN(dateObj.getTime());
	}

	static validateFutureDate(date: string): boolean {
		const dateObj = new Date(date);
		const now = new Date();
		return dateObj > now;
	}

	static validatePastDate(date: string): boolean {
		const dateObj = new Date(date);
		const now = new Date();
		return dateObj < now;
	}

	static validate<T>(schema: z.ZodSchema<T>, data: unknown): T {
		try {
			return schema.parse(data);
		} catch (error) {
			if (error instanceof z.ZodError) {
				const firstError = error.errors[0];
				throw new ValidationError(
					firstError.message,
					firstError.path.join("."),
					data
				);
			}
			throw error;
		}
	}

	static formatErrorMessage(error: z.ZodError): string {
		return error.errors
			.map((err) => `${err.path.join(".")}: ${err.message}`)
			.join(", ");
	}

	static sanitizeInput(input: string): string {
		// Remove potentially dangerous characters and trim
		return input.replace(/[<>]/g, "").trim();
	}

	static validateDateRange(startDate: string, endDate: string): boolean {
		const start = new Date(startDate);
		const end = new Date(endDate);
		return start <= end;
	}

	static validateFileSize(size: number, maxSizeMB: number): boolean {
		return size <= maxSizeMB * 1024 * 1024;
	}

	static validateFileType(type: string, allowedTypes: string[]): boolean {
		return allowedTypes.includes(type);
	}
}
