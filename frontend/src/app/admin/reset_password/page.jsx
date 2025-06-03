"use client";

import React, { useState } from "react";
import { KeyRound, Eye, EyeOff } from "lucide-react";
import CustomToast from "../../components/CustomToast";
import { useRouter, useSearchParams } from "next/navigation";

const AdminResetPassword = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  
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
    const jwt_token = localStorage.getItem("token");

    const response = await fetch(`http://localhost:3000/admin/resetPassword`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + jwt_token,
      },
      body: JSON.stringify({
        password: formData.password,
        token: token,
      }),
    });
    const res = await response.json();
    CustomToast("Password updated successfully!", "green");
    setTimeout(() => {
      router.replace("/admin/login");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-custom-green-50 flex items-center justify-center p-4">
      <div className="bg-custom-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="flex justify-center mb-8">
          <div className="bg-custom-green-100 p-3 rounded-full">
            <KeyRound className="w-8 h-8 text-custom-green-500" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center text-custom-green-900 mb-2">
          Reset Password
        </h1>
        <p className="text-center text-custom-green-700 mb-8">
          Enter your new password below
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-custom-green-900 text-sm font-medium mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full px-4 py-3 rounded-lg border border-custom-green-200 focus:ring-2 focus:ring-custom-green-500 focus:border-transparent transition-colors"
                placeholder="Enter new password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-custom-gray-500 hover:text-custom-green-900"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-custom-green-900 text-sm font-medium mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="w-full px-4 py-3 rounded-lg border border-custom-green-200 focus:ring-2 focus:ring-custom-green-500 focus:border-transparent transition-colors"
                placeholder="Confirm new password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-custom-gray-500 hover:text-custom-green-900"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-custom-red-500 text-sm text-center">{error}</div>
          )}

          <button
            type="submit"
            className="w-full bg-custom-green-400 hover:bg-custom-green-500 text-custom-white font-medium py-3 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminResetPassword;
