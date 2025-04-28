import axios from "axios";
import { IUser, IPatient } from "@/types/user.d.types";
import { EUserRole, EUserStatus, EGender } from "@/types/auth.d.types";

interface ApiResponse<T> {
	status: number;
	message: string | any;
	data?: T;
	error?: string;
}

/**
 * Create new user
 * @param userData Partial user data for registration
 * @returns Promise with ApiResponse containing user data or error
 */
export const createUser = async (
	userData: Partial<IUser>
): Promise<ApiResponse<IUser>> => {
	try {
		const response = await axios.post(
			`${process.env.SERVER_URL}/user/signup`,
			userData,
			{
				headers: {
					"Content-Type": "application/json",
				},
				withCredentials: true,
			}
		);

		console.log(`User is being created: ${JSON.stringify(userData)}`);
		console.log(response.data);

		return {
			status: response.status,
			message: response.data,
			data: response.data.id,
		};
	} catch (error) {
		console.error("Error creating user:", error);

		if (axios.isAxiosError(error)) {
			return {
				status: error.response?.status || 500,
				message: error.response?.data?.message || "Internal server error",
				error: error.message,
			};
		}

		return {
			status: 500,
			message: "Internal server error",
			error: error instanceof Error ? error.message : "Unknown error occurred",
		};
	}
};
