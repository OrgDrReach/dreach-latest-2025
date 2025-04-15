import { useNotificationStore } from "@/lib/stores/notifications";
import { NotificationType } from "@/lib/stores/notifications";
import { useSession } from "next-auth/react";

interface WebSocketMessage {
	type: "notification" | "appointment_update" | "chat_message";
	payload: any;
}

class WebSocketService {
	private static instance: WebSocketService;
	private ws: WebSocket | null = null;
	private reconnectAttempts = 0;
	private maxReconnectAttempts = 5;
	private reconnectTimeout = 1000;

	private constructor() {
		this.setupWebSocket();
	}

	static getInstance(): WebSocketService {
		if (!WebSocketService.instance) {
			WebSocketService.instance = new WebSocketService();
		}
		return WebSocketService.instance;
	}

	private setupWebSocket() {
		const session = useSession();
		if (!session?.data?.accessToken) return;

		const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL}?token=${session.data.accessToken}`;
		this.ws = new WebSocket(wsUrl);

		this.ws.onopen = this.handleOpen.bind(this);
		this.ws.onmessage = this.handleMessage.bind(this);
		this.ws.onclose = this.handleClose.bind(this);
		this.ws.onerror = this.handleError.bind(this);
	}

	private handleOpen() {
		console.log("WebSocket connection established");
		this.reconnectAttempts = 0;
	}

	private handleMessage(event: MessageEvent) {
		try {
			const message: WebSocketMessage = JSON.parse(event.data);

			switch (message.type) {
				case "notification":
					this.handleNotification(message.payload);
					break;
				case "appointment_update":
					this.handleAppointmentUpdate(message.payload);
					break;
				case "chat_message":
					this.handleChatMessage(message.payload);
					break;
				default:
					console.warn("Unknown message type:", message.type);
			}
		} catch (error) {
			console.error("Error processing WebSocket message:", error);
		}
	}

	private handleClose() {
		console.log("WebSocket connection closed");
		this.attemptReconnect();
	}

	private handleError(error: Event) {
		console.error("WebSocket error:", error);
	}

	private attemptReconnect() {
		if (this.reconnectAttempts >= this.maxReconnectAttempts) {
			console.error("Max reconnection attempts reached");
			return;
		}

		setTimeout(
			() => {
				this.reconnectAttempts++;
				this.setupWebSocket();
			},
			this.reconnectTimeout * Math.pow(2, this.reconnectAttempts)
		);
	}

	private handleNotification(payload: any) {
		const notificationStore = useNotificationStore.getState();
		notificationStore.addNotification({
			type: payload.type as NotificationType,
			title: payload.title,
			message: payload.message,
			read: false,
			data: payload.data,
		});
	}

	private handleAppointmentUpdate(payload: any) {
		// Implement appointment update logic
		const event = new CustomEvent("appointmentUpdate", { detail: payload });
		window.dispatchEvent(event);
	}

	private handleChatMessage(payload: any) {
		// Implement chat message handling logic
		const event = new CustomEvent("chatMessage", { detail: payload });
		window.dispatchEvent(event);
	}

	public sendMessage(type: string, payload: any) {
		if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
			throw new Error("WebSocket is not connected");
		}

		this.ws.send(JSON.stringify({ type, payload }));
	}

	public disconnect() {
		if (this.ws) {
			this.ws.close();
			this.ws = null;
		}
	}
}

export const websocketService = WebSocketService.getInstance();
