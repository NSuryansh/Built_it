import React from "react";

export default function SignUp() {
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
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-2 border border-[var(--login-input-border)] bg-[var(--login-input-bg)]
            rounded-md"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 border border-[var(--login-input-border)] bg-[var(--login-input-bg)]
            rounded-md"
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full mb-6 p-2 border border-[var(--login-input-border)] bg-[var(--login-input-bg)]
            rounded-md"
        />

        <button className="w-full py- bg-[var(--login-button-orange)] text-[var(--login-button-text)]    font-semibold rounded-md hover:opacity-90 transition-opacity">
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
