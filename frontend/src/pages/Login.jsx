import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handlelogin = async () => {
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });
    console.log(response);
    const res = await response.json();

    if (res["message"] == "Login successful") {
      console.log(res["message"]);
      localStorage.setItem("token", res["token"]);
      navigate("/dashboard");
    } else {
      setError(res["message"]);
    }
  };
  return (
    <div className="h-screen flex flex-col justify-center">
      <Navbar />
      <div className="h-full flex items-center justify-center">
        <div className="bg-[var(--login-bg-peach)] w-80 p-10 rounded-md shadow-md">
          <h1 className="text-2xl font-bold text-[var(--login-text-color)] mb-4 text-center">
            LOGIN
          </h1>

          <input
            type="text"
            placeholder="username"
            className="w-full mb-8 p-3  border border-[var(--login-input-border)] bg-[var(--login-input-bg)]
            rounded-md"
            // value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="password"
            className="w-full mb-8 p-3 border border-[var(--login-input-border)] bg-[var(--login-input-bg)]
            rounded-md"
            // value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="w-full py-2 bg-[var(--login-button-orange)] text-[var(--login-button-text)]
            font-semibold rounded-md hover:opacity-90 transition-opacity cursor-pointer"
            onClick={handlelogin}
          >
            Login
          </button>

          <p className="mt-6 text-sm text-center text-[var(--login-text-color)]">
            If not registered{" "}
            <a href="/signup" className="underline">
              click here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
