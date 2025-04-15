import { APIError } from "@/lib/errors";

export type FileType = "document" | "image" | "medical-record";

export interface UploadConfig {
	maxSize: number; // in bytes
	allowedTypes: string[];
	path: string;
}

export const FileConfigs: Record<FileType, UploadConfig> = {
	document: {
		maxSize: 10 * 1024 * 1024, // 10MB
		allowedTypes: ["application/pdf", "image/jpeg", "image/png"],
		path: "documents",
	},
	image: {
		maxSize: 5 * 1024 * 1024, // 5MB
		allowedTypes: ["image/jpeg", "image/png", "image/webp"],
		path: "images",
	},
	"medical-record": {
		maxSize: 20 * 1024 * 1024, // 20MB
		allowedTypes: [
			"application/pdf",
			"image/jpeg",
			"image/png",
			"application/dicom",
		],
		path: "medical-records",
	},
};

export interface UploadedFile {
	id: string;
	filename: string;
	url: string;
	contentType: string;
	size: number;
	uploadedAt: string;
	metadata?: Record<string, any>;
}

export class FileUploadService {
	private static readonly API_BASE = process.env.NEXT_PUBLIC_API_URL;

	static async upload(
		file: File,
		type: FileType,
		metadata?: Record<string, any>
	): Promise<UploadedFile> {
		const config = FileConfigs[type];

		// Validate file
		if (file.size > config.maxSize) {
			throw new APIError(
				`File size exceeds maximum allowed size of ${config.maxSize / 1024 / 1024}MB`,
				413
			);
		}

		if (!config.allowedTypes.includes(file.type)) {
			throw new APIError(
				`File type ${file.type} is not allowed. Allowed types: ${config.allowedTypes.join(
					", "
				)}`,
				415
			);
		}

		// Get signed URL for upload
		const signedUrlResponse = await fetch(`${this.API_BASE}/upload/sign`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				filename: file.name,
				contentType: file.type,
				path: config.path,
				metadata,
			}),
		});

		if (!signedUrlResponse.ok) {
			throw new APIError("Failed to get signed URL", signedUrlResponse.status);
		}

		const { url, fields } = await signedUrlResponse.json();

		// Prepare form data for upload
		const formData = new FormData();
		Object.entries(fields).forEach(([key, value]) => {
			formData.append(key, value as string);
		});
		formData.append("file", file);

		// Upload to storage
		const uploadResponse = await fetch(url, {
			method: "POST",
			body: formData,
		});

		if (!uploadResponse.ok) {
			throw new APIError("Failed to upload file", uploadResponse.status);
		}

		// Get file details
		const fileResponse = await fetch(`${this.API_BASE}/files/${fields.key}`, {
			method: "GET",
		});

		if (!fileResponse.ok) {
			throw new APIError("Failed to get file details", fileResponse.status);
		}

		return fileResponse.json();
	}

	static async delete(fileId: string): Promise<void> {
		const response = await fetch(`${this.API_BASE}/files/${fileId}`, {
			method: "DELETE",
		});

		if (!response.ok) {
			throw new APIError("Failed to delete file", response.status);
		}
	}

	static async getDownloadUrl(fileId: string): Promise<string> {
		const response = await fetch(`${this.API_BASE}/files/${fileId}/download`, {
			method: "GET",
		});

		if (!response.ok) {
			throw new APIError("Failed to get download URL", response.status);
		}

		const { url } = await response.json();
		return url;
	}

	static getFileIcon(contentType: string): string {
		if (contentType.startsWith("image/")) {
			return "image";
		}
		if (contentType === "application/pdf") {
			return "file-text";
		}
		if (contentType === "application/dicom") {
			return "activity";
		}
		return "file";
	}

	static formatFileSize(bytes: number): string {
		const units = ["B", "KB", "MB", "GB"];
		let size = bytes;
		let unitIndex = 0;

		while (size >= 1024 && unitIndex < units.length - 1) {
			size /= 1024;
			unitIndex++;
		}

		return `${size.toFixed(1)} ${units[unitIndex]}`;
	}

	static isImageFile(contentType: string): boolean {
		return contentType.startsWith("image/");
	}

	static isPDFFile(contentType: string): boolean {
		return contentType === "application/pdf";
	}

	static isDICOMFile(contentType: string): boolean {
		return contentType === "application/dicom";
	}
}
