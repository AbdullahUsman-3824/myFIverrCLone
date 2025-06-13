// components/PasswordInput.jsx
import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function PasswordInput({
  name = "password",
  value,
  onChange,
  error,
  disabled,
  placeholder = "Password",
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative w-full">
      <input
        type={showPassword ? "text" : "password"}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`border ${
          error ? "border-red-500" : "border-slate-300"
        } p-3 rounded w-full pr-10`}
        disabled={disabled}
      />
      <div
        className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
        onClick={() => setShowPassword((prev) => !prev)}
      >
        {showPassword ? (
          <EyeSlashIcon className="h-5 w-5 text-gray-500" />
        ) : (
          <EyeIcon className="h-5 w-5 text-gray-500" />
        )}
      </div>
    </div>
  );
}
