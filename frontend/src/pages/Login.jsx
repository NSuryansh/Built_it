import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
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
    <div className="min-h-screen bg-[var(--custom-orange-50)] flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-2 bg-[var(--custom-white)] p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="p-3 bg-[var(--custom-orange-100)] rounded-full">
              <Lock className="h-8 w-8 text-[var(--custom-orange-600)]" />
            </div>
          </div>
          <h2 className="mt-4 text-3xl font-bold text-[var(--custom-orange-900)]">
            User Login
          </h2>
          {error && <p className="mt-2 text-red-600 text-sm">{error}</p>}
        </div>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-[var(--custom-orange-900)]"
            >
              Username
            </label>
            <input
              id="username"
              type="name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-[var(--custom-orange-200)] rounded-lg focus:ring-2 focus:ring-[var(--custom-orange-500)] focus:border-transparent"
              placeholder="username"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[var(--custom-orange-900)]"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-[var(--custom-orange-200)] rounded-lg focus:ring-2 focus:ring-[var(--custom-orange-500)] focus:border-transparent"
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        <button
          onClick={handlelogin}
          className="w-full mt-6 py-3 px-4 bg-[var(--custom-orange-400)] text-[var(--custom-white)] rounded-lg hover:bg-[var(--custom-orange-500)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--custom-orange-500)] focus:ring-offset-2"
        >
          Login
        </button>
        <p className="mt-4 text-sm text-center text-[var(--login-text-color)]">
          If not registered{" "}
          <button
            onClick={() => navigate("/signup")}
            className="underline font-bold text-[var(--custom-primary-orange)]"
          >
            click here
          </button>
        </p>

        <div className="flex justify-center mt-2 items-center text-[var(--login-light-text)]">
          <hr className="flex-1/3" />
          <div className="flex-1/3 text-center">OR</div>
          <hr className="flex-1/3" />
        </div>
        <div className="flex w-full mt-2">
          <p className="w-full text-center">
            Login as a&nbsp;
            <button
              onClick={() => navigate("/doctor/login")}
              className="underline font-bold text-[var(--custom-primary-orange)]"
            >
              Doctor
            </button>
            &nbsp;or&nbsp;
            <button
              onClick={() => navigate("admin/login")}
              className="underline font-bold text-[var(--custom-primary-orange)]"
            >
              Admin
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
