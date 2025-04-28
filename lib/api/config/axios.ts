import axios from "axios";
import { IUser, IPatient } from "@/types/user.d.types";
import { EUserRole, EUserStatus, EGender } from "@/types/auth.d.types";

interface UpdateUserPayload {
	name: string;
	phoneNumber: string; // Changed from phone to phoneNumber to match ProfileFormData
	dob: string | Date; // Allow both string and Date
	gender: EGender;
	bloodGroup?: string;
	role: EUserRole;
	address?: {
		address?: string;
		city?: string;
		state?: string;
		country?: string;
		pincode?: string;
	};
}

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
		// Add profileImage field check and handling
		const dataToSend = {
			...userData,
			profilePic: userData.profilePic,
			isVerified: true,
			role: EUserRole.PATIENT
		};

		const response = await axios.post(
			`${process.env.SERVER_URL}/user/signup`,
			dataToSend,
			{
				headers: {
					"Content-Type": "application/json",
				},
				withCredentials: true,
			}
		);

		console.log(`User is being created: ${JSON.stringify(dataToSend)}`);
		
		// Properly handle the response data
		return {
			status: response.status,
			message: "User created successfully",
			data: response.data // Return the complete response data
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

/**
 * Fetch user data by ID
 * @param userId User ID to fetch
 * @returns Promise with ApiResponse containing user data or error
 */
export const fetchUserById = async (
  userId: string
): Promise<ApiResponse<IUser>> => {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const response = await axios.get(
      `${process.env.SERVER_URL}/user/fetchUserById/${userId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    console.log("Response data:", response.data);

    return {
      status: response.status,
      message: response.data.message,
      data: response.data.user,
    };
  } catch (error) {
    console.error("Error fetching user:", error);

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

/**
 * Fetch user by email
 * @param email Email address to fetch user
 * @returns Promise with ApiResponse containing user data or error
 */
export const fetchUserByEmail = async (
  email: string
): Promise<ApiResponse<IUser>> => {
  try {
    if (!email) {
      return {
        status: 400,
        message: "Email is required",
        error: "Email is required",
      };
    }

    if (!process.env.SERVER_URL) {
      throw new Error("SERVER_URL environment variable is not defined");
    }

    console.log("Attempting to fetch user with email:", email);
    const response = await axios.get(
      `${process.env.SERVER_URL}/user/fetchUserByEmail`,
      {
        params: { email },
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    const data = response.data;
    console.log("Response from fetch user by email:", data);

    // Handle successful user fetch
    if (data && data.id) {
      console.log("User found with id:", data.id);
      const updateUserResponse = await fetchUserById(data.id);
      
      if (updateUserResponse.status === 200 && updateUserResponse.data) {
        return {
          status: 200,
          message: "User found successfully",
          data: updateUserResponse.data,
        };
      }
    }

    // Handle user data validation
    if (data && data.user) {
      if (!data.user.email) {
        throw new Error("Invalid user data received from server");
      }

      const userData: IUser = {
        id: data.user.id || "",
        userId: data.user.userId || "",
        email: data.user.email,
        firstName: data.user.firstName || "",
        lastName: data.user.lastName || "",
        name: `${data.user.firstName} ${data.user.lastName}`,
        profilePic: data.user.profilePic || "",
        phone: data.user.phone || "",
        dob: data.user.dob ? new Date(data.user.dob) : new Date(),
        gender: data.user.gender || EGender.OTHER,
        address: Array.isArray(data.user.address) ? data.user.address : [],
        role: data.user.role || EUserRole.PATIENT,
        status: data.user.status || EUserStatus.ACTIVE,
        isVerified: Boolean(data.user.isVerified),
        createdAt: data.user.createdAt ? new Date(data.user.createdAt) : new Date(),
        updatedAt: data.user.updatedAt ? new Date(data.user.updatedAt) : new Date(),
      };

      return {
        status: 200,
        message: "User found successfully",
        data: userData,
      };
    }

    throw new Error(data.message || "Failed to fetch user");

  } catch (error) {
    console.error("Error in fetchUserByEmail:", error);

    if (axios.isAxiosError(error)) {
      // Handle 404 Not Found specifically
      if (error.response?.status === 404) {
        console.log("User not found, attempting to create new user");
        try {
          const createUserResponse = await createUser({ email });
          if (createUserResponse.status === 201 && createUserResponse.data) {
            return {
              status: 200,
              message: "User created successfully",
              data: createUserResponse.data,
            };
          }
        } catch (createError) {
          console.error("Error creating user:", createError);
        }
      }

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

/**
 * Update existing user
 * @param data User data to update
 * @returns Promise with ApiResponse containing updated user data or error
 */
export const updateUser = async (
  data: UpdateUserPayload
): Promise<ApiResponse<IUser>> => {
  try {
    if (!process.env.SERVER_URL) {
      throw new Error("SERVER_URL environment variable is not defined");
    }

    const apiUrl = `${process.env.SERVER_URL}/user/updateUser`;

    // Transform data to match API expectations while keeping consistent field names
    const apiData = {
      name: data.name,
      phoneNumber: data.phoneNumber,
      dob: data.dob instanceof Date ? data.dob.toISOString() : data.dob,
      gender: data.gender,
      bloodGroup: data.bloodGroup,
      role: data.role,
      address: data.address ? [data.address] : [], // Convert to array format as expected by API
    };

    const response = await axios.post(apiUrl, apiData, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    console.log("Server response:", response.data);

    return {
      status: response.status,
      data: response.data.user,
      message: "Profile updated successfully",
    };

  } catch (error) {
    console.error("Error updating user:", error);

    if (axios.isAxiosError(error)) {
      return {
        status: error.response?.status || 500,
        message: error.response?.data?.message || "Failed to update user",
        error: error.message,
      };
    }

    return {
      status: 500,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Failed to update profile",
    };
  }
};
