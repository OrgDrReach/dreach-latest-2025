import Register from "@/components/auth/register/Register";
import React from "react";
import { cookies } from "next/headers";
import { getCookie } from "cookies-next";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dreach.in | Register",
  description:
    "Create an account on Dreach.in. Register now and connect with doctors, dentists, vets, and other healthcare professionals."
}

const page = () => {
  if (getCookie("Auth", { cookies })) return redirect("/");

  return <Register />;
};

export default page;
