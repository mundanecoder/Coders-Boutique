"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Link from "next/link";
import InputField from "../components/ui/InputField";
import { requestPasswordReset } from "../../../../lib/auth";

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPasswordComponent: React.FC = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>();

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit: SubmitHandler<ForgotPasswordFormData> = async (data) => {
    try {
      await requestPasswordReset(data.email);
      setIsSubmitted(true);
      setError(null);
    } catch (err) {
      setError("Failed to send reset link. Please try again.");
      console.error("Error requesting password reset:", err);
    }
  };

  return (
    <div className="py-4 lg:py-8 w-full lg:w-4/6 rounded-xl self-center">
      <div className="my-6 flex flex-col items-center">
        <h1 className="py-2 justify-center flex">Reset Your Password</h1>
      </div>
      {!isSubmitted ? (
        <div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-md w-5/6 mx-auto"
          >
            <p className="text-center mb-4 text-gray-600">
              Enter your email address and we will send you a link to reset your
              password.
            </p>
            <InputField
              label="Email"
              name="email"
              type="email"
              placeholder="Enter your email"
              register={register}
              error={errors.email}
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <button
              type="submit"
              className="w-full px-4 py-2 bg-[#6139D5]/50 text-white rounded hover:bg-[#6139D5]/80 transition-colors"
            >
              Send Reset Link
            </button>
          </form>
        </div>
      ) : (
        <div className="max-w-md w-5/6 mx-auto text-center">
          <p className="text-green-600 mb-4">
            If an account exists for the email provided, you will receive
            password reset instructions.
          </p>
        </div>
      )}

      <div className="my-1 py-2 flex justify-center">
        <span className="self-center">
          Remember your password?{" "}
          <Link className="text-[#6139D5]/80 hover:underline" href="/login">
            Login
          </Link>
        </span>
      </div>
      <div className="mt-2 flex justify-center">
        <Link className="text-[#6139D5]/80 hover:underline" href="/register">
          Create an account
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordComponent;
