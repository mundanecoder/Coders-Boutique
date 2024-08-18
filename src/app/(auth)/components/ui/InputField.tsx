import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";

interface InputFieldProps {
  label?: string;
  name: string;
  type?: string;
  placeholder?: string;
  register: UseFormRegister<any>;
  [key: string]: any; // Allows for additional props
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  type = "text",
  placeholder,
  register,
  error,
  ...rest // Spread any additional props
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={name} className="block mb-1 font-medium">
          {label}
        </label>
      )}
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        className={`w-full px-3 py-3 text-sm bg-transparent border rounded-lg focus:outline-none ${
          error ? "border-red-500" : "border-gray-600"
        }`}
        {...register(name)}
        {...rest} // Spread additional props onto the input
      />
      {error?.message && (
        <p className="mt-1 text-red-500">{error.message.toString()}</p>
      )}
    </div>
  );
};

export default InputField;
