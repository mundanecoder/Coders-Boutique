"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import InputField from "../components/ui/InputField";
import { resetPassword } from "../../../../lib/auth";

interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

const ResetPasswordComponent: React.FC = () => {
  const router = useRouter();
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<ResetPasswordFormData>();

  const onSubmit: SubmitHandler<ResetPasswordFormData> = async (data) => {
    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    const token = new URLSearchParams(window.location.search).get("token");
    if (!token) {
      setError("Invalid reset token");
      return;
    }

    try {
      await resetPassword(token, data.password);
      setIsSuccess(true);
      setError(null);
    } catch (err) {
      setError("Failed to reset password. Please try again.");
      console.error("Error resetting password:", err);
    }
  };

  return (
    <div className="py-4 lg:py-8 w-full lg:w-4/6 rounded-xl self-center">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Reset Your Password
      </h1>
      {!isSuccess ? (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-md w-5/6 mx-auto"
        >
          <InputField
            label="New Password"
            name="password"
            type="password"
            placeholder="Enter your new password"
            register={register}
            error={errors.password}
          />
          <InputField
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            placeholder="Confirm your new password"
            register={register}
            error={errors.confirmPassword}
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <button
            type="submit"
            className="w-full px-4 py-2 bg-[#6139D5]/50 text-white rounded hover:bg-[#6139D5]/80 transition-colors mt-4"
          >
            Reset Password
          </button>
        </form>
      ) : (
        <div className="max-w-md w-5/6 mx-auto text-center">
          <p className="text-green-600 mb-4">
            Your password has been reset successfully!
          </p>
          <button
            onClick={() => router.push("/login")}
            className="px-4 py-2 bg-orange-900/30 text-white rounded hover:bg-orange-900/50 transition-colors"
          >
            Go to Login
          </button>
        </div>
      )}
    </div>
  );
};

export default ResetPasswordComponent;
