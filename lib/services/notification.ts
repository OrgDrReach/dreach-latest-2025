import { websocketService } from "@/hooks/use-websocket";
import { CacheService } from "./cache";
import { APIError } from "@/lib/errors";

export type NotificationType =
	| "appointment"
	| "message"
	| "payment"
	| "verification"
	| "system";

export interface Notification {
	id: string;
	type: NotificationType;
	title: string;
	message: string;
	read: boolean;
	createdAt: string;
	data?: Record<string, any>;
}

export class NotificationService {
	private static readonly API_BASE = process.env.NEXT_PUBLIC_API_URL;

	static async getNotifications(
		options: {
			limit?: number;
			offset?: number;
			type?: NotificationType;
		} = {}
	): Promise<{ notifications: Notification[]; unreadCount: number }> {
		const cacheKey = `notifications:${JSON.stringify(options)}`;

		return CacheService.get(cacheKey, async () => {
			const queryParams = new URLSearchParams({
				limit: options.limit?.toString() || "20",
				offset: options.offset?.toString() || "0",
				...(options.type && { type: options.type }),
			});

			const response = await fetch(
				`${this.API_BASE}/notifications?${queryParams}`
			);

			if (!response.ok) {
				throw new APIError("Failed to fetch notifications", response.status);
			}

			return response.json();
		});
	}

	static async markAsRead(notificationIds: string[]): Promise<void> {
		try {
			const response = await fetch(`${this.API_BASE}/notifications/read`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ notificationIds }),
			});

			if (!response.ok) {
				throw new APIError(
					"Failed to mark notifications as read",
					response.status
				);
			}

			// Invalidate cache
			CacheService.invalidateByPrefix("notifications:");

			// Notify through WebSocket
			websocketService.sendMessage("notification_read", { notificationIds });
		} catch (error) {
			throw new APIError(
				"Failed to mark notifications as read",
				error instanceof APIError ? error.status : 500
			);
		}
	}

	static async deleteNotification(notificationId: string): Promise<void> {
		try {
			const response = await fetch(
				`${this.API_BASE}/notifications/${notificationId}`,
				{
					method: "DELETE",
				}
			);

			if (!response.ok) {
				throw new APIError("Failed to delete notification", response.status);
			}

			// Invalidate cache
			CacheService.invalidateByPrefix("notifications:");
		} catch (error) {
			throw new APIError(
				"Failed to delete notification",
				error instanceof APIError ? error.status : 500
			);
		}
	}

	static async sendPushNotification(
		userId: string,
		notification: {
			title: string;
			message: string;
			data?: Record<string, any>;
		}
	): Promise<void> {
		try {
			const response = await fetch(`${this.API_BASE}/notifications/push`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					userId,
					...notification,
				}),
			});

			if (!response.ok) {
				throw new APIError("Failed to send push notification", response.status);
			}
		} catch (error) {
			throw new APIError(
				"Failed to send push notification",
				error instanceof APIError ? error.status : 500
			);
		}
	}

	static async updatePushToken(token: string): Promise<void> {
		try {
			const response = await fetch(`${this.API_BASE}/notifications/token`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ token }),
			});

			if (!response.ok) {
				throw new APIError("Failed to update push token", response.status);
			}
		} catch (error) {
			throw new APIError(
				"Failed to update push token",
				error instanceof APIError ? error.status : 500
			);
		}
	}

	static formatNotificationTime(timestamp: string): string {
		const date = new Date(timestamp);
		const now = new Date();
		const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

		if (diffInSeconds < 60) {
			return "Just now";
		}

		const diffInMinutes = Math.floor(diffInSeconds / 60);
		if (diffInMinutes < 60) {
			return `${diffInMinutes}m ago`;
		}

		const diffInHours = Math.floor(diffInMinutes / 60);
		if (diffInHours < 24) {
			return `${diffInHours}h ago`;
		}

		const diffInDays = Math.floor(diffInHours / 24);
		if (diffInDays === 1) {
			return "Yesterday";
		}
		if (diffInDays < 7) {
			return `${diffInDays}d ago`;
		}

		return date.toLocaleDateString();
	}

	static getNotificationIcon(type: NotificationType): string {
		switch (type) {
			case "appointment":
				return "calendar";
			case "message":
				return "message-circle";
			case "payment":
				return "credit-card";
			case "verification":
				return "check-circle";
			case "system":
				return "bell";
			default:
				return "info";
		}
	}

	static getNotificationColor(type: NotificationType): string {
		switch (type) {
			case "appointment":
				return "blue";
			case "message":
				return "green";
			case "payment":
				return "yellow";
			case "verification":
				return "purple";
			case "system":
				return "gray";
			default:
				return "gray";
		}
	}
}
