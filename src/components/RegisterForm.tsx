import { getCurrentUser, type User } from "../hooks/context/AdminLogged";
import Header from "../pages/admin/components/Header";
import ListecLogo from "../assets/cropped-flyer-02102024-133x133.png";
import { useEffect, useState, type FormEvent } from "react";
import { toast, ToastContainer } from "react-toastify";
import { supabase } from "../hooks/supabase/supabaseClient";

// -------------------- PASSWORD GENERATOR --------------------
function generateTempPassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";
  let pass = "";
  for (let i = 0; i < 10; i++) {
    pass += chars[Math.floor(Math.random() * chars.length)];
  }
  return pass;
}

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  course: string;
  faculty: string;
  role: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function RegisterForm() {
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    course: "",
    faculty: "",
    role: "student",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [generatedId, setGeneratedId] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [autoPassword, setAutoPassword] = useState(false);

  // -------------------- FETCH LOGGED ADMIN --------------------
  useEffect(() => {
    const fetchUser = async () => {
      const loggedUser = await getCurrentUser();
      setUser(loggedUser);
    };
    fetchUser();
  }, []);

  // -------------------- SAFE ID PREVIEW --------------------
  const previewStudentId =
    formData.course && formData.faculty
      ? `LIS-YY-${formData.course.toUpperCase().replace(/\s+/g, "").slice(0, 6)}-${formData.faculty.toUpperCase().replace(/\s+/g, "").slice(0, 10)}-XX`
      : "";

  // -------------------- HANDLERS --------------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name required";
    if (!formData.email.match(/^\S+@\S+\.\S+$/)) newErrors.email = "Valid email required";
    if (!formData.password || formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (!formData.course.trim()) newErrors.course = "Course required";
    if (!formData.faculty.trim()) newErrors.faculty = "Faculty required";
    return newErrors;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the errors.");
      return;
    }

    setLoading(true);
    setErrors({});
    setGeneratedId("");

    try {
      // Ensure password exists
      if (autoPassword && !formData.password) {
        formData.password = generateTempPassword();
      }

      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;
      if (!token) throw new Error("Not authenticated");

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-lis-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed");

      setGeneratedId(result.id_number);
      toast.success(`Student registered: ${result.id_number}`);

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        course: "",
        faculty: "",
        role: "student",
      });
      setAutoPassword(false);
      setShowPassword(false);
    } catch (error: any) {
      toast.error(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p>Loading or not logged in...</p>;

  return (
    <div className="isolate bg-white px-6 pt-16 pb-24 sm:py-32 lg:px-8 relative">
      <Header
        logo={ListecLogo}
        logoText="LISTEC"
        navItems={[
          { label: "Dashboard", href: "/admin" },
          { label: "Tickets", href: "/admin/tickets" },
          { label: "Reports", href: "#" },
          { label: "Users", href: "/admin/users" },
        ]}
        notificationsCount={3}
        userName={user.first_name ?? user.email ?? "User"}
        userProfileUrl={`https://avatar.iran.liara.run/username?username=${user.first_name}+${user.last_name}`}
      />

      <div className="mx-auto max-w-xl text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">Student Registration</h1>
        <p className="mt-4 text-lg text-gray-600">Fill in the form to register a new student.</p>
      </div>

      <form onSubmit={handleSubmit} className="mx-auto mt-16 max-w-xl">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          {/* FIRST NAME */}
          <FieldInput label="First name" name="firstName" value={formData.firstName} onChange={handleChange} error={errors.firstName} placeholder="Jane" />

          {/* LAST NAME */}
          <FieldInput label="Last name" name="lastName" value={formData.lastName} onChange={handleChange} error={errors.lastName} placeholder="Doe" />

          {/* EMAIL */}
          <FieldInput label="Email" name="email" value={formData.email} onChange={handleChange} error={errors.email} placeholder="you@example.com" type="email" smColSpan />

          {/* PASSWORD */}
          <PasswordField
            value={formData.password}
            onChange={handleChange}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            autoPassword={autoPassword}
            setAutoPassword={setAutoPassword}
            setFormData={setFormData}
          />

          {/* ROLE */}
          <div className="sm:col-span-2">
            <label className="block text-sm/6 font-semibold text-gray-900">Role</label>
            <select name="role" value={formData.role} onChange={handleChange} className="mt-2.5 block w-full rounded-md bg-white px-3.5 py-2 text-gray-900 outline-1 outline-gray-300 focus:outline-indigo-600">
              <option value="student">Student</option>
              <option value="staff">Staff</option>
            </select>
          </div>

          {/* COURSE */}
          <FieldInput label="Course" name="course" value={formData.course} onChange={handleChange} error={errors.course} placeholder="Computer Science" />

          {/* FACULTY */}
          <FieldInput label="Faculty" name="faculty" value={formData.faculty} onChange={handleChange} error={errors.faculty} placeholder="Engineering" />

          {/* ID PREVIEW */}
          {previewStudentId && <div className="sm:col-span-2 text-center text-gray-500">Preview ID: {previewStudentId}</div>}

          {/* GENERATED ID */}
          {generatedId && <div className="sm:col-span-2 text-center mt-4"><p className="text-indigo-600 font-semibold">Generated Student ID: {generatedId}</p></div>}
        </div>

        <div className="mt-10">
          <button type="submit" disabled={loading} className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow hover:bg-indigo-800">
            {loading ? "Registering..." : "Register Student"}
          </button>
        </div>
      </form>

      <ToastContainer position="top-center" />
    </div>
  );
}

// -------------------- COMPONENTS --------------------
interface FieldInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: any) => void;
  error?: string;
  placeholder?: string;
  type?: string;
  smColSpan?: boolean;
}

