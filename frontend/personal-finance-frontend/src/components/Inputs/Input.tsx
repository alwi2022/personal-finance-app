import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { formatNumberInput } from "../../utils/helper";

interface InputProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  type?: string;
  name?: string;
  formatNumber?: boolean;
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
  formatNumber = false,
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
          value={formatNumber ? formatNumberInput(value || "") : value}
          name={name}
          required={required}
          inputMode={formatNumber ? "numeric" : undefined}
          onChange={(e) => {
            const raw = e.target.value;
            const clean = formatNumber ? raw.replace(/[^\d]/g, "") : raw;
            onChange?.({
              ...e,
              target: {
                ...e.target,
                value: clean,
              },
            } as React.ChangeEvent<HTMLInputElement>);
          }}
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
