import { FileUploadService, UploadedFile } from "./fileUpload";
import { CacheService, CacheKeys } from "./cache";
import { APIError } from "@/lib/errors";

export type VerificationStatus =
	| "pending"
	| "in-review"
	| "approved"
	| "rejected"
	| "expired";

export type ProviderType =
	| "doctor"
	| "hospital"
	| "lab"
	| "pharmacy"
	| "ambulance";

export interface VerificationDocument {
	id: string;
	type: string;
	file: UploadedFile;
	status: VerificationStatus;
	comments?: string[];
	verifiedAt?: string;
	expiresAt?: string;
}

export interface VerificationRequirement {
	type: string;
	name: string;
	description: string;
	required: boolean;
	format: string[];
	maxSize: number;
	validityPeriod?: number; // in days
}

const VERIFICATION_REQUIREMENTS: Record<
	ProviderType,
	VerificationRequirement[]
> = {
	doctor: [
		{
			type: "medical_license",
			name: "Medical License",
			description: "Valid medical practice license",
			required: true,
			format: ["application/pdf", "image/jpeg", "image/png"],
			maxSize: 10 * 1024 * 1024,
			validityPeriod: 365,
		},
		{
			type: "degree_certificate",
			name: "Medical Degree Certificate",
			description: "Medical degree from accredited institution",
			required: true,
			format: ["application/pdf", "image/jpeg", "image/png"],
			maxSize: 10 * 1024 * 1024,
		},
		{
			type: "specialization_certificate",
			name: "Specialization Certificate",
			description: "Specialty certification if applicable",
			required: false,
			format: ["application/pdf", "image/jpeg", "image/png"],
			maxSize: 10 * 1024 * 1024,
		},
	],
	hospital: [
		{
			type: "hospital_license",
			name: "Hospital License",
			description: "Valid hospital operation license",
			required: true,
			format: ["application/pdf", "image/jpeg", "image/png"],
			maxSize: 10 * 1024 * 1024,
			validityPeriod: 365,
		},
		{
			type: "accreditation_certificate",
			name: "Accreditation Certificate",
			description: "Hospital accreditation certificate",
			required: true,
			format: ["application/pdf", "image/jpeg", "image/png"],
			maxSize: 10 * 1024 * 1024,
			validityPeriod: 730,
		},
	],
	lab: [
		{
			type: "lab_license",
			name: "Laboratory License",
			description: "Valid laboratory operation license",
			required: true,
			format: ["application/pdf", "image/jpeg", "image/png"],
			maxSize: 10 * 1024 * 1024,
			validityPeriod: 365,
		},
		{
			type: "quality_certificate",
			name: "Quality Control Certificate",
			description: "Laboratory quality control certification",
			required: true,
			format: ["application/pdf", "image/jpeg", "image/png"],
			maxSize: 10 * 1024 * 1024,
			validityPeriod: 365,
		},
	],
	pharmacy: [
		{
			type: "pharmacy_license",
			name: "Pharmacy License",
			description: "Valid pharmacy operation license",
			required: true,
			format: ["application/pdf", "image/jpeg", "image/png"],
			maxSize: 10 * 1024 * 1024,
			validityPeriod: 365,
		},
		{
			type: "drug_handling_cert",
			name: "Drug Handling Certificate",
			description: "Drug handling and storage certification",
			required: true,
			format: ["application/pdf", "image/jpeg", "image/png"],
			maxSize: 10 * 1024 * 1024,
			validityPeriod: 365,
		},
	],
	ambulance: [
		{
			type: "vehicle_registration",
			name: "Vehicle Registration",
			description: "Valid ambulance vehicle registration",
			required: true,
			format: ["application/pdf", "image/jpeg", "image/png"],
			maxSize: 10 * 1024 * 1024,
			validityPeriod: 365,
		},
		{
			type: "emergency_service_license",
			name: "Emergency Service License",
			description: "Emergency medical service license",
			required: true,
			format: ["application/pdf", "image/jpeg", "image/png"],
			maxSize: 10 * 1024 * 1024,
			validityPeriod: 365,
		},
	],
};

