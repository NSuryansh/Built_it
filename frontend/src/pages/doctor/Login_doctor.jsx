import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DoctorNavbar from "../../components/doctor/Navbar_doctor";

const DoctorLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handlelogin = async () => {
    const response = await fetch("http://localhost:3000/docLogin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });
    console.log(response);
    const res = await response.json();

    if (res["message"] == "Login successful") {
      console.log(res["message"]);
      localStorage.setItem("token", res["token"]);
      navigate("/doctor/landing");
    } else {
      setError(res["message"]);
    }
  };
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-[var(--custom-primary-blue)]">
      <div className="bg-[var(--custom-white)] w-80 p-10 rounded-md shadow-md">
        <form onSubmit={handlelogin}>
          <h1 className="text-2xl font-bold text-[var(--login-text-color)] mb-4 text-center">
            LOGIN
          </h1>

          <input
            type="email"
            placeholder="email"
            className="w-full mb-8 p-3 border border-[var(--login-input-border)] bg-[var(--login-input-bg)]
            rounded-md"
          // value={username}
          onChange={(e) => setEmail(e.target.value)}
        />

          <input
            type="password"
            placeholder="password"
            className="w-full mb-8 p-3 border border-[var(--login-input-border)] bg-[var(--login-input-bg)]
            rounded-md"
            // value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            className="w-full py-2 bg-[var(--custom-primary-blue)] text-[var(--login-button-text)]
            font-semibold rounded-md hover:opacity-90 transition-opacity cursor-pointer"
            type="submit"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default DoctorLogin;
