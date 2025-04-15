import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

interface WebSocketMessage {
	type: string;
	payload: any;
}

export interface WebSocketHook {
	connected: boolean;
	sendMessage: (type: string, payload: any) => void;
	subscribe: (type: string, callback: (payload: any) => void) => () => void;
}

export const websocketService = {
	socket: null as Socket | null,
	subscriptions: new Map<string, Set<(payload: any) => void>>(),

	connect() {
		if (this.socket) return;

		this.socket = io(process.env.NEXT_PUBLIC_WS_URL!, {
			transports: ["websocket"],
			autoConnect: true,
			reconnection: true,
			reconnectionAttempts: 5,
			reconnectionDelay: 1000,
		});

		this.socket.on("message", (message: WebSocketMessage) => {
			const callbacks = this.subscriptions.get(message.type);
			if (callbacks) {
				callbacks.forEach((callback) => callback(message.payload));
			}
		});

		this.socket.on("connect_error", (error: Error) => {
			console.error("WebSocket connection error:", error);
		});
	},

	disconnect() {
		if (this.socket) {
			this.socket.disconnect();
			this.socket = null;
		}
	},

	sendMessage(type: string, payload: any) {
		if (this.socket?.connected) {
			this.socket.emit("message", { type, payload });
		} else {
			console.error("WebSocket not connected");
		}
	},

	subscribe(type: string, callback: (payload: any) => void) {
		if (!this.subscriptions.has(type)) {
			this.subscriptions.set(type, new Set());
		}
		this.subscriptions.get(type)!.add(callback);

		return () => {
			const callbacks = this.subscriptions.get(type);
			if (callbacks) {
				callbacks.delete(callback);
				if (callbacks.size === 0) {
					this.subscriptions.delete(type);
				}
			}
		};
	},
};

export function useWebSocket(): WebSocketHook {
	const [connected, setConnected] = useState(false);
	const socket = useRef(websocketService);

	useEffect(() => {
		socket.current.connect();

		const onConnect = () => setConnected(true);
		const onDisconnect = () => setConnected(false);

		if (socket.current.socket) {
			socket.current.socket.on("connect", onConnect);
			socket.current.socket.on("disconnect", onDisconnect);
		}

		return () => {
			if (socket.current.socket) {
				socket.current.socket.off("connect", onConnect);
				socket.current.socket.off("disconnect", onDisconnect);
			}
		};
	}, []);

	const sendMessage = useCallback((type: string, payload: any) => {
		socket.current.sendMessage(type, payload);
	}, []);

	const subscribe = useCallback(
		(type: string, callback: (payload: any) => void) => {
			return socket.current.subscribe(type, callback);
		},
		[]
	);

	return {
		connected,
		sendMessage,
		subscribe,
	};
}

// WebSocket message types
export const WS_EVENTS = {
	// Appointment events
	APPOINTMENT_BOOKED: "appointment_booked",
	APPOINTMENT_CANCELLED: "appointment_cancelled",
	APPOINTMENT_REMINDER: "appointment_reminder",
	QUEUE_UPDATE: "queue_update",

	// Chat events
	NEW_MESSAGE: "new_message",
	MESSAGE_READ: "message_read",
	TYPING_START: "typing_start",
	TYPING_END: "typing_end",

	// Payment events
	PAYMENT_COMPLETED: "payment_completed",
	REFUND_INITIATED: "refund_initiated",
	PAYMENT_FAILED: "payment_failed",

	// Provider events
	PROVIDER_STATUS: "provider_status",
	VERIFICATION_UPDATE: "verification_update",
	SCHEDULE_UPDATE: "schedule_update",

	// User events
	USER_ONLINE: "user_online",
	USER_OFFLINE: "user_offline",
	USER_TYPING: "user_typing",

	// Notification events
	NEW_NOTIFICATION: "new_notification",
	NOTIFICATION_READ: "notification_read",
} as const;

export type WebSocketEventType = (typeof WS_EVENTS)[keyof typeof WS_EVENTS];