function FieldInput({ label, name, value, onChange, error, placeholder, type = "text", smColSpan }: FieldInputProps) {
  return (
    <div className={smColSpan ? "sm:col-span-2" : ""}>
      <label className="block text-sm/6 font-semibold text-gray-900">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="mt-2.5 block w-full rounded-md bg-white px-3.5 py-2 text-gray-900 outline-1 outline-gray-300 focus:outline-indigo-600"
      />
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
}

interface PasswordFieldProps {
  value: string;
  onChange: (e: any) => void;
  showPassword: boolean;
  setShowPassword: (val: boolean) => void;
  autoPassword: boolean;
  setAutoPassword: (val: boolean) => void;
  setFormData: React.Dispatch<React.SetStateAction<RegisterFormData>>;
}

function PasswordField({ value, onChange, showPassword, setShowPassword, autoPassword, setAutoPassword, setFormData }: PasswordFieldProps) {
  return (
    <div className="sm:col-span-2">
      <label className="block text-sm/6 font-semibold text-gray-900">Password</label>
      <div className="relative mt-2.5">
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          value={value}
          onChange={onChange}
          disabled={autoPassword}
          placeholder="********"
          className={`block w-full rounded-md bg-white px-3.5 py-2 pr-10 text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-indigo-600 ${autoPassword ? "bg-gray-100 cursor-not-allowed" : ""}`}
        />
        {!autoPassword && (
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 flex items-center text-gray-500">
            {showPassword ? "👁️" : "👁️‍🗨️"}
          </button>
        )}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <input
          type="checkbox"
          checked={autoPassword}
          onChange={(e) => {
            const checked = e.target.checked;
            setAutoPassword(checked);
            if (checked) {
              const temp = generateTempPassword();
              setFormData((prev) => ({ ...prev, password: temp }));
              toast.info("Temporary password generated!");
            }
          }}
          className="h-4 w-4 text-indigo-600"
        />
        <span className="text-gray-700 text-sm">Generate a temporary password</span>
      </div>

      {autoPassword && (
        <button type="button" onClick={() => navigator.clipboard.writeText(value)} className="mt-2 text-sm text-indigo-600 underline">
          Copy generated password
        </button>
      )}
    </div>
  );
}


// import { getCurrentUser, type User } from "../hooks/context/AdminLogged";
// import Header from "../pages/admin/components/Header";
// import ListecLogo from "../assets/cropped-flyer-02102024-133x133.png";
// import { useEffect, useState, type FormEvent } from "react";
// import { toast, ToastContainer } from "react-toastify";
// import { supabase } from "../hooks/supabase/supabaseClient";

// // -------------------- PASSWORD GENERATOR --------------------
// function generateTempPassword() {
//   const chars =
//     "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";
//   let pass = "";
//   for (let i = 0; i < 10; i++) {
//     pass += chars[Math.floor(Math.random() * chars.length)];
//   }
//   return pass;
// }

// interface RegisterFormData {
//   firstName: string;
//   lastName: string;
//   email: string;
//   password: string;
//   course: string;
//   faculty: string;
//   dateOfBirth: string;
//   role: string;
// }

// interface FormErrors {
//   [key: string]: string;
// }

// export default function RegisterForm() {
//   const [user, setUser] = useState<User | null>(null);
//   const [formData, setFormData] = useState<RegisterFormData>({
//     firstName: "",
//     lastName: "",
//     email: "",
//     password: "",
//     course: "",
//     faculty: "",
//     role: "student",
//     dateOfBirth: "",
//   });
//   const [errors, setErrors] = useState<FormErrors>({});
//   const [loading, setLoading] = useState(false);
//   const [generatedId, setGeneratedId] = useState("");

//   // UI States
//   const [showPassword, setShowPassword] = useState(false);
//   const [autoPassword, setAutoPassword] = useState(false);

//   // -------------------- FETCH LOGGED ADMIN --------------------
//   useEffect(() => {
//     (async () => {
//       const loggedUser = await getCurrentUser();
//       setUser(loggedUser);
//     })();
//   }, []);

//   // -------------------- SAFE ID PREVIEW --------------------
//   const previewStudentId =
//     formData.course && formData.faculty
//       ? `LIS-YY-${formData.course
//           .toUpperCase()
//           .replace(/\s+/g, "")
//           .slice(0, 6)}-${formData.faculty
//           .toUpperCase()
//           .replace(/\s+/g, "")
//           .slice(0, 10)}-XX`
//       : "";

//   // -------------------- HANDLERS --------------------
//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // -------------------- VALIDATION --------------------
//   const validate = (): FormErrors => {
//     const newErrors: FormErrors = {};
//     if (!formData.firstName.trim()) newErrors.firstName = "First name required";
//     if (!formData.lastName.trim()) newErrors.lastName = "Last name required";
//     if (!formData.email.match(/^\S+@\S+\.\S+$/))
//       newErrors.email = "Valid email required";
//     if (!autoPassword && formData.password.length < 6)
//       newErrors.password = "Password must be at least 6 characters";
//     if (!formData.course.trim()) newErrors.course = "Course required";
//     if (!formData.faculty.trim()) newErrors.faculty = "Faculty required";
//     if (!formData.dateOfBirth.trim())
//       newErrors.dateOfBirth = "Date of birth required";
//     return newErrors;
//   };

//   // -------------------- SUBMIT --------------------
//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     const validationErrors = validate();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       toast.error("Please fix the errors.");
//       return;
//     }

//     setLoading(true);
//     setErrors({});
//     setGeneratedId("");

//     try {
//       // Get admin session token
//       const { data: sessionData } = await supabase.auth.getSession();
//       const token = sessionData.session?.access_token;
//       if (!token) throw new Error("Not authenticated");

//       // Call Edge Function
//       const response = await fetch(
//         `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-lis-user`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({
//             firstName: formData.firstName,
//             lastName: formData.lastName,
//             email: formData.email,
//             password: formData.password,
//             role: formData.role,
//             course: formData.course,
//             faculty: formData.faculty,
//             dateOfBirth: formData.dateOfBirth,
//           }),
//         }
//       );

//       const result = await response.json();
//       if (!response.ok) throw new Error(result.error || "Registration failed");

//       setGeneratedId(result.id_number); // match Edge Function response
//       toast.success(`Student registered: ${result.id_number}`);

//       // Reset form
//       setFormData({
//         firstName: "",
//         lastName: "",
//         email: "",
//         password: "",
//         course: "",
//         faculty: "",
//         role: "student",
//         dateOfBirth: "",
//       });
//       setAutoPassword(false);
//       setShowPassword(false);
//     } catch (error: any) {
//       toast.error(error.message || "Registration failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!user) return <p>Loading or not logged in...</p>;

//   return (
//     <div className="isolate bg-white px-6 pt-16 pb-24 sm:py-32 lg:px-8 relative">
//       <Header
//         logo={ListecLogo}
//         logoText="LISTEC"
//         navItems={[
//           { label: "Dashboard", href: "/admin" },
//           { label: "Tickets", href: "/admin/tickets" },
//           { label: "Reports", href: "#" },
//           { label: "Users", href: "/admin/users" },
//         ]}
//         notificationsCount={3}
//         userName={user.first_name ?? user.email ?? "User"}
//         userProfileUrl={`https://avatar.iran.liara.run/username?username=${user.first_name}+${user.last_name}`}
//       />

//       <div className="mx-auto max-w-xl text-center">
//         <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
//           Student Registration
//         </h1>
//         <p className="mt-4 text-lg text-gray-600">
//           Fill in the form to register a new student.
//         </p>
//       </div>

//       <form onSubmit={handleSubmit} className="mx-auto mt-16 max-w-xl">
//         <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
//           {/* FIRST NAME */}
//           <div>
//             <label className="block text-sm/6 font-semibold text-gray-900">
//               First name
//             </label>
//             <input
//               type="text"
//               name="firstName"
//               value={formData.firstName}
//               onChange={handleChange}
//               placeholder="Jane"
//               className="mt-2.5 block w-full rounded-md bg-white px-3.5 py-2 text-gray-900 outline-1 outline-gray-300 focus:outline-indigo-600"
//             />
//             {errors.firstName && (
//               <p className="text-sm text-red-600 mt-1">{errors.firstName}</p>
//             )}
//           </div>

//           {/* LAST NAME */}
//           <div>
//             <label className="block text-sm/6 font-semibold text-gray-900">
//               Last name
//             </label>
//             <input
//               type="text"
//               name="lastName"
//               value={formData.lastName}
//               onChange={handleChange}
//               placeholder="Doe"
//               className="mt-2.5 block w-full rounded-md bg-white px-3.5 py-2 text-gray-900 outline-1 outline-gray-300 focus:outline-indigo-600"
//             />
//             {errors.lastName && (
//               <p className="text-sm text-red-600 mt-1">{errors.lastName}</p>
//             )}
//           </div>

//           {/* EMAIL */}
//           <div className="sm:col-span-2">
//             <label className="block text-sm/6 font-semibold text-gray-900">
//               Email
//             </label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               placeholder="you@example.com"
//               className="mt-2.5 block w-full rounded-md bg-white px-3.5 py-2 text-gray-900 outline-1 outline-gray-300 focus:outline-indigo-600"
//             />
//             {errors.email && (
//               <p className="text-sm text-red-600 mt-1">{errors.email}</p>
//             )}
//           </div>

//           {/* PASSWORD */}
//           <div className="sm:col-span-2">
//             <label className="block text-sm/6 font-semibold text-gray-900">
//               Password
//             </label>
//             <div className="relative mt-2.5">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 disabled={autoPassword}
//                 placeholder="********"
//                 className={`block w-full rounded-md bg-white px-3.5 py-2 pr-10 text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-indigo-600 ${
//                   autoPassword ? "bg-gray-100 cursor-not-allowed" : ""
//                 }`}
//               />
//               {!autoPassword && (
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute inset-y-0 right-3 flex items-center text-gray-500"
//                 >
//                   {showPassword ? "👁️" : "👁️‍🗨️"}
//                 </button>
//               )}
//             </div>

//             <div className="mt-3 flex items-center gap-2">
//               <input
//                 type="checkbox"
//                 checked={autoPassword}
//                 onChange={(e) => {
//                   const checked = e.target.checked;
//                   setAutoPassword(checked);
//                   if (checked) {
//                     const temp = generateTempPassword();
//                     setFormData({ ...formData, password: temp });
//                     toast.info("Temporary password generated!");
//                   }
//                 }}
//                 className="h-4 w-4 text-indigo-600"
//               />
//               <span className="text-gray-700 text-sm">
//                 Generate a temporary password
//               </span>
//             </div>

//             {autoPassword && (
//               <button
//                 type="button"
//                 onClick={() => navigator.clipboard.writeText(formData.password)}
//                 className="mt-2 text-sm text-indigo-600 underline"
//               >
//                 Copy generated password
//               </button>
//             )}
//             {errors.password && (
//               <p className="text-sm text-red-600 mt-1">{errors.password}</p>
//             )}
//           </div>

//           {/* ROLE */}
//           <div className="sm:col-span-2">
//             <label className="block text-sm/6 font-semibold text-gray-900">
//               Role
//             </label>
//             <select
//               name="role"
//               value={formData.role}
//               onChange={handleChange}
//               className="mt-2.5 block w-full rounded-md bg-white px-3.5 py-2 text-gray-900 outline-1 outline-gray-300 focus:outline-indigo-600"
//             >
//               <option value="student">Student</option>
//               <option value="staff">Staff</option>
//             </select>
//             {errors.role && (
//               <p className="text-sm text-red-600 mt-1">{errors.role}</p>
//             )}
//           </div>

//           {/* COURSE */}
//           <div>
//             <label className="block text-sm/6 font-semibold text-gray-900">
//               Course
//             </label>
//             <input
//               type="text"
//               name="course"
//               value={formData.course}
//               onChange={handleChange}
//               placeholder="Computer Science"
//               className="mt-2.5 block w-full rounded-md bg-white px-3.5 py-2 text-gray-900 outline-1 outline-gray-300 focus:outline-indigo-600"
//             />
//             {errors.course && (
//               <p className="text-sm text-red-600 mt-1">{errors.course}</p>
//             )}
//           </div>

//           {/* FACULTY */}
//           <div>
//             <label className="block text-sm/6 font-semibold text-gray-900">
//               Faculty
//             </label>
//             <input
//               type="text"
//               name="faculty"
//               value={formData.faculty}
//               onChange={handleChange}
//               placeholder="Engineering"
//               className="mt-2.5 block w-full rounded-md bg-white px-3.5 py-2 text-gray-900 outline-1 outline-gray-300 focus:outline-indigo-600"
//             />
//             {errors.faculty && (
//               <p className="text-sm text-red-600 mt-1">{errors.faculty}</p>
//             )}
//           </div>

//           {/* DATE OF BIRTH */}
//           <div className="sm:col-span-2">
//             <label className="block text-sm/6 font-semibold text-gray-900">
//               Date of Birth
//             </label>
//             <input
//               type="date"
//               name="dateOfBirth"
//               value={formData.dateOfBirth}
//               onChange={handleChange}
//               className="mt-2.5 block w-full rounded-md bg-white px-3.5 py-2 text-gray-900 outline-1 outline-gray-300 focus:outline-indigo-600"
//             />
//             {errors.dateOfBirth && (
//               <p className="text-sm text-red-600 mt-1">{errors.dateOfBirth}</p>
//             )}
//           </div>

//           {/* PREVIEW ID */}
//           {previewStudentId && (
//             <div className="sm:col-span-2 text-center text-gray-500">
//               Preview ID: {previewStudentId}
//             </div>
//           )}

//           {/* GENERATED ID */}
//           {generatedId && (
//             <div className="sm:col-span-2 text-center mt-4">
//               <p className="text-indigo-600 font-semibold">
//                 Generated Student ID: {generatedId}
//               </p>
//             </div>
//           )}
//         </div>

//         {/* SUBMIT */}
//         <div className="mt-10">
//           <button
//             type="submit"
//             disabled={loading}
//             className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow hover:bg-indigo-800"
//           >
//             {loading ? "Registering..." : "Register Student"}
//           </button>
//         </div>
//       </form>

//       <ToastContainer position="top-center" />
//     </div>
//   );
// }


// import { getCurrentUser, type User } from "../hooks/context/AdminLogged";
// import Header from "../pages/admin/components/Header";
// import ListecLogo from "../assets/cropped-flyer-02102024-133x133.png";
// import { useEffect, useState, type FormEvent } from "react";
// import { toast, ToastContainer } from "react-toastify";
// import { supabase } from "../hooks/supabase/supabaseClient";

// // -------------------- PASSWORD GENERATOR --------------------
// function generateTempPassword() {
//   const chars =
//     "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";
//   let pass = "";
//   for (let i = 0; i < 10; i++) {
//     pass += chars[Math.floor(Math.random() * chars.length)];
//   }
//   return pass;
// }

// interface RegisterFormData {
//   firstName: string;
//   lastName: string;
//   email: string;
//   password: string;
//   course: string;
//   faculty: string;
//   dateOfBirth: string;
//   role: string;
// }

// interface FormErrors {
//   [key: string]: string;
// }

// export default function RegisterForm() {
//   const [user, setUser] = useState<User | null>(null);

//   const [formData, setFormData] = useState<RegisterFormData>({
//     firstName: "",
//     lastName: "",
//     email: "",
//     password: "",
//     course: "",
//     faculty: "",
//     role: "student",
//     dateOfBirth: "",
//   });

//   const [errors, setErrors] = useState<FormErrors>({});
//   const [loading, setLoading] = useState(false);
//   const [generatedId, setGeneratedId] = useState("");

//   // UI States
//   const [showPassword, setShowPassword] = useState(false);
//   const [autoPassword, setAutoPassword] = useState(false);

//   // -------------------- FETCH LOGGED ADMIN --------------------
//   useEffect(() => {
//     const fetchUser = async () => {
//       const loggedUser = await getCurrentUser();
//       setUser(loggedUser);
//     };
//     fetchUser();
//   }, []);

//   // -------------------- SAFE ID PREVIEW --------------------
//   const previewStudentId =
//     formData.course && formData.faculty
//       ? `LIS-YY-${formData.course
//           .toUpperCase()
//           .replace(/\s+/g, "")
//           .slice(0, 6)}-${formData.faculty
//           .toUpperCase()
//           .replace(/\s+/g, "")
//           .slice(0, 10)}-XX`
//       : "";

//   // -------------------- HANDLERS --------------------
//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // -------------------- VALIDATION --------------------
//   const validate = (): FormErrors => {
//     const newErrors: FormErrors = {};

//     if (!formData.firstName.trim()) newErrors.firstName = "First name required";
//     if (!formData.lastName.trim()) newErrors.lastName = "Last name required";
//     if (!formData.email.match(/^\S+@\S+\.\S+$/))
//       newErrors.email = "Valid email required";

//     if (!autoPassword && formData.password.length < 6) {
//       newErrors.password = "Password must be at least 6 characters";
//     }

//     if (!formData.course.trim()) newErrors.course = "Course required";
//     if (!formData.faculty.trim()) newErrors.faculty = "Faculty required";
//     if (!formData.dateOfBirth.trim())
//       newErrors.dateOfBirth = "Date of birth required";

//     return newErrors;
//   };

//   // -------------------- SUBMIT --------------------
//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();

//     const validationErrors = validate();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       toast.error("Please fix the errors.");
//       return;
//     }

//     setLoading(true);
//     setErrors({});
//     setGeneratedId("");

//     try {
//       const session = await supabase.auth.getSession();
//       const token = session.data.session?.access_token;

//       if (!token) throw new Error("Not authenticated");

//       const response = await fetch(
//         `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-user`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({
//             email: formData.email,
//             password: formData.password,
//             firstName: formData.firstName,
//             lastName: formData.lastName,
//             role: formData.role,
//             course: formData.course,
//             faculty: formData.faculty,
//             dateOfBirth: formData.dateOfBirth,
//           }),
//         }
//       );

//       const result = await response.json();
//       if (!response.ok) throw new Error(result.error || "Failed");

//       setGeneratedId(result.studentId);
//       toast.success(`Student registered: ${result.studentId}`);

//       // Reset
//       setFormData({
//         firstName: "",
//         lastName: "",
//         email: "",
//         password: "",
//         course: "",
//         faculty: "",
//         role: "student",
//         dateOfBirth: "",
//       });
//       setAutoPassword(false);
//       setShowPassword(false);
//     } catch (error: any) {
//       toast.error(error.message || "Registration failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!user) return <p>Loading or not logged in...</p>;

//   return (
//     <div className="isolate bg-white px-6 pt-16 pb-24 sm:py-32 lg:px-8 relative">

//       <Header
//         logo={ListecLogo}
//         logoText="LISTEC"
//         navItems={[
//           { label: "Dashboard", href: "/admin" },
//           { label: "Tickets", href: "/admin/tickets" },
//           { label: "Reports", href: "#" },
//           { label: "Users", href: "/admin/users" },
//         ]}
//         notificationsCount={3}
//         userName={user.first_name ?? user.email ?? "User"}
//         userProfileUrl={`https://avatar.iran.liara.run/username?username=${user.first_name}+${user.last_name}`}
//       />

//       <div className="mx-auto max-w-xl text-center">
//         <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
//           Student Registration
//         </h1>
//         <p className="mt-4 text-lg text-gray-600">
//           Fill in the form to register a new student.
//         </p>
//       </div>

//       <form onSubmit={handleSubmit} className="mx-auto mt-16 max-w-xl">
//         <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">

//           {/* FIRST NAME */}
//           <div>
//             <label className="block text-sm/6 font-semibold text-gray-900">
//               First name
//             </label>
//             <input
//               type="text"
//               name="firstName"
//               value={formData.firstName}
//               onChange={handleChange}
//               placeholder="Jane"
//               className="mt-2.5 block w-full rounded-md bg-white px-3.5 py-2 text-gray-900 outline-1 outline-gray-300 focus:outline-indigo-600"
//             />
//             {errors.firstName && (
//               <p className="text-sm text-red-600 mt-1">{errors.firstName}</p>
//             )}
//           </div>

//           {/* LAST NAME */}
//           <div>
//             <label className="block text-sm/6 font-semibold text-gray-900">
//               Last name
//             </label>
//             <input
//               type="text"
//               name="lastName"
//               value={formData.lastName}
//               onChange={handleChange}
//               placeholder="Doe"
//               className="mt-2.5 block w-full rounded-md bg-white px-3.5 py-2 text-gray-900 outline-1 outline-gray-300 focus:outline-indigo-600"
//             />
//             {errors.lastName && (
//               <p className="text-sm text-red-600 mt-1">{errors.lastName}</p>
//             )}
//           </div>

//           {/* EMAIL */}
//           <div className="sm:col-span-2">
//             <label className="block text-sm/6 font-semibold text-gray-900">
//               Email
//             </label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               placeholder="you@example.com"
//               className="mt-2.5 block w-full rounded-md bg-white px-3.5 py-2 text-gray-900 outline-1 outline-gray-300 focus:outline-indigo-600"
//             />
//             {errors.email && (
//               <p className="text-sm text-red-600 mt-1">{errors.email}</p>
//             )}
//           </div>

//           {/* PASSWORD */}
//           <div className="sm:col-span-2">
//             <label className="block text-sm/6 font-semibold text-gray-900">
//               Password
//             </label>

//             <div className="relative mt-2.5">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 disabled={autoPassword}
//                 placeholder="********"
//                 className={`block w-full rounded-md bg-white px-3.5 py-2 pr-10 text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-indigo-600 ${
//                   autoPassword ? "bg-gray-100 cursor-not-allowed" : ""
//                 }`}
//               />

//               {/* SHOW/HIDE EYE */}
//               {!autoPassword && (
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute inset-y-0 right-3 flex items-center text-gray-500"
//                 >
//                   {showPassword ? "👁️" : "👁️‍🗨️"}
//                 </button>
//               )}
//             </div>

//             {/* AUTO PASSWORD CHECKBOX */}
//             <div className="mt-3 flex items-center gap-2">
//               <input
//                 type="checkbox"
//                 checked={autoPassword}
//                 onChange={(e) => {
//                   const checked = e.target.checked;
//                   setAutoPassword(checked);

//                   if (checked) {
//                     const temp = generateTempPassword();
//                     setFormData({ ...formData, password: temp });
//                     toast.info("Temporary password generated!");
//                   }
//                 }}
//                 className="h-4 w-4 text-indigo-600"
//               />
//               <span className="text-gray-700 text-sm">
//                 Generate a temporary password
//               </span>
//             </div>

//             {/* COPY BUTTON (only when generated automatically) */}
//             {autoPassword && (
//               <button
//                 type="button"
//                 onClick={() => navigator.clipboard.writeText(formData.password)}
//                 className="mt-2 text-sm text-indigo-600 underline"
//               >
//                 Copy generated password
//               </button>
//             )}

//             {errors.password && (
//               <p className="text-sm text-red-600 mt-1">{errors.password}</p>
//             )}
//           </div>
//         {/* ROLE */}
//         <div className="sm:col-span-2">
//             <label className="block text-sm/6 font-semibold text-gray-900">
//                 Role
//             </label>

//             <select
//                 name="role"
//                 value={formData.role}
//                 onChange={handleChange}
//                 className="mt-2.5 block w-full rounded-md bg-white px-3.5 py-2 text-gray-900 outline-1 outline-gray-300 focus:outline-indigo-600">
//                 <option value="student">Student</option>
//                 <option value="staff">Staff</option>
//             </select>

//             {errors.role && (
//                 <p className="text-sm text-red-600 mt-1">{errors.role}</p>
//             )}
//         </div>

//           {/* COURSE */}
//           <div>
//             <label className="block text-sm/6 font-semibold text-gray-900">
//               Course
//             </label>
//             <input
//               type="text"
//               name="course"
//               value={formData.course}
//               onChange={handleChange}
//               placeholder="Computer Science"
//               className="mt-2.5 block w-full rounded-md bg-white px-3.5 py-2 text-gray-900 outline-1 outline-gray-300 focus:outline-indigo-600"
//             />
//             {errors.course && (
//               <p className="text-sm text-red-600 mt-1">{errors.course}</p>
//             )}
//           </div>

//           {/* FACULTY */}
//           <div>
//             <label className="block text-sm/6 font-semibold text-gray-900">
//               Faculty
//             </label>
//             <input
//               type="text"
//               name="faculty"
//               value={formData.faculty}
//               onChange={handleChange}
//               placeholder="Engineering"
//               className="mt-2.5 block w-full rounded-md bg-white px-3.5 py-2 text-gray-900 outline-1 outline-gray-300 focus:outline-indigo-600"
//             />
//             {errors.faculty && (
//               <p className="text-sm text-red-600 mt-1">{errors.faculty}</p>
//             )}
//           </div>

//           {/* DATE OF BIRTH */}
//           <div className="sm:col-span-2">
//             <label className="block text-sm/6 font-semibold text-gray-900">
//               Date of Birth
//             </label>
//             <input
//               type="date"
//               name="dateOfBirth"
//               value={formData.dateOfBirth}
//               onChange={handleChange}
//               className="mt-2.5 block w-full rounded-md bg-white px-3.5 py-2 text-gray-900 outline-1 outline-gray-300 focus:outline-indigo-600"
//             />
//             {errors.dateOfBirth && (
//               <p className="text-sm text-red-600 mt-1">{errors.dateOfBirth}</p>
//             )}
//           </div>

//           {/* PREVIEW ID */}
//           {previewStudentId && (
//             <div className="sm:col-span-2 text-center text-gray-500">
//               Preview ID: {previewStudentId}
//             </div>
//           )}

//           {/* GENERATED ID */}
//           {generatedId && (
//             <div className="sm:col-span-2 text-center mt-4">
//               <p className="text-indigo-600 font-semibold">
//                 Generated Student ID: {generatedId}
//               </p>
//             </div>
//           )}
//         </div>

//         {/* SUBMIT */}
//         <div className="mt-10">
//           <button
//             type="submit"
//             disabled={loading}
//             className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow hover:bg-indigo-800"
//           >
//             {loading ? "Registering..." : "Register Student"}
//           </button>
//         </div>
//       </form>

//       <ToastContainer position="top-center" />
//     </div>
//   );
// }
