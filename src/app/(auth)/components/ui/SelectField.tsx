import React, { useState, useRef, useEffect } from "react";
import { FieldError } from "react-hook-form";

interface SelectOption {
  value: string;
  label: string;
  color: string; // Add a color property for each option
}

interface SelectFieldProps {
  name: string;
  label?: string;
  options: SelectOption[];
  error?: FieldError;
  className?: string;
  required?: boolean;
  onChange: (value: string) => void;
}

const SelectField: React.FC<SelectFieldProps> = ({
  name,
  label,
  options,
  error,
  className = "",
  required = false,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<SelectOption | null>(
    null
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (option: SelectOption) => {
    setSelectedOption(option);
    setIsOpen(false);
    onChange(option.value);
  };

  return (
    <div className={`mb-4 ${className}`} ref={dropdownRef}>
      {label && (
        <label htmlFor={name} className="block text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <div
          className={`w-full px-3 py-3 text-sm focus:outline-none bg-transparent border border-gray-600 rounded-lg cursor-pointer ${
            error ? "border-red-500" : "border-gray-300"
          }`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedOption ? selectedOption.label : "Register yourself as"}
        </div>
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 px-2 rounded-lg dark:bg-black border dark:border-gray-600 text-black dark:text-gray-200 text-sm shadow-lg">
            {options.map((option) => (
              <div
                key={option.value}
                className="px-3 py-2 cursor-pointer hover:text-gray-200 hover:border-b hover:border-gray-400"
                // style={{ backgroundColor: option.color }}
                onClick={() => handleSelect(option)}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
      {error && <p className="text-red-600 text-sm mt-1">{error.message}</p>}
    </div>
  );
};

export default SelectField;
