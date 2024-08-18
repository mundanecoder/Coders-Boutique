"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import InputField from "../components/ui/InputField";
import Link from "next/link";
import { login } from "../../../../lib/auth";
import { setTokens } from "../../../../lib/tokenManager";
import { access } from "fs";

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

const LoginComponent: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await login({
        email: data.email,
        password: data.password,
      });
      const { user, accessToken } = response.data;
      setTokens(accessToken, "", 15 * 60);

      localStorage.setItem("accessToken", accessToken);
      router.push("/"); // Redirect to dashboard or home page
    } catch (err) {
      console.error("Login failed:", err);
      setError("Invalid email or password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-4 lg:py-8 w-full lg:w-4/6 rounded-xl self-center">
      <div className="my-6 flex flex-col items-center">
        <h1 className="py-2 justify-center flex">
          Use your credentials to login
        </h1>
      </div>
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-md w-5/6 mx-auto"
      >
        <InputField
          placeholder="email"
          register={register}
          {...register("email", { required: "Email is required" })}
          error={errors.email}
          required
        />
        <InputField
          placeholder="password"
          type="password"
          register={register}
          {...register("password", { required: "Password is required" })}
          error={errors.password}
          required
        />
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              {...register("rememberMe")}
              className="mr-2"
            />
            <span>Remember me</span>
          </label>
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-[#6139D5] text-white rounded hover:bg-[#6139D5]/50   ransition-colors"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="my-1 py-2 flex justify-center">
        <span className="self-center">
          Not a member yet?{" "}
          <Link className="text-[#6139D5]/80 hover:underline" href="/register">
            Register
          </Link>
        </span>
      </div>
      <div className="mt-2 flex justify-center">
        <Link
          className="text-[#6139D5]/80 hover:underline"
          href="/forgot-password"
        >
          Forgot password?
        </Link>
      </div>
    </div>
  );
};

export default LoginComponent;
