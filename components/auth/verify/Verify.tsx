"use client";
import { verifyUser } from "@/server-actions/user";
import { otpSchema, OtpSchemaType } from "@/Zod/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { useRouter } from "next/navigation";

const Verify = ({ phone }: { phone: string }) => {
  // const [otp, setOtp] = useState('')

  // const
  // const onVerify = async () => {
  //     const res = await verifyUser(phone, otp);
  //     console.log(res);

  // }
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm<OtpSchemaType>({ resolver: zodResolver(otpSchema) });

  const onSubmit: SubmitHandler<OtpSchemaType> = async (data) => {
    setLoading(true);
    const res = await verifyUser(phone, data.otp);
    // console.log(res);
    if (res.status !== 201) {
      alert(`${res.message}`);
      return setLoading(false);
    }

    alert("User Verified");
    return router.push("/auth/login");
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#d8eaee]">
      <div className=" w-96 p-8 space-y-6 bg-offer rounded shadow-md">
        <h2 className="text-2xl font-semibold text-center text-orange-500">
          Verify your Mobile
        </h2>
        <p className="text-center text-white">We have sent you an OTP on</p>
        <p className="text-center text-white">+91 ${phone}</p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="otp"
              className="block text-sm  text-white font-semibold"
            >
              OTP
            </label>
            <input
              id="otp"
              {...register("otp", {
                setValueAs: (value) => Number(value),
              })}
              type="number"
              min={0}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded shadow-sm focus:outline-none sm:text-sm"
              placeholder="Please enter the 6 digit OTP here to verify"
            />
            {errors.otp && <p className="text-red-500">{errors.otp.message}</p>}
          </div>
          <div className="flex justify-between text-sm">
            <a href="#" className="text-orange-500 hover:underline">
              Get via call
            </a>
            <a href="#" className="text-white hover:underline">
              Resend OTP
            </a>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-[#31addb] rounded hover:bg-[#00bbff] focus:outline-none focus:bg-blue-600"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Verify;
