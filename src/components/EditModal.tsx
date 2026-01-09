import { useState, useRef, useEffect } from "react";
import { Modal } from "./ui"; // Your custom Modal component
import { Input, Label, Button, Avatar } from "./Custom-UI";

interface EditStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student?: {
    firstName: string;
    lastName: string;
    email: string;
    image?: string | null;
  };
  onSave: (data: {
    firstName: string;
    lastName: string;
    email: string;
    image?: string | null;
  }) => void;
}

export default function EditStudentModal({
  isOpen,
  onClose,
  student,
  onSave,
}: EditStudentModalProps) {
  // Lazy initial state ensures proper initialization
  const [firstName, setFirstName] = useState(() => student?.firstName || "");
  const [lastName, setLastName] = useState(() => student?.lastName || "");
  const [email, setEmail] = useState(() => student?.email || "");
  const [image, setImage] = useState<string | null>(() => student?.image || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state when the student prop changes, defer updates to avoid synchronous setState
  useEffect(() => {
    if (!student) return;

    const id = setTimeout(() => {
      setFirstName(student.firstName);
      setLastName(student.lastName);
      setEmail(student.email);
      setImage(student.image || null);
    }, 0);

    return () => clearTimeout(id);
  }, [student]);

  // Handle file uploads
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1048576) {
      alert("File size exceeds 1MB limit");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => setImage(event.target?.result as string);
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  // Save handler
  const handleSave = () => {
    onSave({ firstName, lastName, email, image });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} title="Edit Student" onClose={onClose}>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Avatar / Image Upload */}
        <div className="flex flex-col items-center justify-center md:col-span-2">
          <div className="relative mb-2">
            <Avatar src={image || undefined} size={96} />
            <button
              className="absolute -top-1 -right-1 bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-300"
              onClick={() => {
                if (image) {
                  setImage(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                } else {
                  triggerFileInput();
                }
              }}
            >
              {image ? "✕" : "+"}
              <span className="sr-only">{image ? "Remove image" : "Upload image"}</span>
            </button>
          </div>
          <p className="text-center font-medium">Upload Image</p>
          <p className="text-center text-sm text-gray-500">Max file size: 1MB</p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <Button variant="outline" className="mt-2" onClick={triggerFileInput}>
            Add Image
          </Button>
        </div>

        {/* Form Fields */}
        <div className="flex flex-col justify-between md:col-span-3">
          <div className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="first-name">
                First Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="first-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="last-name">Last Name</Label>
              <Input
                id="last-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button className="bg-black text-white hover:bg-gray-800" onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
