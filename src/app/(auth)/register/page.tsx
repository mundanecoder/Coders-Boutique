"use client";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import InputField from "../components/ui/InputField";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { register as registerUser } from "../../../../lib/auth";

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const MyFormComponent: React.FC = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const router = useRouter();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    console.log("Registration form data:", data);

    const registrationData = {
      ...data,
      role: "Regular",
    };

    try {
      const response = await registerUser(registrationData);
      router.push("/login");
      console.log("Registration successful:", response.data);

      // Handle successful registration (e.g., show success message, redirect)
    } catch (error) {
      console.error("Registration failed:", error);
      // Handle registration error (e.g., show error message)
    }
  };

  return (
    <div className="py-4 lg:py-8 w-full lg:w-4/6 rounded-xl self-center">
      <div className="my-6 flex flex-col items-center">
        <h1 className="py-2 justify-center w-5/6 text-3xl flex">
          Get Started Now
        </h1>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-md w-5/6 mx-auto"
      >
        <InputField
          name="name"
          placeholder="Name"
          register={register}
          error={errors.name}
        />

        <InputField
          type="email"
          name="email"
          placeholder="Email"
          register={register}
          error={errors.email}
          required
        />

        <InputField
          type="password"
          name="password"
          placeholder="Password"
          register={register}
          error={errors.password}
          required
        />

        <InputField
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          register={register}
          error={errors.confirmPassword}
          required
        />

        <button
          type="submit"
          className="w-full px-4 py-2 bg-[#6139D5] text-white rounded hover:bg-[#6139D5]/50 transition-colors"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Registering..." : "Register"}
        </button>
      </form>
      <div className="my-1 py-2 flex justify-center">
        <span className="self-center">
          Already a member?{" "}
          <Link
            className="lg:text-[#6139D5]/80 hover:underline"
            href={"/login"}
          >
            Login
          </Link>
        </span>
      </div>
    </div>
  );
};

export default MyFormComponent;
