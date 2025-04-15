import { APIError } from "@/lib/errors";
import { websocketService } from "./websocket";

export interface PaymentDetails {
	amount: number;
	currency: string;
	description: string;
	metadata?: Record<string, any>;
}

export interface PaymentMethod {
	id: string;
	type: "card" | "upi" | "netbanking" | "wallet";
	details: {
		last4?: string;
		brand?: string;
		upiId?: string;
		bankName?: string;
		walletName?: string;
	};
}

export interface Transaction {
	id: string;
	amount: number;
	currency: string;
	status: "pending" | "completed" | "failed" | "refunded";
	paymentMethod: PaymentMethod;
	createdAt: string;
	metadata?: Record<string, any>;
}

export class PaymentService {
	private static readonly API_BASE = process.env.NEXT_PUBLIC_API_URL;

	static async initiatePayment(
		details: PaymentDetails
	): Promise<{ clientSecret: string; paymentIntentId: string }> {
		try {
			const response = await fetch(`${this.API_BASE}/payments/create`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(details),
			});

			if (!response.ok) {
				throw new APIError("Failed to initiate payment", response.status);
			}

			return response.json();
		} catch (error) {
			throw new APIError(
				"Payment initiation failed",
				error instanceof APIError ? error.status : 500
			);
		}
	}

	static async confirmPayment(paymentIntentId: string): Promise<Transaction> {
		try {
			const response = await fetch(
				`${this.API_BASE}/payments/${paymentIntentId}/confirm`,
				{
					method: "POST",
				}
			);

			if (!response.ok) {
				throw new APIError("Payment confirmation failed", response.status);
			}

			const transaction = await response.json();

			// Notify through WebSocket
			websocketService.sendMessage("payment_completed", {
				transactionId: transaction.id,
			});

			return transaction;
		} catch (error) {
			throw new APIError(
				"Payment confirmation failed",
				error instanceof APIError ? error.status : 500
			);
		}
	}

	static async getTransaction(transactionId: string): Promise<Transaction> {
		try {
			const response = await fetch(
				`${this.API_BASE}/payments/transactions/${transactionId}`
			);

			if (!response.ok) {
				throw new APIError("Failed to fetch transaction", response.status);
			}

			return response.json();
		} catch (error) {
			throw new APIError(
				"Failed to fetch transaction",
				error instanceof APIError ? error.status : 500
			);
		}
	}

	static async requestRefund(
		transactionId: string,
		reason: string
	): Promise<Transaction> {
		try {
			const response = await fetch(
				`${this.API_BASE}/payments/${transactionId}/refund`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ reason }),
				}
			);

			if (!response.ok) {
				throw new APIError("Refund request failed", response.status);
			}

			const transaction = await response.json();

			// Notify through WebSocket
			websocketService.sendMessage("refund_initiated", {
				transactionId: transaction.id,
			});

			return transaction;
		} catch (error) {
			throw new APIError(
				"Refund request failed",
				error instanceof APIError ? error.status : 500
			);
		}
	}

	static async getSavedPaymentMethods(): Promise<PaymentMethod[]> {
		try {
			const response = await fetch(`${this.API_BASE}/payments/methods`);

			if (!response.ok) {
				throw new APIError("Failed to fetch payment methods", response.status);
			}

			return response.json();
		} catch (error) {
			throw new APIError(
				"Failed to fetch payment methods",
				error instanceof APIError ? error.status : 500
			);
		}
	}

	static async savePaymentMethod(
		paymentMethodId: string
	): Promise<PaymentMethod> {
		try {
			const response = await fetch(`${this.API_BASE}/payments/methods`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ paymentMethodId }),
			});

			if (!response.ok) {
				throw new APIError("Failed to save payment method", response.status);
			}

			return response.json();
		} catch (error) {
			throw new APIError(
				"Failed to save payment method",
				error instanceof APIError ? error.status : 500
			);
		}
	}

	static async deletePaymentMethod(paymentMethodId: string): Promise<void> {
		try {
			const response = await fetch(
				`${this.API_BASE}/payments/methods/${paymentMethodId}`,
				{
					method: "DELETE",
				}
			);

			if (!response.ok) {
				throw new APIError("Failed to delete payment method", response.status);
			}
		} catch (error) {
			throw new APIError(
				"Failed to delete payment method",
				error instanceof APIError ? error.status : 500
			);
		}
	}

	static formatAmount(amount: number, currency: string = "INR"): string {
		return new Intl.NumberFormat("en-IN", {
			style: "currency",
			currency,
		}).format(amount);
	}

	static getTransactionStatus(status: Transaction["status"]): {
		label: string;
		color: string;
	} {
		switch (status) {
			case "pending":
				return { label: "Pending", color: "yellow" };
			case "completed":
				return { label: "Completed", color: "green" };
			case "failed":
				return { label: "Failed", color: "red" };
			case "refunded":
				return { label: "Refunded", color: "gray" };
			default:
				return { label: "Unknown", color: "gray" };
		}
	}
}
