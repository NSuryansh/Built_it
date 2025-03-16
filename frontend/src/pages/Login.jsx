import React from "react";
import { useState, useEffect } from "react";

export default function Login() {
  return (
   
    <div className="flex items-center justify-center h-screen ">
      <div className="bg-[var(--login-bg-peach)] w-80 p-10 rounded-md shadow-md">
        <h1 className="text-2xl font-bold text-[var(--login-text-color)] mb-4 text-center">
          LOGIN
        </h1>

        <input type="text" placeholder="username"
          className="w-full mb-8 p-3  border border-[var(--login-input-border)] bg-[var(--login-input-bg)]
            rounded-md"/>
        
        <input type="password" placeholder="password"
          className="w-full mb-8 p-3 border border-[var(--login-input-border)] bg-[var(--login-input-bg)]
            rounded-md"/>

        <button
          className="w-full py-2 bg-[var(--login-button-orange)] text-[var(--login-button-text)]
            font-semibold rounded-md hover:opacity-90 transition-opacity">
          Login
        </button>

        <p className="mt-6 text-sm text-center text-[var(--login-text-color)]">
          If not registered <a href="/signup" className="underline">click here</a>
        </p>
      </div>
    </div>
  );
}
