import { create } from "zustand";
import { handleAPIError } from "@/lib/errors";

export type NotificationType =
	| "appointment_reminder"
	| "appointment_confirmation"
	| "appointment_cancellation"
	| "provider_verification"
	| "medical_record_update"
	| "prescription_added"
	| "review_received"
	| "payment_success"
	| "payment_failed";

interface Notification {
	id: string;
	type: NotificationType;
	title: string;
	message: string;
	read: boolean;
	createdAt: string;
	data?: Record<string, any>;
}

interface NotificationStore {
	notifications: Notification[];
	unreadCount: number;
	loading: boolean;
	error: string | null;
	addNotification: (
		notification: Omit<Notification, "id" | "createdAt">
	) => void;
	markAsRead: (notificationId: string) => void;
	markAllAsRead: () => void;
	removeNotification: (notificationId: string) => void;
	clearAll: () => void;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
	notifications: [],
	unreadCount: 0,
	loading: false,
	error: null,

	addNotification: (notification) => {
		const newNotification: Notification = {
			id: crypto.randomUUID(),
			createdAt: new Date().toISOString(),
			...notification,
		};

		set((state) => ({
			notifications: [newNotification, ...state.notifications],
			unreadCount: state.unreadCount + 1,
		}));

		// Show browser notification if supported
		if ("Notification" in window && Notification.permission === "granted") {
			new Notification(notification.title, {
				body: notification.message,
			});
		}
	},

	markAsRead: (notificationId: string) => {
		set((state) => {
			const notifications = state.notifications.map((notification) =>
				notification.id === notificationId ?
					{ ...notification, read: true }
				:	notification
			);

			return {
				notifications,
				unreadCount: state.unreadCount - 1,
			};
		});
	},

	markAllAsRead: () => {
		set((state) => ({
			notifications: state.notifications.map((notification) => ({
				...notification,
				read: true,
			})),
			unreadCount: 0,
		}));
	},

	removeNotification: (notificationId: string) => {
		set((state) => {
			const notification = state.notifications.find(
				(n) => n.id === notificationId
			);
			const unreadCount =
				notification && !notification.read ?
					state.unreadCount - 1
				:	state.unreadCount;

			return {
				notifications: state.notifications.filter(
					(n) => n.id !== notificationId
				),
				unreadCount,
			};
		});
	},

	clearAll: () => {
		set({ notifications: [], unreadCount: 0 });
	},
}));
