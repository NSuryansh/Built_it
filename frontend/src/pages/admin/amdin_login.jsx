import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handlelogin = async (e) => {
    e.preventDefault();
    const response = await fetch(
      "https://built-it-xjiq.onrender.com/adminLogin",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      }
    );
    console.log(response);
    const res = await response.json();

    if (res["message"] === "Login successful") {
      console.log(res["message"]);
      localStorage.setItem("token", res["token"]);
      navigate("/admin/dashboard");
    } else {
      setError(res["message"]);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--custom-primary-green-50)] flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-2 bg-[var(--custom-white)] p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="p-3 bg-[var(--custom-primary-green-100)] rounded-full">
              <Lock className="h-8 w-8 text-[var(--custom-primary-green-600)]" />
            </div>
          </div>
          <h2 className="mt-4 text-3xl font-bold text-[var(--custom-primary-green-900)]">
            Admin Login
          </h2>
          {error && <p className="mt-2 text-red-600 text-sm">{error}</p>}
        </div>

        <form className="mt-8 space-y-6" onSubmit={handlelogin}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[var(--custom-primary-green-900)]"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full px-4 py-2 border border-[var(--custom-primary-green-200)] rounded-lg focus:ring-2 focus:ring-[var(--custom-primary-green-500)] focus:border-transparent"
                placeholder="admin@example.com"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[var(--custom-primary-green-900)]"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full px-4 py-2 border border-[var(--custom-primary-green-200)] rounded-lg focus:ring-2 focus:ring-[var(--custom-primary-green-500)] focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-[var(--custom-primary-green-600)] text-[var(--custom-white)] rounded-lg hover:bg-[var(--custom-primary-green-700)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--custom-primary-green-500)] focus:ring-offset-2"
          >
            Login
          </button>
        </form>
        <p className="mt-6 text-sm text-center text-[var(--login-text-color)]">
          If not registered{" "}
          <a
            href="/signup"
            className="underline font-bold text-[var(--custom-primary-green)]"
          >
            click here
          </a>
        </p>

        <div className="flex justify-center mt-2 items-center text-[var(--login-light-text)]">
          <hr className="flex-1/3" />
          <div className="flex-1/3 text-center">OR</div>
          <hr className="flex-1/3" />
        </div>
        <div className="flex w-full mt-2">
          <p className="w-full text-center">
            Login as a&nbsp;
            <a
              href="/doctor/login"
              className="underline font-bold text-[var(--custom-primary-green)]"
            >
              Doctor
            </a>
            &nbsp;or&nbsp;
            <a
              href="/admin/login"
              className="underline font-bold text-[var(--custom-primary-green)]"
            >
              Admin
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
