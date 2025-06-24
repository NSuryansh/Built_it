import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { KeyRound, Eye, EyeOff } from "lucide-react";
import CustomToast from "../../components/common/CustomToast";

const DoctorResetPassword = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const jwt_token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    setError("");
    const token = searchParams.get("token");

    const response = await fetch(
      `http://localhost:3000/api/doc/resetPassword`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwt_token,
        },
        body: JSON.stringify({
          password: formData.password,
          token: token,
        }),
      }
    );
    const res = await response.json();
    CustomToast("Password updated successfully!", "blue");
    setTimeout(() => {
      navigate("/doctor/login");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[var(--custom-blue-50)] flex items-center justify-center p-4">
      <div className="bg-[var(--custom-white)] rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="flex justify-center mb-8">
          <div className="bg-[var(--custom-blue-100)] p-3 rounded-full">
            <KeyRound className="w-8 h-8 text-[var(--custom-blue-500)]" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center text-[var(--custom-blue-900)] mb-2">
          Reset Password
        </h1>
        <p className="text-center text-[var(--custom-blue-700)] mb-8">
          Enter your new password below
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[var(--custom-blue-900)] text-sm font-medium mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full px-4 py-3 rounded-lg border border-[var(--custom-blue-200)] focus:ring-2 focus:ring-[var(--custom-blue-500)] focus:border-transparent transition-colors"
                placeholder="Enter new password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--custom-gray-500)] hover:text-[var(--custom-blue-900)]"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[var(--custom-blue-900)] text-sm font-medium mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="w-full px-4 py-3 rounded-lg border border-[var(--custom-blue-200)] focus:ring-2 focus:ring-[var(--custom-blue-500)] focus:border-transparent transition-colors"
                placeholder="Confirm new password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--custom-gray-500)] hover:text-[var(--custom-blue-900)]"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-[var(--custom-red-500)] text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[var(--custom-blue-400)] hover:bg-[var(--custom-blue-500)] text-[var(--custom-white)] font-medium py-3 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default DoctorResetPassword;
