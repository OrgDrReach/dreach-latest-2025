import { websocketService } from "./websocket";
import { CacheService, CacheKeys } from "./cache";
import { APIError } from "@/lib/errors";

export interface Message {
	id: string;
	senderId: string;
	receiverId: string;
	content: string;
	timestamp: string;
	read: boolean;
	type: "text" | "image" | "document";
	metadata?: {
		fileName?: string;
		fileSize?: number;
		mimeType?: string;
		thumbnailUrl?: string;
	};
}

export interface ChatRoom {
	id: string;
	participants: string[];
	lastMessage?: Message;
	unreadCount: number;
	createdAt: string;
	updatedAt: string;
}

export class MessagingService {
	private static readonly API_BASE = process.env.NEXT_PUBLIC_API_URL;

	static async sendMessage(
		receiverId: string,
		content: string,
		type: Message["type"] = "text",
		metadata?: Message["metadata"]
	): Promise<Message> {
		try {
			const response = await fetch(`${this.API_BASE}/messages`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					receiverId,
					content,
					type,
					metadata,
				}),
			});

			if (!response.ok) {
				throw new APIError("Failed to send message", response.status);
			}

			const message = await response.json();

			// Notify through WebSocket
			websocketService.sendMessage("new_message", {
				receiverId,
				message,
			});

			// Update cache
			this.updateChatCache(receiverId, message);

			return message;
		} catch (error) {
			throw new APIError(
				"Failed to send message",
				error instanceof APIError ? error.status : 500
			);
		}
	}

	static async getMessages(
		chatRoomId: string,
		options: {
			limit?: number;
			before?: string;
		} = {}
	): Promise<Message[]> {
		const cacheKey = `${CacheKeys.chatMessages(chatRoomId)}:${
			options.before || "latest"
		}`;

		return CacheService.get(cacheKey, async () => {
			const queryParams = new URLSearchParams({
				limit: options.limit?.toString() || "50",
				...(options.before && { before: options.before }),
			});

			const response = await fetch(
				`${this.API_BASE}/messages/${chatRoomId}?${queryParams}`
			);

			if (!response.ok) {
				throw new APIError("Failed to fetch messages", response.status);
			}

			return response.json();
		});
	}

	static async getChatRooms(): Promise<ChatRoom[]> {
		return CacheService.get("chat_rooms", async () => {
			const response = await fetch(`${this.API_BASE}/chat-rooms`);

			if (!response.ok) {
				throw new APIError("Failed to fetch chat rooms", response.status);
			}

			return response.json();
		});
	}

	static async markAsRead(messageIds: string[]): Promise<void> {
		try {
			const response = await fetch(`${this.API_BASE}/messages/read`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ messageIds }),
			});

			if (!response.ok) {
				throw new APIError("Failed to mark messages as read", response.status);
			}

			// Update cache and notify through WebSocket
			messageIds.forEach((id) => {
				CacheService.invalidateByPrefix(CacheKeys.chatMessages(""));
			});

			websocketService.sendMessage("messages_read", { messageIds });
		} catch (error) {
			throw new APIError(
				"Failed to mark messages as read",
				error instanceof APIError ? error.status : 500
			);
		}
	}

	private static updateChatCache(
		receiverId: string,
		newMessage: Message
	): void {
		// Update chat room cache
		CacheService.invalidateByPrefix("chat_rooms");

		// Update messages cache
		const chatRoomId = this.getChatRoomId(newMessage.senderId, receiverId);
		CacheService.invalidateByPrefix(CacheKeys.chatMessages(chatRoomId));
	}

	private static getChatRoomId(userId1: string, userId2: string): string {
		// Ensure consistent chat room ID regardless of order
		return [userId1, userId2].sort().join(":");
	}

	// Helper function to format message timestamp
	static formatMessageTime(timestamp: string): string {
		const date = new Date(timestamp);
		const now = new Date();
		const diffInHours = Math.abs(now.getTime() - date.getTime()) / 36e5;

		if (diffInHours < 24) {
			return date.toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			});
		}

		if (diffInHours < 48) {
			return "Yesterday";
		}

		return date.toLocaleDateString();
	}
}
