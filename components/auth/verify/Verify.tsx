"use client";
import { verifyUser, resendOTP } from "@/server-actions/user";
import { otpSchema, OtpSchemaType } from "@/Zod/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const Verify = ({ phone }: { phone: string }) => {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [resendTimer, setResendTimer] = useState(30);
	const [canResend, setCanResend] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<OtpSchemaType>({
		resolver: zodResolver(otpSchema),
		mode: "onChange",
	});

	useEffect(() => {
		let timer: NodeJS.Timeout;
		if (resendTimer > 0 && !canResend) {
			timer = setInterval(() => {
				setResendTimer((prev) => prev - 1);
			}, 1000);
		} else {
			setCanResend(true);
		}
		return () => clearInterval(timer);
	}, [resendTimer, canResend]);

	const onSubmit: SubmitHandler<OtpSchemaType> = async (data) => {
		try {
			setLoading(true);
			const res = await verifyUser(phone, data.otp);

			if (res.status !== 201) {
				toast.error(res.message || "Verification failed");
				return;
			}

			toast.success("Mobile number verified successfully!");
			router.push("/auth/login");
		} catch (error) {
			toast.error("An error occurred during verification");
		} finally {
			setLoading(false);
		}
	};

	const handleResendOTP = async () => {
		if (!canResend) return;

		try {
			const res = await resendOTP(phone);

			if (res.status !== 201) {
				toast.error(res.message || "Failed to resend OTP");
				return;
			}

			setResendTimer(30);
			setCanResend(false);
			toast.success("OTP resent successfully");
		} catch (error) {
			toast.error("Failed to resend OTP");
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-[#d8eaee] dark:bg-[#1F2C3B]">
			<div className="w-full max-w-md p-8 space-y-6 bg-offer rounded-xl shadow-lg transform transition-all hover:shadow-xl">
				<div className="space-y-4">
					<h2 className="text-3xl font-bold text-center text-orange-400">
						Verify Your Mobile
					</h2>
					<div className="text-center space-y-2">
						<p className="text-white">We have sent you an OTP on</p>
						<p className="text-white font-medium">{phone}</p>
					</div>
				</div>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					<div>
						<label
							htmlFor="otp"
							className="block text-sm font-medium text-white">
							Enter OTP
						</label>
						<input
							id="otp"
							{...register("otp")}
							type="text"
							inputMode="numeric"
							maxLength={6}
							placeholder="Enter 6-digit OTP"
							className="w-full px-4 py-3 mt-1 text-center text-lg tracking-widest border border-gray-300 rounded-lg focus:ring-[#31addb] focus:border-[#31addb] bg-white transition-all duration-200"
						/>
						{errors.otp && (
							<p className="mt-1 text-sm text-red-500">{errors.otp.message}</p>
						)}
					</div>

					<div className="flex justify-between text-sm">
						<button
							type="button"
							disabled={!canResend}
							onClick={handleResendOTP}
							className="text-orange-400 hover:text-orange-500 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors duration-200">
							{canResend ? "Resend OTP" : `Resend OTP in ${resendTimer}s`}
						</button>
						<button
							type="button"
							disabled={!canResend}
							className="text-white hover:text-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors duration-200">
							Get via call
						</button>
					</div>

					<button
						type="submit"
						disabled={loading}
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
								Verifying...
							</span>
						:	"Verify & Continue"}
					</button>
				</form>
			</div>
		</div>
	);
};

export default Verify;
