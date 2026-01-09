import type {
  ReactNode,
  ChangeEvent,
  ButtonHTMLAttributes,
  InputHTMLAttributes,
} from "react";

/* ----------------- Avatar ----------------- */
interface AvatarProps {
  src?: string;
  size?: number;
  alt?: string;
}

export function Avatar({ src, size = 64, alt = "Avatar" }: AvatarProps) {
  return (
    <div
      className="rounded-full overflow-hidden border-2 border-gray-300"
      style={{ width: size, height: size }}
    >
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-400 text-2xl">
          👤
        </div>
      )}
    </div>
  );
}

/* ----------------- Input ----------------- */
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function Input({ value, onChange, className = "", ...props }: InputProps) {
  return (
    <input
      {...props}
      value={value}
      onChange={onChange}
      className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    />
  );
}

/* ----------------- Label ----------------- */
interface LabelProps {
  htmlFor?: string;
  children: ReactNode;
  className?: string;
}

export function Label({ htmlFor, children, className = "" }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-sm font-medium text-gray-700 ${className}`}
    >
      {children}
    </label>
  );
}

/* ----------------- Button ----------------- */
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "outline" | "default";
}

export function Button({
  children,
  variant = "default",
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "px-4 py-2 rounded text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  const styles =
    variant === "outline"
      ? "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
      : "bg-black text-white hover:bg-gray-800";

  return (
    <button {...props} className={`${base} ${styles} ${className}`}>
      {children}
    </button>
  );
}
