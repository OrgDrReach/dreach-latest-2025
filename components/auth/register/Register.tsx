"use client";
import Image from "next/image";
import React, { useState } from "react";
import Header from "@/components/auth/login/header";
import Img from "@/public/websiteImages/registerpageImage.webp";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { registerUser } from "@/server-actions/user";
import { SignUpSchema, SignUpSchemaType } from "@/Zod/zod";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import ProviderModal from "./ProviderModal";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { EyeIcon, EyeOffIcon } from "lucide-react";

const Register = () => {
	const [loading, setLoading] = useState(false);
	const [showProviderModal, setShowProviderModal] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [selectedProviderRole, setSelectedProviderRole] = useState<
		"doctor" | "hospital" | "lab" | "pharmaceutical" | "ambulance" | undefined
	>(undefined);

	const router = useRouter();

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors, isSubmitting },
	} = useForm<SignUpSchemaType>({
		resolver: zodResolver(SignUpSchema),
		defaultValues: {
			userType: "patient",
		},
	});

	const onSubmit: SubmitHandler<SignUpSchemaType> = async (data) => {
		if (data.userType === "provider" && !selectedProviderRole) {
			setShowProviderModal(true);
			return;
		}

		try {
			setLoading(true);
			const res = await registerUser({
				...data,
				providerRole: selectedProviderRole,
			});

			if (res.status !== 201) {
				toast.error(res.message || "Registration failed");
				setLoading(false);
				return;
			}

			toast.success(
				"Registration successful! Please verify your phone number."
			);
			router.push(`/auth/verify?phone=${data.phone}`);
		} catch (error) {
			toast.error("An error occurred during registration");
			setLoading(false);
		}
	};

	const handleProviderRoleSelect = (
		role: "doctor" | "hospital" | "lab" | "pharmaceutical" | "ambulance"
	) => {
		setSelectedProviderRole(role);
		handleSubmit(onSubmit)();
	};

	const handleGoogleSignIn = () => {
		signIn("google", {
			callbackUrl: "/auth/complete-profile",
			redirect: true,
		});
	};

	return (
		<section className="min-h-screen flex flex-col bg-[#d8eaee] dark:bg-[#1F2C3B]">
			<Header />
			<div className="flex-1 flex justify-center items-center xl:space-x-20 space-x-0 lg:space-x-6 p-4">
				<div className="hidden lg:block">
					<Image
						src={Img}
						alt="Register Page Image"
						className="w-96 opacity-90 transition-opacity hover:opacity-100"
						priority
						style={{
							maxWidth: "100%",
							height: "auto",
						}}
					/>
				</div>
				<div className="w-full max-w-md">
					<div className="bg-offer rounded-xl shadow-lg p-8 transform transition-all hover:shadow-xl">
						<h2 className="text-3xl font-bold text-center text-orange-400 mb-8">
							Create Account
						</h2>
						<div className="space-y-6">
							<button
								onClick={handleGoogleSignIn}
								type="button"
								className="w-full flex items-center justify-center gap-3 px-4 py-3 text-gray-700 bg-white rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#31addb] transition-all duration-200 hover:scale-[1.02]">
								<FcGoogle className="w-5 h-5" />
								<span>Sign up with Google</span>
							</button>
							<div className="relative">
								<div className="absolute inset-0 flex items-center">
									<div className="w-full border-t border-gray-300"></div>
								</div>
								<div className="relative flex justify-center text-sm">
									<span className="px-2 text-white bg-offer">
										Or register with
									</span>
								</div>
							</div>
							<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
								<div className="grid grid-cols-2 gap-4">
									<div>
										<label className="text-sm font-medium text-white">
											First Name
										</label>
										<input
											type="text"
											{...register("firstName")}
											placeholder="Enter your first name"
											className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-lg focus:ring-[#31addb] focus:border-[#31addb] bg-white transition-all duration-200"
										/>
										{errors.firstName && (
											<p className="mt-1 text-sm text-red-500">
												{errors.firstName.message}
											</p>
										)}
									</div>
									<div>
										<label className="text-sm font-medium text-white">
											Last Name
										</label>
										<input
											type="text"
											{...register("lastName")}
											placeholder="Enter your last name"
											className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-lg focus:ring-[#31addb] focus:border-[#31addb] bg-white transition-all duration-200"
										/>
										{errors.lastName && (
											<p className="mt-1 text-sm text-red-500">
												{errors.lastName.message}
											</p>
										)}
									</div>
								</div>
								<div>
									<label className="text-sm font-medium text-white">
										Email
									</label>
									<input
										type="email"
										{...register("email")}
										placeholder="Enter your email"
										className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-lg focus:ring-[#31addb] focus:border-[#31addb] bg-white transition-all duration-200"
									/>
									{errors.email && (
										<p className="mt-1 text-sm text-red-500">
											{errors.email.message}
										</p>
									)}
								</div>
								<div>
									<label className="text-sm font-medium text-white">
										Mobile Number
									</label>
									<div className="flex gap-2">
										<select
											name="countryCode"
											className="px-3 py-3 mt-1 border border-gray-300 rounded-lg focus:ring-[#31addb] focus:border-[#31addb] bg-white transition-all duration-200">
											<option value="+91">+91 (IND)</option>
											<option value="+1">+1 (USA)</option>
											<option value="+44">+44 (UK)</option>
										</select>
										<input
											type="tel"
											{...register("phone")}
											placeholder="Enter mobile number"
											className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-lg focus:ring-[#31addb] focus:border-[#31addb] bg-white transition-all duration-200"
										/>
									</div>
									{errors.phone && (
										<p className="mt-1 text-sm text-red-500">
											{errors.phone.message}
										</p>
									)}
								</div>
								<div>
									<label className="text-sm font-medium text-white">
										Sign up as
									</label>
									<div className="grid grid-cols-2 gap-4 mt-1">
										<label
											className={`flex items-center justify-center px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 ${
												watch("userType") === "patient" ?
													"bg-[#31addb] text-white shadow-md transform scale-[1.02]"
												:	"bg-white text-gray-700 hover:bg-gray-50"
											}`}>
											<input
												type="radio"
												{...register("userType")}
												value="patient"
												className="hidden"
											/>
											<span className="flex items-center gap-2">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="w-5 h-5"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth="2">
													<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
													<circle cx="12" cy="7" r="4" />
												</svg>
												<span>Patient</span>
											</span>
										</label>
										<label
											className={`flex items-center justify-center px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 ${
												watch("userType") === "provider" ?
													"bg-[#31addb] text-white shadow-md transform scale-[1.02]"
												:	"bg-white text-gray-700 hover:bg-gray-50"
											}`}>
											<input
												type="radio"
												{...register("userType")}
												value="provider"
												className="hidden"
											/>
											<span className="flex items-center gap-2">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="w-5 h-5"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth="2">
													<path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
													<path d="M3 9V7a2 2 0 0 1 2-2h2.93a2 2 0 0 0 1.664-.89l.812-1.22A2 2 0 0 1 12.07 2h1.86a2 2 0 0 1 1.664.89l.812 1.22A2 2 0 0 0 18.07 5H19a2 2 0 0 1 2 2v2" />
													<circle cx="12" cy="13" r="3" />
												</svg>
												<span>Provider</span>
											</span>
										</label>
									</div>
									{errors.userType && (
										<p className="mt-1 text-sm text-red-500">
											{errors.userType.message}
										</p>
									)}
								</div>
								<div>
									<label className="text-sm font-medium text-white">
										Password
									</label>
									<div className="relative">
										<input
											type={showPassword ? "text" : "password"}
											{...register("password")}
											placeholder="Create a password"
											className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-lg focus:ring-[#31addb] focus:border-[#31addb] bg-white transition-all duration-200"
										/>
										<button
											type="button"
											onClick={() => setShowPassword(!showPassword)}
											className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none">
											{showPassword ?
												<EyeOffIcon className="w-5 h-5" />
											:	<EyeIcon className="w-5 h-5" />}
										</button>
									</div>
									{errors.password && (
										<p className="mt-1 text-sm text-red-500">
											{errors.password.message}
										</p>
									)}
								</div>
								<button
									type="submit"
									disabled={isSubmitting || loading}
									className="w-full px-4 py-3 text-white bg-[#31addb] rounded-lg hover:bg-[#00bbff] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#31addb] transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed">
									{loading ?
										<span className="flex items-center justify-center">
											<svg
												className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24">
												<circle
													className="opacity-25"
													cx="12"
													cy="12"
													r="10"
													stroke="currentColor"
													strokeWidth="4"></circle>
												<path
													className="opacity-75"
													fill="currentColor"
													d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
											</svg>
											Creating account...
										</span>
									:	"Create Account"}
								</button>
							</form>
							<p className="text-center text-white">
								Already have an account?{" "}
								<Link
									href="/auth/login"
									className="text-orange-400 hover:text-orange-500 transition-colors duration-200">
									Sign in
								</Link>
							</p>
						</div>
					</div>
				</div>
			</div>
			<ProviderModal
				isOpen={showProviderModal}
				onClose={() => setShowProviderModal(false)}
				onSubmit={handleProviderRoleSelect}
			/>
		</section>
	);
};

export default Register;
