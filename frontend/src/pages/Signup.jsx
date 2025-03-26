import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, Eye, EyeOff } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";

const SignUp = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    mobile: "",
    altNo: "",
    password: "",
    confirmPassword: "",
  });

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function generateKeyPair() {
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
      },
      true,
      ["encrypt", "decrypt"]
    );

    return keyPair;
  }

  async function exportKeyToPEM(key, type) {
    const exported = await crypto.subtle.exportKey("spki", key);
    const exportedAsBase64 = btoa(
      String.fromCharCode(...new Uint8Array(exported))
    );

    return `${exportedAsBase64.match(/.{1,64}/g)}`;
  }

  async function exportPrivateKeyToPEM(privateKey) {
    const exported = await crypto.subtle.exportKey("pkcs8", privateKey);
    const exportedAsBase64 = btoa(
      String.fromCharCode(...new Uint8Array(exported))
    );

    return `${exportedAsBase64.match(/.{1,64}/g)}`;
  }

  async function handleSignup() {
    if (
      formData.username === "" ||
      formData.email === "" ||
      formData.mobile === "" ||
      formData.password === "" ||
      formData.confirmPassword === ""
    ) {
      setError("Please fill the fields");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    setError("");
    const { username, email, mobile, password, altNo, confirmPassword } =
      formData;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const { publicKey, privateKey } = await generateKeyPair();
      console.log(publicKey);
      const publicKeyPEM = await exportKeyToPEM(publicKey, "PUBLIC");
      const privateKeyPEM = await exportPrivateKeyToPEM(privateKey);
      console.log(publicKeyPEM);
      localStorage.setItem("privateKey", privateKeyPEM);

      const response = await fetch(
        "https://built-it-xjiq.onrender.com/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: username,
            email: email,
            mobile: mobile,
            password: password,
            altNo: altNo,
            publicKey: publicKeyPEM,
          }),
        }
      );

      const data = await response.json();
      console.log("Signup successful:", data);
      navigate("/login");
    } catch (error) {
      console.error("Signup error:", error);
      toast(error, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: "custom-toast",
      });
    }
  }

  return (
    <>
      <div className="min-h-screen bg-[var(--custom-orange-50)] flex items-center justify-center p-4">
        <ToastContainer />
        <div className="max-w-md w-full space-y-2 bg-[var(--custom-white)] p-8 rounded-xl shadow-lg">
          <div className="text-center">
            <div className="flex justify-center">
              <div className="p-3 bg-[var(--custom-orange-100)] rounded-full">
                <UserPlus className="h-8 w-8 text-[var(--custom-orange-600)]" />
              </div>
            </div>
            <h2 className="mt-4 text-3xl font-bold text-[var(--custom-orange-900)]">
              Sign Up
            </h2>
            {error && <p className="mt-2 text-red-600 text-sm">{error}</p>}
          </div>

          <form>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-[var(--custom-orange-900)]"
                >
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Username"
                  id="username"
                  className="mt-1 w-full px-4 py-2 border border-[var(--custom-orange-200)] rounded-lg focus:ring-2 focus:ring-[var(--custom-orange-500)] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-[var(--custom-orange-900)]"
                >
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  id="email"
                  className="mt-1 w-full px-4 py-2 border border-[var(--custom-orange-200)] rounded-lg focus:ring-2 focus:ring-[var(--custom-orange-500)] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="mobile"
                  className="block text-sm font-medium text-[var(--custom-orange-900)]"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  placeholder="Phone Number"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 border border-[var(--custom-orange-200)] rounded-lg focus:ring-2 focus:ring-[var(--custom-orange-500)] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="altNo"
                  className="block text-sm font-medium text-[var(--custom-orange-900)]"
                >
                  Alternate Number
                </label>
                <input
                  id="altNo"
                  type="tel"
                  name="altNo"
                  value={formData.altNo}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 border border-[var(--custom-orange-200)] rounded-lg focus:ring-2 focus:ring-[var(--custom-orange-500)] focus:border-transparent"
                  placeholder="Enter alternate number (optional)"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-[var(--custom-orange-900)]"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    id="password"
                    className="mt-1 w-full px-4 py-2 border border-[var(--custom-orange-200)] rounded-lg focus:ring-2 focus:ring-[var(--custom-orange-500)] focus:border-transparent"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-900"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-[var(--custom-orange-900)]"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="mt-1 w-full px-4 py-2 border border-[var(--custom-orange-200)] rounded-lg focus:ring-2 focus:ring-[var(--custom-orange-500)] focus:border-transparent"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[var(--custom-orange-900)]"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={handleSignup}
              type="button"
              className="w-full mt-6 py-3 px-4 bg-[var(--custom-orange-400)] text-[var(--custom-white)] rounded-lg hover:bg-[var(--custom-orange-500)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--custom-orange-500)] focus:ring-offset-2"
            >
              Sign Up
            </button>
          </form>

          <p className="mt-4 text-sm text-center text-[var(--login-text-color)]">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="underline font-bold text-[var(--custom-primary-orange)]"
            >
              Login here
            </button>
          </p>
        </div>
      </div>
    </>
  );
};

export default SignUp;
