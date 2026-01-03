/* Reusable Avatar, Input, Label, Button */

import { ReactNode } from "react";

/* ----------------- Avatar ----------------- */
interface AvatarProps {
  src?: string;
  size?: number;
}
export function Avatar({ src, size = 64 }: AvatarProps) {
  return (
    <div
      className={`rounded-full overflow-hidden border-2 border-gray-300`}
      style={{ width: size, height: size }}
    >
      {src ? (
        <img src={src} alt="Avatar" className="w-full h-full object-cover" />
      ) : (
        <div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-400 text-2xl">
          👤
        </div>
      )}
    </div>
  );
}

/* ----------------- Input ----------------- */
interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id?: string;
  type?: string;
}
export function Input({ value, onChange, id, type = "text" }: InputProps) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}

/* ----------------- Label ----------------- */
interface LabelProps {
  htmlFor?: string;
  children: ReactNode;
}
export function Label({ htmlFor, children }: LabelProps) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700">
      {children}
    </label>
  );
}

/* ----------------- Button ----------------- */
interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "outline" | "default";
  className?: string;
}
export function Button({ children, onClick, variant = "default", className = "" }: ButtonProps) {
  const base = "px-4 py-2 rounded text-sm font-medium transition-colors";
  const styles =
    variant === "outline"
      ? "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
      : "bg-black text-white hover:bg-gray-800";

  return (
    <button className={`${base} ${styles} ${className}`} onClick={onClick}>
      {children}
    </button>
  );
}
