"use client";
import Header from "@/components/auth/login/header";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Img from "@/public/websiteImages/registerpageImage.webp";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInSchema, SignInSchemaType } from "@/Zod/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FcGoogle } from "react-icons/fc";
import { EyeIcon, EyeOffIcon } from "lucide-react";

const Login = () => {
	const router = useRouter();
	const [showPassword, setShowPassword] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<SignInSchemaType>({ resolver: zodResolver(SignInSchema) });

	const onSubmit: SubmitHandler<SignInSchemaType> = async (data) => {
		try {
			const result = await signIn("credentials", {
				phone: data.phone,
				password: data.password,
				redirect: false,
			});

			if (!result?.error) {
				toast.success("Login successful");
				router.push("/dashboard");
			} else {
				toast.error("Invalid credentials");
			}
		} catch (error) {
			toast.error("An error occurred during login");
		}
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
						alt="Login Page Image"
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
							Welcome Back
						</h2>
						<div className="space-y-6">
							<button
								onClick={handleGoogleSignIn}
								type="button"
								className="w-full flex items-center justify-center gap-3 px-4 py-3 text-gray-700 bg-white rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#31addb] transition-all duration-200 hover:scale-[1.02]">
								<FcGoogle className="w-5 h-5" />
								<span>Continue with Google</span>
							</button>
							<div className="relative">
								<div className="absolute inset-0 flex items-center">
									<div className="w-full border-t border-gray-300"></div>
								</div>
								<div className="relative flex justify-center text-sm">
									<span className="px-2 text-white bg-offer">
										Or continue with
									</span>
								</div>
							</div>
							<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
											placeholder="Enter your mobile number"
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
										Password
									</label>
									<div className="relative">
										<input
											type={showPassword ? "text" : "password"}
											{...register("password")}
											placeholder="Enter your password"
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
								<div className="flex items-center justify-between">
									<div className="flex items-center">
										<input
											type="checkbox"
											className="h-4 w-4 text-[#31addb] focus:ring-[#31addb] border-gray-300 rounded transition-colors duration-200"
										/>
										<label className="ml-2 block text-sm text-white">
											Remember me
										</label>
									</div>
									<Link
										href="/auth/forgot-password"
										className="text-sm text-orange-400 hover:text-orange-500 transition-colors duration-200">
										Forgot password?
									</Link>
								</div>
								<button
									type="submit"
									disabled={isSubmitting}
									className="w-full px-4 py-3 text-white bg-[#31addb] rounded-lg hover:bg-[#00bbff] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#31addb] transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed">
									{isSubmitting ?
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
											Signing in...
										</span>
									:	"Sign in"}
								</button>
							</form>
							<p className="text-center text-white">
								Don&apos;t have an account?{" "}
								<Link
									href="/auth/register"
									className="text-orange-400 hover:text-orange-500 transition-colors duration-200">
									Register
								</Link>
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Login;
