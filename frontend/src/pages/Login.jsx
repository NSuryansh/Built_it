import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // const [error, setError] = useState("");
  const navigate = useNavigate();

  const handlelogin = async () => {
    const response = await fetch("https://built-it-xjiq.onrender.com/login", {
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
      alert(res["message"]);
    }
  };
  return (
    <>
      <Navbar />
      <div className="h-screen flex flex-col justify-center">
        <div className="h-full px-4 flex items-center justify-center">
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
              <a
                href="/signup"
                className="underline font-bold text-[var(--login-button-orange)]"
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
                  className="underline font-bold text-[var(--login-button-orange)]"
                >
                  Doctor
                </a>
                &nbsp;or&nbsp;
                <a
                  href="/admin/login"
                  className="underline font-bold text-[var(--login-button-orange)]"
                >
                  Admin
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
