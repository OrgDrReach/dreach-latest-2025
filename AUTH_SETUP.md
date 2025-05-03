# Important Auth/Oauth tweak settings never to be played again

- [Important Auth/Oauth tweak settings never to be played again](#important-authoauth-tweak-settings-never-to-be-played-again)
  - [1. CompleteProfile.tsx](#1-completeprofiletsx)
  - [2. auth.ts](#2-authts)
  - [3. user.ts](#3-userts)

## 1. CompleteProfile.tsx

`Code_Updated At 02/05/2025`

```typescript
"use client";

import { mapBloodGroup } from "@/utils/bloodGroupUtils";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import { EUserRole, EGender } from "@/types/auth.d.types";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
	updateUser,
	fetchUserByEmail,

} from "@/lib/api/services/user";

// Define a more complete Session type that includes our custom fields
interface ExtendedUser {
	userId: string;
	email?: string | null;
	name?: string | null;
	image?: string | null;
	phone?: string | null;
	role?: EUserRole;
	authProvider?: string;
}

interface ExtendedSession extends Omit<Session, "user"> {
	user?: ExtendedUser;
}

interface ProfileFormData {
	name: string;
	phone: string;
	dob: string;
	gender: EGender;
	bloodGroup?: "A+" | "A-" | "B+" | "B-" | "O+" | "O-" | "AB+" | "AB-";
	role: EUserRole;
	address?: {
		address?: string;
		city?: string;
		state?: string;
		country?: string;
		pincode?: string;
	};
	otp: string;
}

const profileSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters"),
	phone: z
		.string()
		.min(10, "Phone number must be at least 10 digits")
		.max(15)
		.regex(/^\+?[1-9]\d{9,14}$/, "Please enter a valid phone number"),
	dob: z.string().min(1, "Date of birth is required"),
	gender: z.nativeEnum(EGender, {
		required_error: "Please select a gender",
	}),
	bloodGroup: z
		.enum(["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"])
		.optional(),
	role: z.nativeEnum(EUserRole, {
		required_error: "Please select a role",
		invalid_type_error: "Invalid role selected",
	}),
	address: z
		.object({
			address: z.string().optional(),
			city: z.string().optional(),
			state: z.string().optional(),
			country: z.string().optional(),
			pincode: z.string().optional(),
		})
		.optional(),
	otp: z.string().length(4, "OTP must be 4 digits"),
});

type OtpResponse = {
	message: string;
};

interface UserLookupResponse {
	id: string;
	userId: string;
	email: string;
}

export default function CompleteProfile() {
	const router = useRouter();
	const { data: session, update } = useSession({
		required: true,
		onUnauthenticated() {
			router.push("/auth/signin");
		},
	}) as {
		data: ExtendedSession | null;
		update: () => Promise<ExtendedSession | null>;
	};

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showOtpField, setShowOtpField] = useState(false);
	const [isOtpVerified, setIsOtpVerified] = useState(false);
	const [isOtpSent, setIsOtpSent] = useState(false);
	const [userData, setUserData] = useState<UserLookupResponse | null>(null);
	const [fetchError, setFetchError] = useState<string | null>(null);

	const form = useForm<ProfileFormData>({
		resolver: zodResolver(profileSchema),
		defaultValues: {
			name: session?.user?.name || "",
			phone: session?.user?.phone || "",
			dob: "",
			gender: EGender.MALE,
			bloodGroup: undefined,
			role: session?.user?.role || EUserRole.PATIENT,
			address: {
				address: "",
				city: "",
				state: "",
				country: "",
				pincode: "",
			},
			otp: "",
		},
		mode: "onChange",
	});

	const sendOtp = async () => {
		const phone = form.getValues("phone");

		const phoneValidation = await form.trigger("phone");
		if (!phoneValidation) {
			return;
		}

		try {
			setIsSubmitting(true);
			const response = await fetch("/api/auth/send-otp", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ phone }),
			});

			const data: OtpResponse = await response.json();

			if (!response.ok) {
				throw new Error(data.message || "Failed to send OTP");
			}

			setShowOtpField(true);
			setIsOtpSent(true);
			toast.success("OTP sent successfully");
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Failed to send OTP";
			toast.error(message);
			console.error("Error sending OTP:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const verifyOtp = async (otp: string) => {
		const otpValidation = await form.trigger("otp");
		if (!otpValidation) {
			return;
		}

		try {
			setIsSubmitting(true);
			const response = await fetch("/api/auth/verify-otp", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					phone: form.getValues("phone"),
					otp,
				}),
			});

			const data: OtpResponse = await response.json();

			if (!response.ok) {
				throw new Error(data.message || "Invalid OTP");
			}

			setIsOtpVerified(true);
			toast.success("Phone number verified successfully");
		} catch (error) {
			const message = error instanceof Error ? error.message : "Invalid OTP";
			toast.error(message);
			console.error("Error verifying OTP:", error);
			form.setValue("otp", "");
		} finally {
			setIsSubmitting(false);
		}
	};

	const fetchUserByEmailHandler = async (email: string) => {
		try {
			console.log("Fetching user by email:", email);
			const response = await fetchUserByEmail(email);
			console.log("User fetch response:", response);

			if (response.status === 200 && response.data) {
				setUserData(response.data);
				setFetchError(null);
				return response.data;
			}

			throw new Error(response.message || "Failed to fetch user data");
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Failed to fetch user data";
			console.error("Error fetching user:", errorMessage);
			setFetchError(errorMessage);
			setUserData(null);
			toast.error(errorMessage);
			return null;
		}
	};

	async function onSubmit(data: ProfileFormData) {
		if (!isOtpVerified) {
			toast.error("Please verify your phone number first");
			return;
		}

		if (!session?.user?.email) {
			toast.error("Email is required to continue");
			return;
		}

		try {
			setIsSubmitting(true);

			// First, fetch or create the user using the email
			const userResponse = await fetchUserByEmailHandler(session.user.email);
			if (!userResponse) {
				throw new Error("Failed to fetch or create user");
			}
			const mappedBloodGroup = mapBloodGroup(data.bloodGroup);
			// Update the form data with the user ID
			const updateData = {
				...data,
				userId: userResponse.userId,
				bloodGroup: mappedBloodGroup,
			};

			// Update the user profile
			const updateResponse = await updateUser(updateData);

			if (updateResponse.status === 200 || updateResponse.status === 201) {
				if (updateResponse.data) {
					await update(); // Update the session with new user data
					toast.success("Profile updated successfully");
					router.push("/dashboard");
				} else {
					throw new Error("No data received from server");
				}
			} else {
				throw new Error(
					updateResponse.error ||
						updateResponse.message ||
						"Failed to update profile"
				);
			}
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Failed to update profile";
			console.error("Complete profile error:", error);
			toast.error(errorMessage);
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<div className="flex flex-col items-center justify-center bg-[#d8eaee] dark:bg-[#1F2C3B] p-4">
			<div className="w-full max-w-md">
				<div className="bg-offer rounded-xl shadow-lg p-8">
					<h2 className="text-3xl font-bold text-center text-orange-400 mb-8">
						Complete Your Profile
					</h2>
					<p className="text-white text-center mb-6">
						Please verify your phone number and select your role
					</p>

					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-6 w-full max-w-[500px] mx-auto">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem className="w-full">
										<FormLabel className="text-white">Full Name</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder="Enter your full name"
												className="h-12 bg-white text-white placeholder:text-black dark:placeholder:text-white focus:ring-[#31addb] focus:border-[#31addb]"
											/>
										</FormControl>
										<FormMessage className="text-red-400" />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="dob"
								render={({ field }) => (
									<FormItem className="w-full">
										<FormLabel className="text-white">Date of Birth</FormLabel>
										<FormControl>
											<Input
												{...field}
												type="date"
												className="h-12 bg-white text-black dark:text-white placeholder:text-black    focus:ring-[#31addb] focus:border-[#31addb]"
											/>
										</FormControl>
										<FormMessage className="text-red-400" />
									</FormItem>
								)}
							/>

							<div className="w-full space-y-6">
								<div className="grid grid-cols-2 gap-4">
									<FormField
										control={form.control}
										name="gender"
										render={({ field }) => (
											<FormItem className="w-full">
												<FormLabel className="text-white">Gender</FormLabel>
												<Select
													onValueChange={field.onChange}
													defaultValue={field.value}>
													<FormControl>
														<SelectTrigger className="h-14 bg-white text-black dark:text-white focus:ring-[#31addb] focus:border-[#31addb]">
															<SelectValue
																placeholder="Select gender"
																className="text-black dark:placeholder:text-white dark:text-white placeholder:text-black"
															/>
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														<SelectItem value={EGender.MALE}>Male</SelectItem>
														<SelectItem value={EGender.FEMALE}>
															Female
														</SelectItem>
														<SelectItem value={EGender.OTHER}>Other</SelectItem>
													</SelectContent>
												</Select>
												<FormMessage className="text-red-400" />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="bloodGroup"
										render={({ field }) => (
											<FormItem className="w-full">
												<FormLabel className="text-white">
													Blood Group (Optional)
												</FormLabel>
												<Select
													onValueChange={field.onChange}
													defaultValue={field.value}>
													<FormControl>
														<SelectTrigger className="h-14 bg-white text-black dark:text-white focus:ring-[#31addb] focus:border-[#31addb]">
															<SelectValue
																placeholder="Select blood group"
																className="text-black dark:placeholder:text-white dark:text-white placeholder:text-black"
															/>
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{[
															"A+",
															"A-",
															"B+",
															"B-",
															"O+",
															"O-",
															"AB+",
															"AB-",
														].map((group) => (
															<SelectItem key={group} value={group}>
																{group}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												<FormMessage className="text-red-400" />
											</FormItem>
										)}
									/>
								</div>
							</div>

							<FormField
								control={form.control}
								name="phone"
								render={({ field }) => (
									<FormItem className="w-full">
										<FormLabel className="text-white">Phone Number</FormLabel>
										<div className="flex gap-2 w-full">
											<div className="flex flex-1">
												<FormControl>
													<div className="flex w-full">
														<div className="flex items-center justify-center h-12 px-3 border border-r-0 rounded-l-md bg-white text-gray-900">
															+91
														</div>
														<Input
															{...field}
															value={
																field.value.startsWith("+91") ?
																	field.value.slice(3)
																:	field.value
															}
															onChange={(e) => {
																const value = e.target.value;
																const sanitizedValue = value
																	.replace(/\D/g, "")
																	.slice(0, 10);
																field.onChange(`+91${sanitizedValue}`);
															}}
															type="tel"
															placeholder="Enter your number"
															className="flex-1 rounded-l-none h-12 bg-white dark:text-white text-black placeholder:text-black dark:placeholder:text-white focus:ring-[#31addb] focus:border-[#31addb]"
															disabled={isOtpVerified}
														/>
													</div>
												</FormControl>
											</div>
											<Button
												type="button"
												onClick={sendOtp}
												disabled={
													isSubmitting || isOtpVerified || !field.value.length
												}
												className="h-12 min-w-[120px] whitespace-nowrap bg-[#31addb] hover:bg-[#00bbff] text-white">
												{isOtpSent ? "Resend OTP" : "Send OTP"}
											</Button>
										</div>
										<FormMessage className="text-red-400" />
									</FormItem>
								)}
							/>

							{showOtpField && (
								<FormField
									control={form.control}
									name="otp"
									render={({ field }) => (
										<FormItem className="w-full">
											<FormLabel className="text-white">Enter OTP</FormLabel>
											<div className="flex gap-2 w-full">
												<FormControl className="flex-1">
													<Input
														{...field}
														placeholder="Enter 4-digit OTP"
														maxLength={4}
														disabled={isOtpVerified}
														className="h-12 bg-white text-black dark:text-white placeholder:text-black dark:placeholder:text-white focus:ring-[#31addb] focus:border-[#31addb]"
													/>
												</FormControl>
												<Button
													type="button"
													onClick={() => verifyOtp(field.value)}
													disabled={
														isSubmitting || isOtpVerified || !field.value
													}
													className="h-12 min-w-[120px] whitespace-nowrap bg-[#31addb] hover:bg-[#00bbff] text-white">
													Verify OTP
												</Button>
											</div>
											<FormMessage className="text-red-400" />
										</FormItem>
									)}
								/>
							)}

							<FormField
								control={form.control}
								name="role"
								render={({ field }) => (
									<FormItem className="w-full">
										<FormLabel className="text-white">Select Role</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
											disabled={!isOtpVerified}>
											<FormControl>
												<SelectTrigger className="h-14 bg-white text-black dark:text-white focus:ring-[#31addb] focus:border-[#31addb]">
													<SelectValue
														placeholder="Select your role"
														className="text-white placeholder:text-black dark:placeholder:text-white"
													/>
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value={EUserRole.PATIENT}>
													Patient
												</SelectItem>
												<SelectItem value={EUserRole.DOCTOR}>Doctor</SelectItem>
												<SelectItem value={EUserRole.HOSPITAL}>
													Hospital
												</SelectItem>
												<SelectItem value={EUserRole.LAB}>
													Laboratory
												</SelectItem>
												<SelectItem value={EUserRole.PHARMACEUTICAL}>
													Pharmaceutical
												</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage className="text-red-400" />
									</FormItem>
								)}
							/>

							<div className="space-y-4 w-full border-t border-gray-700 pt-6 mt-6">
								<FormLabel className="text-white block mb-4">
									Address Details (Optional)
								</FormLabel>

								<FormField
									control={form.control}
									name="address.address"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<Input
													{...field}
													placeholder="Street Address"
													className="h-12 bg-white text-black dark:text-white placeholder:text-black dark:placeholder:text-white focus:ring-[#31addb] focus:border-[#31addb]"
												/>
											</FormControl>
											<FormMessage className="text-red-400" />
										</FormItem>
									)}
								/>

								<div className="grid grid-cols-2 gap-4">
									<FormField
										control={form.control}
										name="address.city"
										render={({ field }) => (
											<FormItem>
												<FormControl>
													<Input
														{...field}
														placeholder="City"
														className="h-12 bg-white text-black dark:text-white placeholder:text-black dark:placeholder:text-white focus:ring-[#31addb] focus:border-[#31addb]"
													/>
												</FormControl>
												<FormMessage className="text-red-400" />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="address.state"
										render={({ field }) => (
											<FormItem>
												<FormControl>
													<Input
														{...field}
														placeholder="State"
														className="h-12 bg-white text-black dark:text-white placeholder:text-black dark:placeholder:text-white focus:ring-[#31addb] focus:border-[#31addb]"
													/>
												</FormControl>
												<FormMessage className="text-red-400" />
											</FormItem>
										)}
									/>
								</div>

								<div className="grid grid-cols-2 gap-4">
									<FormField
										control={form.control}
										name="address.country"
										render={({ field }) => (
											<FormItem>
												<FormControl>
													<Input
														{...field}
														placeholder="Country"
														className="h-12 bg-white text-black dark:text-white placeholder:text-black dark:placeholder:text-white focus:ring-[#31addb] focus:border-[#31addb]"
													/>
												</FormControl>
												<FormMessage className="text-red-400" />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="address.pincode"
										render={({ field }) => (
											<FormItem>
												<FormControl>
													<Input
														{...field}
														placeholder="Pincode"
														className="h-12 bg-white text-black dark:text-white placeholder:text-black dark:placeholder:text-white focus:ring-[#31addb] focus:border-[#31addb]"
													/>
												</FormControl>
												<FormMessage className="text-red-400" />
											</FormItem>
										)}
									/>
								</div>
							</div>

							<Button
								type="submit"
								className="w-full h-12 text-lg font-semibold bg-[#31addb] hover:bg-[#00bbff] text-white disabled:opacity-50 disabled:cursor-not-allowed"
								disabled={
									isSubmitting ||
									!isOtpVerified ||
									!form.getValues("name") ||
									!form.getValues("phone") ||
									!form.getValues("dob") ||
									!form.getValues("gender") ||
									!form.getValues("role")
								}>
								{isSubmitting ? "Saving..." : "Submit"}
							</Button>
						</form>
					</Form>
				</div>
			</div>
		</div>
	);
}
```

## 2. auth.ts

`Code_Updated At 02/05/2025`

```typescript
import axios from "axios";
import { IUser } from "@/types/user.d.types";

interface LoginResponse {
  id: string;
  email: string;
  phone: string;
  name: string;
  role: string;
  isVerified: boolean;
  providerType?: string;
  address?: any;
  profilePic?: string;
}

interface ApiResponse<T> {
  status: number;
  message: string;
  data?: T;
  error?: string;
}

interface ErrorResponse {
  status: number;
  message: string;
  error: string;
}

// Create a utility function for consistent error handling
const handleApiError = (
  error: unknown,
  defaultMessage: string
): ApiResponse<any> => {
  console.error(`API Error: ${defaultMessage}`, error);

  if (axios.isAxiosError(error)) {
    // Check if the error has a response
    if (error.response) {
      return {
        status: error.response.status,
        message: error.response.data?.message || defaultMessage,
        error: error.message,
      };
    }
    // Handle network errors or timeouts
    return {
      status: 503,
      message: "Service unavailable",
      error: error.message,
    };
  }

  // For non-Axios errors
  return {
    status: 500,
    message: "Internal server error",
    error: error instanceof Error ? error.message : "Unknown error occurred",
  };
};

/**
 * Create new user
 * @param userData Partial user data for registration
 * @returns Promise with ApiResponse containing user data or error
 */
export const createUser = async (
  userData: Partial<IUser>
): Promise<ApiResponse<IUser>> => {
  try {
    const res = await fetch(`${process.env.SERVER_URL}/user/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(userData),
    });
    console.log(`"user is being created", ${JSON.stringify(userData)}`);

    const data = await res.json();

    console.log(data);
    return {
      status: res.status,
      message: data,
      data: data.userId,
    };
  } catch (error) {
    console.error("Error creating user:", error);
    return {
      status: 500,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

/**
 * Login user with Google auth
 * @param credentials Google auth credentials
 * @returns Promise with ApiResponse containing user data or error
 */
export const loginUser = async (credentials: {
  email: string;
  authProvider: string;
}): Promise<ApiResponse<LoginResponse>> => {
  try {
    const loginData = {
      email: credentials.email,
      authProvider: "google",
    };

    const response = await axios.post(
      `${process.env.SERVER_URL}/user/login`,
      loginData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    console.log(`User login attempt with Google: ${JSON.stringify(loginData)}`);

    const data = response.data;

    // Transform and validate user data

    return {
      status: response.status,
      message: "Login successful",
      data: data.user
        ? {
            id: data.user.id,
            email: data.user.email,
            phone: data.user.phone || "",
            name: data.user.name,
            role: data.user.role,
            isVerified: data.user.isVerified,
            providerType: data.user.providerType,
            address: data.user.address || [],
            profilePic: data.user.profilePic || "",
          }
        : undefined,
    };
  } catch (error) {
    console.error("Login error:", error);
    return handleApiError(error, "Login error:");
  }
};
```

## 3. user.ts

`Code_Updated At 02/05/2025`

```typescript
"use server";

import { IUser, IPatient } from "@/types/user.d.types";
import { EUserRole, EUserStatus, EGender } from "@/types/auth.d.types";

interface UpdateUserPayload {
  userId: string;
  name: string;
  phone: string;
  dob: string | Date;
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
  message?: string;
  error?: string;
  data?: T;
}

/**
 * Create new user
 */
export const createUser = async (
  userData: Partial<IUser>
): Promise<ApiResponse<IUser>> => {
  try {
    const res = await fetch(`${process.env.SERVER_URL}/user/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(userData),
    });
    console.log(`"user is being created", ${JSON.stringify(userData)}`);

    const data = await res.json();

    console.log(data);
    return {
      status: res.status,
      message: data,
      data: data.userId,
    };
  } catch (error) {
    console.error("Error creating user:", error);
    return {
      status: 500,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

/**
 * Fetch user data by ID
 */
export const fetchUserById = async (
  userId: string
): Promise<ApiResponse<IUser>> => {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const res = await fetch(
      `${process.env.SERVER_URL}/user/fetchUserById/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    const data = await res.json();
    console.log("Response data:", data);

    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch user");
    }

    return {
      status: res.status,
      message: data.message,
      data: data.user,
    };
  } catch (error) {
    console.error("Error fetching user:", error);
    return {
      status: 500,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

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
    const res = await fetch(
      `${process.env.SERVER_URL}/user/fetchUserByEmail/?email=${encodeURIComponent(email)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    const data = await res.json();
    console.log("Response status:", res.status);
    console.log("Response data:", data);

    // Handle user found
    if (res.ok && data?.userId) {
      console.log("User found with ID:", data.userId);
      return {
        status: 200,
        message: "User found successfully",
        data,
      };
    }

    // Handle user not found
    if (res.status === 404) {
      console.log("User not found, creating new user");
      const createUserResponse = await createUser({
        email,
        role: EUserRole.PATIENT,
        status: EUserStatus.ACTIVE,
      });

      if (createUserResponse.status === 201 && createUserResponse.data) {
        return {
          status: 201,
          message: "User created successfully",
          data: createUserResponse.data,
        };
      }
      throw new Error(createUserResponse.message || "Failed to create user");
    }

    // Handle unexpected response
    throw new Error(data.message || "Unexpected error occurred");
  } catch (error) {
    console.error("Error in fetchUserByEmail:", error);
    return {
      status: 500,
      message: error instanceof Error ? error.message : "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

/**
 * Update existing user
 */
export const updateUser = async (
  data: UpdateUserPayload
): Promise<ApiResponse<IUser>> => {
  try {
    if (!process.env.SERVER_URL) {
      throw new Error("SERVER_URL environment variable is not defined");
    }

    const apiUrl = `${process.env.SERVER_URL}/user/updateUser`;

    // Transform data to match API expectations
    const apiData = {
      name: data.name,
      phone: data.phone, // Ensure this matches the backend field
      dob: data.dob instanceof Date ? data.dob.toISOString() : data.dob,
      gender: data.gender,
      bloodGroup: data.bloodGroup,
      address: data.address ? { ...data.address } : undefined, // Ensure address matches the backend structure
      userId: data.userId,
    };

    console.log("Payload sent to update user:", apiData);

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(apiData),
    });

    const responseData = await response.json();
    console.log("Server response:", responseData);

    if (!response.ok) {
      throw new Error(responseData.message || "Failed to update user");
    }

    return {
      status: response.status,
      data: responseData.user,
      message: "Profile updated successfully",
    };
  } catch (error) {
    console.error("Error updating user:", error);
    return {
      status: 500,
      error:
        error instanceof Error ? error.message : "Failed to update profile",
    };
  }
};

/**
 * Fetch patient profile with medical history
 */
export const fetchPatientProfile = async (
  userId: string
): Promise<ApiResponse<IPatient>> => {
  try {
    const res = await fetch(
      `${process.env.SERVER_URL}/user/patient/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    const data = await res.json();

    return {
      status: res.status,
      message: data.message,
      data: data.patient,
    };
  } catch (error) {
    console.error("Error fetching patient profile:", error);
    return {
      status: 500,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

/**
 * Delete user account
 */
export const deleteUser = async (
  userId: string
): Promise<ApiResponse<void>> => {
  try {
    const res = await fetch(`${process.env.SERVER_URL}/user/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const data = await res.json();

    return {
      status: res.status,
      message: data.message,
    };
  } catch (error) {
    console.error("Error deleting user:", error);
    return {
      status: 500,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};
```
