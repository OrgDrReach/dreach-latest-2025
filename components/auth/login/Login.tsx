"use client";
import Header from "@/components/auth/login/header";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import Img from "@/public/websiteImages/registerpageImage.webp";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInSchema, SignInSchemaType } from "@/Zod/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const mapRes = {
	200: "User Logged In Successfully",
	401: "Invalid Credentials",
	500: "Internal Server Error",
};

const Login = () => {
	const router = useRouter();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SignInSchemaType>({ resolver: zodResolver(SignInSchema) });

	const onSubmit: SubmitHandler<SignInSchemaType> = async (data) => {
		try {
			const result = await signIn("credentials", {
				phone: data.phone,
				password: data.password,
				redirect: false,
			});

			if (!result?.error) {
				toast.success("User Logged In Successfully");
				router.push("/dashboard"); // Or wherever you want to redirect after login
			} else {
				toast.error("Invalid credentials");
			}
		} catch (error) {
			toast.error("An error occurred during login");
		}
	};

	return (
		<section className="h-screen flex flex-col bg-[#d8eaee] dark:bg-[#1F2C3B]">
			<Header />
			<div className="flex justify-center xl:space-x-20 space-x-0 lg:space-x-6 bg-[#d8eaee] dark:bg-[#1F2C3B]">
				<div className="hidden lg:block">
					<Image
						src={Img}
						alt="Register Page Image"
						className="w-96 mt-24 opacity-90"
						style={{
							maxWidth: "100%",
							height: "auto",
						}}
					/>
				</div>
				<div>
					<div>
						<div className="xl:w-[450px] w-96 p-8 space-y-6 bg-white rounded-lg shadow-md bg-offer">
							<h2 className="text-[26px] pb-5 font-bold text-center text-orange-400">
								Login
							</h2>
							<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
								<div>
									<label className=" text-sm font-medium text-white">
										Mobile Number
									</label>
									<input
										type="text"
										title="Mobile Number"
										{...register("phone", {
											setValueAs: (value) => value.toString(),
										})}
										placeholder="Enter your Mobile Number"
										className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-[#31addb]"
									/>
									{errors.phone && (
										<p className="text-red-500">{errors.phone.message}</p>
									)}
								</div>
								<div>
									<label className=" text-sm font-medium text-white">
										Password
									</label>
									<input
										type="password"
										title="Password"
										{...register("password")}
										placeholder="Password"
										className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-[#31addb]"
									/>
									{errors.password && (
										<p className="text-red-500">{errors.password.message}</p>
									)}
								</div>
								<button
									type="submit"
									className="w-full px-4 py-2 text-white hover:bg-[#00bbff] rounded-lg shadow bg-[#31addb] focus:outline-none">
									Login
								</button>
							</form>
							<p className="text-center text-white">
								Don&apos;t have an account?{" "}
								<Link
									href="/auth/register"
									className="text-orange-500 hover:underline">
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
