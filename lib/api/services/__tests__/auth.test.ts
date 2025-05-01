import axios from "axios";
import { createUser, loginUser } from "../auth";
import { IUser } from "@/types/user.d.types";

// Mock axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("Auth Service", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		process.env.SERVER_URL = "http://test-server";
	});

	describe("createUser", () => {
		const mockUserData: Partial<IUser> = {
			email: "test@example.com",
			name: "Test User",
		};

		it("should successfully create a user", async () => {
			const mockResponse = {
				status: 201,
				data: {
					id: "user-123",
					message: "User created successfully",
				},
			};

			mockedAxios.post.mockResolvedValueOnce(mockResponse);

			const result = await createUser(mockUserData);

			expect(mockedAxios.post).toHaveBeenCalledWith(
				"http://test-server/user/signup",
				mockUserData,
				{
					headers: {
						"Content-Type": "application/json",
					},
					withCredentials: true,
				}
			);

			expect(result).toEqual({
				status: 201,
				message: mockResponse.data,
				data: "user-123",
			});
		});

		it("should handle creation error", async () => {
			const mockError = {
				response: {
					status: 400,
					data: {
						message: "Invalid user data",
					},
				},
				message: "Bad Request",
			};

			mockedAxios.post.mockRejectedValueOnce(mockError);

			const result = await createUser(mockUserData);

			expect(result).toEqual({
				status: 400,
				message: "Invalid user data",
				error: "Bad Request",
			});
		});
	});

	describe("loginUser", () => {
		const mockCredentials = {
			email: "test@example.com",
			authProvider: "google",
		};

		it("should successfully login user", async () => {
			const mockResponse = {
				status: 200,
				data: {
					user: {
						id: "user-123",
						email: "test@example.com",
						name: "Test User",
						phone: "1234567890",
						role: "patient",
						isVerified: true,
						providerType: "google",
						address: [],
						profilePic: "profile.jpg",
					},
				},
			};

			mockedAxios.post.mockResolvedValueOnce(mockResponse);

			const result = await loginUser(mockCredentials);

			expect(mockedAxios.post).toHaveBeenCalledWith(
				"http://test-server/user/login",
				{
					email: mockCredentials.email,
					authProvider: "google",
				},
				{
					headers: {
						"Content-Type": "application/json",
					},
					withCredentials: true,
				}
			);

			expect(result).toEqual({
				status: 200,
				message: "Login successful",
				data: {
					id: "user-123",
					email: "test@example.com",
					phone: "1234567890",
					name: "Test User",
					role: "patient",
					isVerified: true,
					providerType: "google",
					address: [],
					profilePic: "profile.jpg",
				},
			});
		});

		it("should handle login error", async () => {
			const mockError = {
				response: {
					status: 401,
					data: {
						message: "Invalid credentials",
					},
				},
				message: "Unauthorized",
			};

			mockedAxios.post.mockRejectedValueOnce(mockError);

			const result = await loginUser(mockCredentials);

			expect(result).toEqual({
				status: 401,
				message: "Invalid credentials",
				error: "Unauthorized",
			});
		});

		it("should handle missing user data in response", async () => {
			const mockResponse = {
				status: 200,
				data: {},
			};

			mockedAxios.post.mockResolvedValueOnce(mockResponse);

			const result = await loginUser(mockCredentials);

			expect(result).toEqual({
				status: 200,
				message: "Login successful",
				data: undefined,
			});
		});
	});
});
