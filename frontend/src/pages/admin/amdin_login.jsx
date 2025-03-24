import { set } from "date-fns";
import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock } from 'lucide-react';

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handlelogin = async () => {
    // const response = await fetch("http://localhost:3000/login", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     username: username,
    //     password: password,
    //   }),
    // });
    // console.log(response);
    // const res = await response.json();
    // console.log(res);

    // if (res["message"] == "Login successful") {
    //   console.log(res["message"]);
    //   const response2 = await fetch("http://localhost:3000/profile", {
    //     method: "GET",
    //     headers: { Authorization: "Bearer " + res["token"] },
    //   });
    //   const res2 = await response2.json();
    //   console.log(res2);
    //   if (res2["message"] == "Unauthorized") {
    //     console.log(res2["message"]);
    //   } else {
    //     console.log(res2["message"]);
    //     navigate("/peer", { state: res2["user"] });
    //   }
    // } else {
    //   setError(res["message"]);
    // }
    navigate("/admin/dashboard");
  };
  return (
    <div className="min-h-screen bg-[var(--custom-primary-green-50)] flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-[var(--custom-white)] p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="p-3 bg-[var(--custom-primary-green-100)] rounded-full">
              <Lock className="h-8 w-8 text-[var(--custom-primary-green-600)]" />
            </div>
          </div>
          <h2 className="mt-4 text-3xl font-bold text-[var(--custom-primary-green-900)]">
            Admin Login
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handlelogin}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-[var(--custom-primary-green-900)]"
              >
                Username
              </label>
              <input
                id="username"
                type="name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 w-full px-4 py-2 border border-[var(--custom-primary-green-200)] rounded-lg focus:ring-2 focus:ring-[var(--custom-primary-green-500)] focus:border-transparent"
                placeholder="admin"
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
      </div>
    </div>
  );
};

export default AdminLogin;
