import React from "react";
import { useState } from "react";

export default function SignUp() {

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
    const exportedAsBase64 = btoa(String.fromCharCode(...new Uint8Array(exported)));

    return `${exportedAsBase64.match(/.{1,64}/g)}`;
  }
  async function exportPrivateKeyToPEM(privateKey) {
    const exported = await crypto.subtle.exportKey("pkcs8", privateKey);
    const exportedAsBase64 = btoa(String.fromCharCode(...new Uint8Array(exported)));

    return `${exportedAsBase64.match(/.{1,64}/g)}`;
  }
  async function handleSignup() {

    const { username, email, mobile, password, altNo, confirmPassword } = formData;

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      const { publicKey, privateKey } = await generateKeyPair();
      console.log(publicKey)
      const publicKeyPEM = await exportKeyToPEM(publicKey, "PUBLIC");
      const privateKeyPEM = await exportPrivateKeyToPEM(privateKey);
      console.log(publicKeyPEM)
      localStorage.setItem("privateKey", privateKeyPEM);

      const response = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username, email: email, mobile: mobile, password: password, altNo: altNo, publicKey: publicKeyPEM }),
      });

      const data = await response.json();
      console.log("Signup successful:", data);

    } catch (error) {
      console.error("Signup error:", error);
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
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
          className="w-full mb-4 p-2 border border-[var(--login-input-border)] bg-[var(--login-input-bg)]
            rounded-md"
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full mb-4 p-2 border border-[var(--login-input-border)] bg-[var(--login-input-bg)]
            rounded-md"
        />
        <input
          type="text"
          placeholder="Phone Number"
          name="mobile"
          value={formData.mobile}
          onChange={handleChange}
          className="w-full mb-4 p-2 border border-[var(--login-input-border)] bg-[var(--login-input-bg)]
            rounded-md"
        />
        <input
          type="text"
          placeholder="Alternate number"
          name="altNo"
          value={formData.altNo}
          onChange={handleChange}
          className="w-full mb-4 p-2 border border-[var(--login-input-border)] bg-[var(--login-input-bg)]
            rounded-md"
        />
        <input
          type="text"
          placeholder="Alternate number"
          name="altNo"
          value={formData.altNo}
          onChange={handleChange}
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
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full mb-4 p-2 border border-[var(--login-input-border)] bg-[var(--login-input-bg)]
            rounded-md"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full mb-6 p-2 border border-[var(--login-input-border)] bg-[var(--login-input-bg)]
            rounded-md"
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button onClick={handleSignup} className="w-full py- bg-[var(--login-button-orange)] text-[var(--login-button-text)]    font-semibold rounded-md hover:opacity-90 transition-opacity">
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