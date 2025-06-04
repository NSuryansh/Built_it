import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, Loader } from "lucide-react";
import { ToastContainer } from "react-toastify";
import { checkAuth } from "../../utils/profile";
import CustomToast from "../../components/common/CustomToast";
import CustomLoader from "../../components/common/CustomLoader";

// Circular Loader Component
const CircularLoader = ({
  color = "#004ba8",
  size = 40,
  text = "Loading...",
}) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className="rounded-full border-4 border-t-transparent animate-spin"
        style={{
          borderColor: `${color}40`,
          borderTopColor: color,
          width: size,
          height: size,
        }}
      />
      {text && <p className="mt-4 text-blue-800 font-medium">{text}</p>}
    </div>
  );
};

const DoctorLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setisLoading] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const verifyAuth = async () => {
      const docAuthStatus = await checkAuth("doc");
      if (docAuthStatus) {
        setIsAuthenticated(docAuthStatus);
        navigate("/doctor/landing");
      } else {
        setIsAuthenticated(false);
      }
    };
    verifyAuth();
  }, [navigate]);

  if (isAuthenticated === null) {
    return <CustomLoader color="blue" text="Loading your dashboard..." />;
  }

  const handlelogin = async (e) => {
    e.preventDefault();
    if (email === "" || password === "") {
      setError("Please fill the fields");
      return;
    }
    setError("");
    setisLoading(true);
    const response = await fetch("https://built-it.onrender.com/docLogin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });
    const res = await response.json();

    if (res["message"] === "Login successful") {
      localStorage.setItem("token", res["token"]);
      setisLoading(false);
      navigate("/doctor/landing");
    } else {
      setisLoading(false);
      CustomToast(res["message"], "blue");
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      CustomToast("Please enter an email", "blue");
      return;
    }
    const response = await fetch(
      "https://built-it.onrender.com/forgotDoctorPassword",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          email: email,
        }),
      }
    );
    const res = await response.json();
    CustomToast(res.message, "blue");
    setShowForgotModal(false);
  };

  const handleEnterKey = (e) => {
    if (e.key === "Enter") {
      handlelogin(e);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[var(--custom-blue-50)] flex items-center justify-center p-4">
        <ToastContainer />
        <div className="max-w-md w-full space-y-2 bg-[var(--custom-white)] p-8 rounded-xl shadow-lg">
          <div className="text-center">
            <div className="flex justify-center">
              <div className="p-3 bg-[var(--custom-blue-100)] rounded-full">
                <Lock className="h-8 w-8 text-[var(--custom-blue-600)]" />
              </div>
            </div>
            <h2 className="mt-4 text-3xl font-bold text-[var(--custom-blue-900)]">
              Doctor Login
            </h2>
            {error && (
              <p className="mt-2 text-[var(--custom-red-600)] text-sm">
                {error}
              </p>
            )}
          </div>

          <form className="mt-8 space-y-6" onSubmit={handlelogin}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-[var(--custom-blue-900)]"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={handleEnterKey}
                  className="mt-1 w-full px-4 py-2 border border-[var(--custom-blue-200)] rounded-lg focus:ring-2 focus:ring-[var(--custom-blue-500)] focus:border-transparent"
                  placeholder="doctor@example.com"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-[var(--custom-blue-900)]"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleEnterKey}
                    className="mt-1 w-full px-4 py-2 border border-[var(--custom-blue-200)] rounded-lg focus:ring-2 focus:ring-[var(--custom-blue-500)] focus:border-transparent"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--custom-gray-500)] hover:text-[var(--custom-blue-900)]"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="mt-1 text-sm text-[var(--custom-blue-600)] hover:text-[var(--custom-blue-700)] transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            <button
              onKeyDown={handleEnterKey}
              disabled={isLoading}
              type="submit"
              className="w-full py-3 px-4 bg-[var(--custom-blue-600)] text-[var(--custom-white)] rounded-lg hover:bg-[var(--custom-blue-700)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--custom-blue-500)] focus:ring-offset-2 flex items-center justify-center min-h-[48px]"
            >
              {isLoading ? (
                <div className="flex items-center justify-center w-[24px] h-[24px]">
                  <CircularLoader
                    color="#ffffff"
                    size={24}
                    text={null}
                    className="inline-block"
                  />
                </div>
              ) : (
                <>Login</>
              )}
            </button>
          </form>
          <div className="flex justify-center mt-4 mb-2 items-center text-[var(--custom-gray-500)]">
            <hr className="flex-1/3" />
            <div className="flex-1/3 text-center">OR</div>
            <hr className="flex-1/3" />
          </div>
          <div className="flex w-full mt-2">
            <p className="w-full text-center">
              Login as a&nbsp;
              <button
                onClick={() => router.push("/user/login")}
                className="underline font-bold text-[var(--custom-blue-500)]"
              >
                User
              </button>
              &nbsp;or&nbsp;
              <button
                onClick={() => router.push("/admin/login")}
                className="underline font-bold text-[var(--custom-blue-500)]"
              >
                Admin
              </button>
            </p>
          </div>
        </div>
        {showForgotModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-[var(--custom-blue-50)] to-[var(--custom-white)] z-50">
            <div className="bg-[var(--custom-white)] p-6 rounded-lg shadow-lg max-w-sm w-full">
              <h3 className="text-xl font-bold text-[var(--custom-blue-900)] mb-4">
                Reset Password
              </h3>
              <p className="mb-4 text-sm">Please enter your email address:</p>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full px-4 py-2 border border-[var(--custom-blue-200)] rounded-lg focus:ring-2 focus:ring-[var(--custom-blue-500)] focus:border-transparent"
              />
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setShowForgotModal(false)}
                  className="mr-2 px-4 py-2 text-sm text-[var(--custom-gray-600)] hover:text-[var(--custom-gray-800)]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleForgotPassword}
                  className="px-4 py-2 text-sm bg-[var(--custom-blue-400)] text-[var(--custom-white)] rounded hover:bg-[var(--custom-blue-500)] transition-colors"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DoctorLogin;
