import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

export default function SignupConfirmed() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-md w-full bg-white rounded-2xl p-8 text-center">
        
        {/* Illustration */}
        <div className="flex justify-center mb-6">
          <CheckCircleIcon className="h-20 w-20 text-indigo-600" />
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Account Confirmed 🎉
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-8">
          Your email has been successfully verified. You can now log in and start using your account.
        </p>

        {/* CTA */}
        <button
          onClick={() => navigate("/login")}
          className="w-full bg-black hover:bg-gray-600 text-white font-medium py-3 rounded-lg transition duration-200">
          Go to Login
        </button>
      </div>
    </div>
  );
}
