/* ----------------------------- CUSTOM UI ----------------------------- */
import { ReactNode, useState } from "react";
import { AlertTriangleIcon } from "lucide-react";

/* ----------------------------- SELECT COMPONENTS ----------------------------- */
export function Select({ value, onValueChange, children, className = "" }: any) {
  return (
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className={`border rounded px-3 py-1 text-sm ${className}`}
    >
      {children}
    </select>
  );
}

export function SelectItem({ value, children }: any) {
  return <option value={value}>{children}</option>;
}

/* ----------------------------- BADGE COMPONENT ----------------------------- */
export function Badge({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`px-2 py-1 text-xs rounded-full font-medium ${className}`}>
      {children}
    </span>
  );
}

/* ----------------------------- TABLE COMPONENTS ----------------------------- */
export function Table({ children }: { children: ReactNode }) {
  return <table className="w-full table-auto border border-gray-300">{children}</table>;
}

export function TableHeader({ children }: { children: ReactNode }) {
  return <thead className="bg-gray-50">{children}</thead>;
}

export function TableBody({ children }: { children: ReactNode }) {
  return <tbody>{children}</tbody>;
}

export function TableRow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <tr className={`border-b border-gray-200 ${className}`}>{children}</tr>;
}

export function TableHead({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <th className={`h-12 px-4 font-medium text-left ${className}`}>{children}</th>;
}

export function TableCell({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <td className={`h-14 px-4 ${className}`}>{children}</td>;
}

/* ----------------------------- BUTTON COMPONENT ----------------------------- */
export function Button({ children, onClick, variant = "default", className = "" }: any) {
  const base =
    "px-4 py-2 rounded font-medium text-sm transition-colors duration-200";
  const variants: Record<string, string> = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-100",
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} onClick={onClick}>
      {children}
    </button>
  );
}

/* ----------------------------- MODAL COMPONENT ----------------------------- */
interface ModalProps {
  isOpen: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}

export function Modal({ isOpen, title, children, onClose }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="flex items-start space-x-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
            <AlertTriangleIcon className="h-6 w-6 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <div>{children}</div>
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onClose}>
            Deactivate
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- DIALOG02 COMPONENT ----------------------------- */
export default function Dialog02() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button variant="destructive" onClick={() => setOpen(true)}>
        Deactivate
      </Button>

      <Modal
        isOpen={open}
        title="Deactivate account"
        onClose={() => setOpen(false)}
      >
        <p>
          Are you sure you want to deactivate your account? All of your data
          will be permanently removed. This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
