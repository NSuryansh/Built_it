import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [altNo, setAltNo] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "username": username,
          "email": email,
          "password": password,
          "mobile": mobile,
          "altNo": altNo
        }),
      });
      const data = await response.json();
      if (data.status === 201) {
        alert(data.message);
        navigate("/login");
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError(error);
      console.log(error);
    }
  }
  return (
    <div className="flex items-center justify-center h-screen bg-[var(--background-image)] bg-cover bg-center">
      <div className="bg-[var(--login-bg-peach)] w-96 p-8 rounded-md shadow-md">
        <h1 className="text-2xl font-bold text-[var(--login-text-color)] mb-6 text-center">
          SIGN UP
        </h1>

        <input
          type="text"
          placeholder="Username"
          className="w-full mb-4 p-2 border border-[var(--login-input-border)] bg-[var(--login-input-bg)]
            rounded-md"
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-2 border border-[var(--login-input-border)] bg-[var(--login-input-bg)]
            rounded-md"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Mobile"
          className="w-full mb-4 p-2 border border-[var(--login-input-border)] bg-[var(--login-input-bg)]
            rounded-md"
          onChange={(e) => setMobile(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Alternate Mobile"
          className="w-full mb-4 p-2 border border-[var(--login-input-border)] bg-[var(--login-input-bg)]
            rounded-md"
          onChange={(e) => setAltNo(e.target.value)}
        />
 
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 border border-[var(--login-input-border)] bg-[var(--login-input-bg)]
            rounded-md"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full mb-6 p-2 border border-[var(--login-input-border)] bg-[var(--login-input-bg)]
            rounded-md"
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button className="w-full py- bg-[var(--login-button-orange)] text-[var(--login-button-text)]    font-semibold rounded-md hover:opacity-90 transition-opacity" onClick={handleSubmit}>
          Sign Up
        </button>

        <p className="mt-6 text-sm text-center text-[var(--login-text-color)]">
          Already have an account?{" "}
          <a href="/login" className="underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}

export default SignUp;