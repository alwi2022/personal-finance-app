import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

interface InputProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  type?: string;
  name?: string;
  required?: boolean;
}

const Input = ({
  placeholder,
  value,
  onChange,
  label,
  type = "text",
  name,
  required = false,
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => setShowPassword(!showPassword);

  const isPassword = type === "password";

  return (
    <div>
      {label && (
        <label className="block mb-1 text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div className="input-box">
        <input
          type={isPassword ? (showPassword ? "text" : "password") : type}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none"
          value={value}
          name={name}
          required={required}
          onChange={(e) => onChange?.(e)}
        />

        {isPassword && (
          <>
            {showPassword ? (
              <FaRegEye
                size={22}
                className="text-primary cursor-pointer"
                onClick={toggleShowPassword}
              />
            ) : (
              <FaRegEyeSlash
                size={22}
                className="text-slate-400 cursor-pointer"
                onClick={toggleShowPassword}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Input;
