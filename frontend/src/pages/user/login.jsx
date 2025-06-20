import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, Fingerprint } from "lucide-react";
import { ToastContainer } from "react-toastify";
import { checkAuth } from "../../utils/profile";
import CustomToast from "../../components/common/CustomToast";
import CustomLoader from "../../components/common/CustomLoader";

const CircularLoader = ({
  color = "#ff4800",
  size = 40,
  text = "Loading...",
}) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className="rounded-full border-4 border-t-transparent animate-spin"
        style={{
          borderColor: `${color}40`,
          borderTopColor: color,
          width: size,
          height: size,
        }}
      />
      {text && <p className="mt-4 text-orange-800 font-medium">{text}</p>}
    </div>
  );
};

const Login = () => {
  const token = localStorage.getItem("token");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [showForgotModal, setShowForgotModal] = useState(false);
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setisLoading] = useState(false);
  const [showBiometricModal, setShowBiometricModal] = useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      const userAuthStatus = await checkAuth("user");
      if (userAuthStatus) {
        setIsAuthenticated(userAuthStatus);
        navigate("/user/dashboard");
      } else {
        setIsAuthenticated(false);
      }
    };
    verifyAuth();
  }, []);

  if (isAuthenticated === null) {
    return <CustomLoader text="Loading your wellness journey..." />;
  }

  const handlelogin = async (e) => {
    e.preventDefault();
    setisLoading(true);
    if (username === "" || password === "") {
      setError("Please fill the fields");
      setisLoading(false);
      return;
    }
    setError("");
    const response = await fetch("http://localhost:3000/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });
    const res = await response.json();

    if (res.success) {
      localStorage.setItem("userid", res.user.id);

      subscribeToPush(res.user.id);
    }

    if (res["message"] === "Login successful") {
      localStorage.setItem("token", res["token"]);
      navigate("/user/dashboard");
    } else {
      CustomToast(res["message"]);
    }
    setisLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!email) {
      CustomToast("Please enter an email");
      return;
    }
    const response = await fetch("http://localhost:3000/user/forgotPassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        email: email,
      }),
    });
    const res = await response.json();
    CustomToast(res.message);
    setShowForgotModal(false);
  };

  const base64urlToBase64 = (base64url) => {
    let base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4 !== 0) {
      base64 += "=";
    }
    return base64;
  };
  const bufferToBase64url = (buffer) => {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  };

  const handleBiometricLogin = async () => {
    console.log(username, "usduse");
    const data = await fetch(
      "http://localhost:3000/user/generateBioAuthOptions",
      {
        method: "POST",
        body: JSON.stringify({
          emailId: username,
        }),
        headers: { "Content-type": "application/json" },
      }
    ).then((res) => res.json());
    const options = data.options;
    console.log(options);
    options.challenge = Uint8Array.from(
      atob(base64urlToBase64(options.challenge)),
      (c) => c.charCodeAt(0)
    );
    options.allowCredentials = options.allowCredentials.map((cred) => ({
      ...cred,
      id: Uint8Array.from(atob(base64urlToBase64(cred.id)), (c) =>
        c.charCodeAt(0)
      ),
    }));

    const assertion = await navigator.credentials.get({ publicKey: options });

    const response = {
      id: bufferToBase64url(assertion.rawId),
      rawId: bufferToBase64url(assertion.rawId),
      type: assertion.type,
      response: {
        clientDataJSON: bufferToBase64url(assertion.response.clientDataJSON),
        authenticatorData: bufferToBase64url(
          assertion.response.authenticatorData
        ),
        signature: bufferToBase64url(assertion.response.signature),
        userHandle: assertion.response.userHandle
          ? bufferToBase64url(assertion.response.userHandle)
          : null,
      },
    };

    const res = await fetch("http://localhost:3000/user/verifyBioLogin", {
      method: "POST",
      // body: JSON.stringify({
      //   emailId: username
      // }),
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...response,
        emailId: username,
      }),
    }).then((res) => res.json());
    console.log(res);
    if (res.success === true) {
      localStorage.setItem("token", res["token"]);
      navigate("/user/dashboard");
    }
    setShowBiometricModal(false);
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
          {error && (
            <p className="mt-2 text-[var(--custom-red-600)] text-sm">{error}</p>
          )}
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--custom-gray-500)] hover:text-[var(--custom-orange-900)]"
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
          onClick={() => setShowBiometricModal(true)}
          disabled={isLoading}
          className="w-full flex justify-center items-center py-3 px-4 bg-[var(--custom-orange-100)] text-[var(--custom-orange-600)] rounded-lg hover:bg-[var(--custom-orange-200)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--custom-orange-500)] "
        >
          <div className="flex items-center">
            <Fingerprint className="h-5 w-5 mr-2" />
            <span>Login with Biometric</span>
          </div>
        </button>

        <button
          disabled={isLoading}
          onClick={handlelogin}
          className="w-full flex justify-center items-center mt-3 py-3 px-4 bg-[var(--custom-orange-400)] text-[var(--custom-white)] rounded-lg hover:bg-[var(--custom-orange-500)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--custom-orange-500)] focus:ring-offset-2 min-h-[48px]"
        >
          {isLoading ? (
            <div className="flex items-center justify-center w-[24px] h-[24px]">
              <CircularLoader
                color="#ffffff"
                size={24}
                text={null}
                className="inline-block"
              />
            </div>
          ) : (
            <>Login</>
          )}
        </button>
        <p className="mt-4 text-sm text-center text-[var(--custom-black)]">
          If not registered{" "}
          <button
            onClick={() => navigate("/user/signup")}
            className="underline font-bold text-[var(--custom-orange-500)]"
          >
            click here
          </button>
        </p>

        <div className="flex justify-center mt-2 items-center text-[var(--custom-gray-500)]">
          <hr className="flex-1/3" />
          <div className="flex-1/3 text-center">OR</div>
          <hr className="flex-1/3" />
        </div>
        <div className="flex w-full mt-2">
          <p className="w-full text-center">
            Login as a&nbsp;
            <button
              onClick={() =>
                (window.location.href = "https://hms-sso.vercel.app")
              }
              className="underline font-bold text-[var(--custom-orange-500)]"
            >
              Doctor
            </button>
            &nbsp;or&nbsp;
            <button
              onClick={() =>
                (window.location.href = "https://hms-sso.vercel.app")
              }
              className="underline font-bold text-[var(--custom-orange-500)]"
            >
              Admin
            </button>
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-25 backdrop-blur-sm">
          <div className="bg-[var(--custom-white)] p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-xl font-bold text-[var(--custom-orange-900)] mb-4">
              Reset Password
            </h3>
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
                className="mr-2 px-4 py-2 text-sm text-[var(--custom-gray-600)] hover:text-[var(--custom-gray-800)]"
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

      {showBiometricModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-25 backdrop-blur-sm">
          <div className="bg-[var(--custom-white)] p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-xl font-bold text-[var(--custom-orange-900)] mb-4">
              Biometric Login
            </h3>
            <p className="mb-4 text-sm">Please enter your username:</p>
            <input
              type="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username"
              className="w-full px-4 py-2 border border-[var(--custom-orange-200)] rounded-lg focus:ring-2 focus:ring-[var(--custom-orange-500)] focus:border-transparent"
            />
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowBiometricModal(false)}
                className="mr-2 px-4 py-2 text-sm text-[var(--custom-gray-600)] hover:text-[var(--custom-gray-800)]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleBiometricLogin()}
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
