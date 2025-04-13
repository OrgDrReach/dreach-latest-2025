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

const Register = () => {
	const [loading, setLoading] = useState(false);
	const [showProviderModal, setShowProviderModal] = useState(false);
	const [selectedProviderRole, setSelectedProviderRole] = useState<
		"doctor" | "hospital" | "lab" | "pharmaceutical" | "ambulance" | undefined
	>(undefined);

	const router = useRouter();

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
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

	return (
		<section className="h-screen flex flex-col bg-[#d8eaee] dark:bg-[#1F2C3B]">
			<Header />
			<div className="flex justify-center xl:space-x-20 lg:space-x-6 space-x-0 bg-[#d8eaee] dark:bg-[#1F2C3B]">
				<div className="hidden lg:block">
					<Image
						src={Img}
						alt="Register Page Image"
						className="w-96 mt-24"
						style={{
							maxWidth: "100%",
							height: "auto",
						}}
					/>
				</div>
				<div>
					<div className="md:w-[450px] w-[345px] px-6 md:px-8 py-6 space-y-6 bg-offer rounded-xl shadow-md">
						<h2 className="text-[26px] font-bold text-center text-orange-400 pb-1">
							Register
						</h2>
						<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
							<div className="flex space-x-2">
								<div>
									<label className="text-[15px] font-[590] text-white">
										First Name
									</label>
									<input
										title="First Name"
										placeholder="Enter Your First Name"
										type="text"
										{...register("firstName")}
										className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-[#31addb] "
									/>
									{errors.firstName && (
										<span className="mt-1 text-red-400">
											{errors.firstName.message}
										</span>
									)}
								</div>
								<div>
									<label className="text-[15px] font-[590] text-white">
										Last Name
									</label>
									<input
										title="Last Name"
										placeholder="Enter Your Last Name"
										type="text"
										{...register("lastName")}
										className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-[#31addb]"
									/>
									{errors.lastName && (
										<span className="mt-1 text-red-400">
											{errors.lastName.message}
										</span>
									)}
								</div>
							</div>
							<div>
								<label className="block text-sm font-medium text-white">
									Mobile Number
								</label>
								<div className="flex">
									<select
										name="countryCode"
										title="country code selection"
										className="px-3 py-2 mt-1 border text-[15px] font-[590] border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-[#31addb]">
										<option value="+91">+91 (IND)</option>
										<option value="+1">+1 (USA)</option>
										<option value="+44">+44 (UK)</option>
									</select>
									<input
										title="Mobile Number"
										placeholder="Enter Your Mobile Number"
										type="text"
										min={0}
										{...register("phone", {
											setValueAs: (value) => Number(value),
										})}
										className="w-full px-3 py-2 text-[15px] font-[590] mt-1 ml-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-[#31addb]"
									/>
								</div>
								{errors.phone && (
									<span className="mt-1 text-red-400">
										{errors.phone.message}
									</span>
								)}
							</div>
							<div>
								<label className="text-[15px] font-[590] text-white">
									Email Address
								</label>
								<input
									title="Email"
									placeholder="Enter Your Email Address"
									type="email"
									{...register("email")}
									className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-[#31addb]"
								/>
								{errors.email && (
									<span className="mt-1 text-red-400">
										{errors.email.message}
									</span>
								)}
							</div>
							<div className="space-y-3">
								<label className="block text-sm text-[15px] font-[590] text-white">
									Sign up as a
								</label>
								<div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 bg-opacity-20 rounded-lg">
									<label
										className={`flex items-center justify-center px-4 py-2 rounded-md cursor-pointer transition-all duration-200 ${
											watch("userType") === "patient" ?
												"bg-[#31addb] text-white shadow-md transform scale-[1.02]"
											:	"text-white hover:bg-gray-200 hover:bg-opacity-20"
										}`}>
										<input
											type="radio"
											{...register("userType")}
											value="patient"
											defaultChecked
											className="hidden"
										/>
										<span className="flex items-center space-x-2">
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
										className={`flex items-center justify-center px-4 py-2 rounded-md cursor-pointer transition-all duration-200 ${
											watch("userType") === "provider" ?
												"bg-[#31addb] text-white shadow-md transform scale-[1.02]"
											:	"text-white hover:bg-gray-200 hover:bg-opacity-20"
										}`}>
										<input
											type="radio"
											{...register("userType")}
											value="provider"
											className="hidden"
										/>
										<span className="flex items-center space-x-2">
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
							</div>
							<div className="">
								<label className="block text-sm text-[15px] font-[590] text-white">
									Create Password
								</label>
								<input
									title="password"
									placeholder="Enter Your Password"
									type="password"
									{...register("password")}
									className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-[#31addb]"
								/>
								{errors.password && (
									<span className="mt-1 text-red-400">
										{errors.password.message}
									</span>
								)}
							</div>
							<div className="">
								{loading ?
									"Loading..."
								:	<button
										type="submit"
										className="w-full px-4 py-2 text-white hover:bg-[#00bbff] rounded-lg shadow-md bg-[#31addb] focus:outline-none">
										Send OTP
									</button>
								}
							</div>
						</form>
						<p className="text-center text-white">
							Already have an account?{" "}
							<Link
								href="/auth/login"
								className="text-orange-500 hover:underline">
								Login
							</Link>
						</p>
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