export class VerificationService {
	private static readonly API_BASE = process.env.NEXT_PUBLIC_API_URL;

	static getRequirements(
		providerType: ProviderType
	): VerificationRequirement[] {
		return VERIFICATION_REQUIREMENTS[providerType];
	}

	static async uploadDocument(
		providerId: string,
		documentType: string,
		file: File,
		metadata?: Record<string, any>
	): Promise<VerificationDocument> {
		const uploadedFile = await FileUploadService.upload(file, "document", {
			providerId,
			documentType,
			...metadata,
		});

		const response = await fetch(
			`${this.API_BASE}/verification/${providerId}/documents`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					type: documentType,
					fileId: uploadedFile.id,
				}),
			}
		);

		if (!response.ok) {
			throw new APIError("Failed to submit document", response.status);
		}

		// Invalidate cache
		CacheService.invalidate(CacheKeys.verificationDocuments(providerId));

		return response.json();
	}

	static async getDocuments(
		providerId: string
	): Promise<VerificationDocument[]> {
		return CacheService.get(
			CacheKeys.verificationDocuments(providerId),
			async () => {
				const response = await fetch(
					`${this.API_BASE}/verification/${providerId}/documents`
				);

				if (!response.ok) {
					throw new APIError("Failed to fetch documents", response.status);
				}

				return response.json();
			}
		);
	}

	static async getStatus(providerId: string): Promise<{
		status: VerificationStatus;
		documents: VerificationDocument[];
		missingRequirements: string[];
	}> {
		return CacheService.get(
			CacheKeys.verificationStatus(providerId),
			async () => {
				const response = await fetch(
					`${this.API_BASE}/verification/${providerId}/status`
				);

				if (!response.ok) {
					throw new APIError("Failed to fetch status", response.status);
				}

				return response.json();
			},
			5 * 60 * 1000 // 5 minutes TTL
		);
	}

	static async requestReview(providerId: string): Promise<void> {
		const response = await fetch(
			`${this.API_BASE}/verification/${providerId}/review`,
			{
				method: "POST",
			}
		);

		if (!response.ok) {
			throw new APIError("Failed to request review", response.status);
		}

		// Invalidate cache
		CacheService.invalidate(CacheKeys.verificationStatus(providerId));
	}

	static async deleteDocument(
		providerId: string,
		documentId: string
	): Promise<void> {
		const response = await fetch(
			`${this.API_BASE}/verification/${providerId}/documents/${documentId}`,
			{
				method: "DELETE",
			}
		);

		if (!response.ok) {
			throw new APIError("Failed to delete document", response.status);
		}

		// Invalidate cache
		CacheService.invalidateByPrefix(`verification:${providerId}`);
	}

	static validateDocumentRequirements(
		providerType: ProviderType,
		documents: VerificationDocument[]
	): string[] {
		const requirements = this.getRequirements(providerType);
		const missingRequirements: string[] = [];

		requirements.forEach((requirement) => {
			if (
				requirement.required &&
				!documents.some(
					(doc) =>
						doc.type === requirement.type &&
						doc.status === "approved" &&
						(!doc.expiresAt || new Date(doc.expiresAt) > new Date())
				)
			) {
				missingRequirements.push(requirement.name);
			}
		});

		return missingRequirements;
	}

	static getDocumentValidity(document: VerificationDocument): {
		isValid: boolean;
		message: string;
	} {
		if (document.status !== "approved") {
			return {
				isValid: false,
				message: `Document is ${document.status}`,
			};
		}

		if (!document.expiresAt) {
			return {
				isValid: true,
				message: "Document is valid",
			};
		}

		const expirationDate = new Date(document.expiresAt);
		const now = new Date();
		const daysUntilExpiration = Math.ceil(
			(expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
		);

		if (daysUntilExpiration < 0) {
			return {
				isValid: false,
				message: "Document has expired",
			};
		}

		if (daysUntilExpiration <= 30) {
			return {
				isValid: true,
				message: `Document expires in ${daysUntilExpiration} days`,
			};
		}

		return {
			isValid: true,
			message: "Document is valid",
		};
	}
}
