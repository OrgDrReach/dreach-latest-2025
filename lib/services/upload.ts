import { APIError } from "@/lib/errors";

export type AllowedFileType = "image" | "document" | "medical-record";

interface UploadConfig {
	maxSize: number; // in bytes
	allowedTypes: string[];
}

const FILE_CONFIGS: Record<AllowedFileType, UploadConfig> = {
	image: {
		maxSize: 5 * 1024 * 1024, // 5MB
		allowedTypes: ["image/jpeg", "image/png", "image/webp"],
	},
	document: {
		maxSize: 10 * 1024 * 1024, // 10MB
		allowedTypes: ["application/pdf", "image/jpeg", "image/png"],
	},
	"medical-record": {
		maxSize: 20 * 1024 * 1024, // 20MB
		allowedTypes: [
			"application/pdf",
			"image/jpeg",
			"image/png",
			"application/msword",
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		],
	},
};

export class UploadService {
	static async uploadFile(
		file: File,
		type: AllowedFileType,
		metadata?: Record<string, any>
	): Promise<{ url: string; fileId: string }> {
		await this.validateFile(file, type);

		const formData = new FormData();
		formData.append("file", file);
		if (metadata) {
			formData.append("metadata", JSON.stringify(metadata));
		}

		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/upload`,
				{
					method: "POST",
					body: formData,
				}
			);

			if (!response.ok) {
				throw new APIError("Upload failed", response.status);
			}

			const data = await response.json();
			return {
				url: data.url,
				fileId: data.fileId,
			};
		} catch (error) {
			throw new APIError(
				"Failed to upload file",
				error instanceof APIError ? error.status : 500
			);
		}
	}

	static async uploadMultipleFiles(
		files: File[],
		type: AllowedFileType,
		metadata?: Record<string, any>
	): Promise<Array<{ url: string; fileId: string }>> {
		const uploadPromises = files.map((file) =>
			this.uploadFile(file, type, metadata)
		);
		return Promise.all(uploadPromises);
	}

	static async deleteFile(fileId: string): Promise<void> {
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/upload/${fileId}`,
				{
					method: "DELETE",
				}
			);

			if (!response.ok) {
				throw new APIError("Delete failed", response.status);
			}
		} catch (error) {
			throw new APIError(
				"Failed to delete file",
				error instanceof APIError ? error.status : 500
			);
		}
	}

	private static async validateFile(
		file: File,
		type: AllowedFileType
	): Promise<void> {
		const config = FILE_CONFIGS[type];

		if (!config) {
			throw new APIError(`Invalid file type: ${type}`, 400);
		}

		if (file.size > config.maxSize) {
			throw new APIError(
				`File size exceeds limit of ${config.maxSize / (1024 * 1024)}MB`,
				400
			);
		}

		if (!config.allowedTypes.includes(file.type)) {
			throw new APIError(
				`File type not allowed. Allowed types: ${config.allowedTypes.join(", ")}`,
				400
			);
		}

		// Additional security checks
		const fileHeader = await this.readFileHeader(file);
		if (!this.isValidFileSignature(fileHeader, file.type)) {
			throw new APIError("Invalid file signature", 400);
		}
	}

	private static async readFileHeader(file: File): Promise<ArrayBuffer> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result as ArrayBuffer);
			reader.onerror = () => reject(new Error("Failed to read file"));
			reader.readAsArrayBuffer(file.slice(0, 4));
		});
	}

	private static isValidFileSignature(
		header: ArrayBuffer,
		mimeType: string
	): boolean {
		const arr = new Uint8Array(header);
		const signatures: Record<string, number[]> = {
			"image/jpeg": [0xff, 0xd8, 0xff],
			"image/png": [0x89, 0x50, 0x4e, 0x47],
			"application/pdf": [0x25, 0x50, 0x44, 0x46],
		};

		const signature = signatures[mimeType];
		if (!signature) return true; // Skip check for unknown types

		return signature.every((byte, i) => arr[i] === byte);
	}

	static getFileExtension(filename: string): string {
		return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
	}

	static formatFileSize(bytes: number): string {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
	}
}
