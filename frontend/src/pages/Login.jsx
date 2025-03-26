import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [showForgotModal, setShowForgotModal] = useState(false);
  const navigate = useNavigate();

  const handlelogin = async () => {
    if (username === "" || password === "") {
      setError("Please fill the fields");
      return;
    }
    setError("");
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

    if (res["message"] === "Login successful") {
      console.log(res["message"]);
      localStorage.setItem("token", res["token"]);
      navigate("/dashboard");
    } else {
      toast(res["message"], {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: "custom-toast",
      });
    }
  };

  const handleForgotPassword = async () => {
    // console.log(email, "AEEE HALLLLO")
    if (!email) {
      toast("Please enter an email", { position: "bottom-right" });
      return;
    }
    const response = await fetch("http://localhost:3000/forgotPassword", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
      }),
    });
    const res = await response.json();
    toast(res.message, { position: "bottom-right" });
    setShowForgotModal(false); 
  };

  return (
    <div className="min-h-screen bg-[var(--custom-orange-50)] flex items-center justify-center p-4">
      <ToastContainer />
      <div className="max-w-md w-full space-y-2 bg-[var(--custom-white)] p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="p-3 bg-[var(--custom-orange-100)] rounded-full">
              <Lock className="h-8 w-8 text-[var(--custom-orange-500)]" />
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
              type="text"
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
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full px-4 py-2 border border-[var(--custom-orange-200)] rounded-lg focus:ring-2 focus:ring-[var(--custom-orange-500)] focus:border-transparent"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[var(--custom-orange-900)]"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <button
              onClick={() => setShowForgotModal(true)}
              className="mt-1 text-sm text-[var(--custom-orange-600)] hover:text-[var(--custom-orange-700)] transition-colors"
            >
              Forgot Password?
            </button>
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
              onClick={() => navigate("/admin/login")}
              className="underline font-bold text-[var(--custom-primary-orange)]"
            >
              Admin
            </button>
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-[var(--custom-white)] p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-xl font-bold text-[var(--custom-orange-900)] mb-4">Reset Password</h3>
            <p className="mb-4 text-sm">Please enter your email address:</p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="w-full px-4 py-2 border border-[var(--custom-orange-200)] rounded-lg focus:ring-2 focus:ring-[var(--custom-orange-500)] focus:border-transparent"
            />
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowForgotModal(false)}
                className="mr-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleForgotPassword}
                className="px-4 py-2 text-sm bg-[var(--custom-orange-400)] text-[var(--custom-white)] rounded hover:bg-[var(--custom-orange-500)] transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
