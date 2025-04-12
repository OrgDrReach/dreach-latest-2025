import Login from "@/components/auth/login/Login";
import React from "react";
import { cookies } from "next/headers";
import { getCookie } from "cookies-next";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata : Metadata = {
  title: "Dreach.in | Login",
  description:
    "Login to your Dreach.in account. Access your patient dashboard, view medical records, book appointments, and communicate with healthcare professionals securely."
}
const page = () => {
  if (getCookie("Auth", { cookies })) return redirect("/");

  return <Login />;
};

export default page;
