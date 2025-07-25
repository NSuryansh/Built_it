import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, Eye, EyeOff, Loader } from "lucide-react";
import { ToastContainer } from "react-toastify";
import { checkAuth } from "../../utils/profile";
import PasswordStrengthBar from "react-password-strength-bar";
import CustomToast from "../../components/common/CustomToast";
import CustomLoader from "../../components/common/CustomLoader";
const SignUp = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [acadProg, setAcadProg] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpRight, setOtpRight] = useState("");
  const [passwordScore, setpasswordScore] = useState(0);
  const [isLoading, setisLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    mobile: "",
    altNo: "",
    department: "",
    rollNo: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const token = localStorage.getItem("token");

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

  function handleChange(e) {
    e.preventDefault();
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function sendOTP() {
    try {
      const response = await fetch(
        "/api/user/otpGenerate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({ email: formData.email }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setOtpSent(true);
        CustomToast("OTP sent successfully. Kindly check spam folder as well");
      } else {
        setError(data.message || "Failed to send OTP");
      }
    } catch (err) {
      setError("Failed to send OTP");
    }
  }

  async function verifyOTP() {
    try {
      const response = await fetch("/api/user/otpcheck", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          otp: otp,
          email: formData.email,
        }),
      });
      console.log(response);
      const res = await response.json();
      console.log(res);
      if (response.ok) {
        if (res.message === "Email verified") {
          return true;
        } else {
          return false;
        }
      } else {
        console.error("Error sending OTP: ", res.message);
        setError(res.message || "Failed to send OTP");
        return false;
      }
    } catch (error) {
      console.error("Error sending OTP: ", error);
      setError("Failed to send OTP");
      return false;
    }
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

  async function exportKeyToPEM(key) {
    const exported = await window.crypto.subtle.exportKey("spki", key);
    const exportedAsBase64 = btoa(
      String.fromCharCode(...new Uint8Array(exported))
    );
    return exportedAsBase64.match(/.{1,64}/g).join("\n");
  }

  async function exportPrivateKeyToPEM(privateKey) {
    const exported = await window.crypto.subtle.exportKey("pkcs8", privateKey);
    const exportedAsBase64 = btoa(
      String.fromCharCode(...new Uint8Array(exported))
    );
    return exportedAsBase64.match(/.{1,64}/g).join("\n");
  }

  async function handleInitialSignup(e) {
    e.preventDefault();
    setError("");

    // Validate required fields
    if (
      formData.username === "" ||
      formData.email === "" ||
      formData.mobile === "" ||
      formData.altNo === "" ||
      formData.department === "" ||
      formData.password === "" ||
      formData.confirmPassword === ""
    ) {
      setError("Please fill the fields");
      CustomToast("Please fill the fields");
      return;
    }
    if (formData.mobile === formData.altNo) {
      setError("Phone number and Emergency contact number cannot be the same");
      CustomToast(
        "Phone number and Emergency contact number cannot be the same"
      );
      return;
    }

    if (formData.mobile.length !== 10) {
      setError("Enter a valid phone number");
      CustomToast("Enter a valid phone number");
      return;
    }

    if (formData.altNo.length !== 10) {
      setError("Enter a valid emergency contact number");
      CustomToast("Enter a valid emergency contact number");
      return;
    }

    // if (passwordScore < 2) {
    //   setError("Please set a strong password");
    //   CustomToast("Please set a strong password");
    //   return;
    // }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      CustomToast("Passwords do not match");
      return;
    }

    const lowerCaseEmail = formData.email.toLowerCase();
    const [address, domain] = lowerCaseEmail.split("@");

    if (domain != "iiti.ac.in") {
      setError("Please sign up with your institute email id");
      CustomToast("Please sign up with your institute email id");
      return;
    }

    let numfound = false;
    let roll = "";
    for (let i = 0; i < address.length; i++) {
      if (address[i] >= "0" && address[i] <= "9") {
        numfound = true;
        roll += address[i];
      } else if (numfound === true) {
        setError("Please enter a valid email address");
        setFormData({ ...formData, rollNo: "" });
        CustomToast("Please enter a valid email address");
        return;
      }
      setFormData({ ...formData, rollNo: roll });
    }
    setisLoading(true);
    try {
      const response = await fetch(
        `/api/user/check-user?username=${formData.username}`,
        { headers: { Authorization: "Bearer " + token } }
      );
      const data = await response.json();
      if (data.message === "Username already exists!") {
        setError(data.message);
        CustomToast(data.message);
        setisLoading(false);
        return;
      }
    } catch (error) {
      setisLoading(false);
      console.error("Signup error:", error);
      CustomToast(error.toString());
    }

    // Example condition for academic program
    if (lowerCaseEmail.startsWith("phd")) {
      setAcadProg("PHD");
    } else if (formData.rollNo.length === 10) {
      setAcadProg("PG");
    } else {
      setAcadProg("UG");
    }
    await sendOTP();
    setisLoading(false);
  }

  async function handleOTPVerification() {
    setError("");
    setisLoading(true);
    const otpValid = await verifyOTP();
    console.log(otpValid);
    if (!otpValid) {
      setisLoading(false);
      return;
    }
    try {
      const { publicKey, privateKey } = await generateKeyPair();
      const publicKeyPEM = await exportKeyToPEM(publicKey);
      const privateKeyPEM = await exportPrivateKeyToPEM(privateKey);
      localStorage.setItem("privateKey", privateKeyPEM);

      const {
        username,
        email,
        mobile,
        password,
        altNo,
        department,
        rollNo,
        gender,
      } = formData;
      const response = await fetch("/api/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          username: username,
          email: email,
          mobile: mobile,
          password: password,
          altNo: altNo,
          publicKey: publicKeyPEM,
          department: department,
          acadProg: acadProg,
          rollNo: rollNo,
          gender: gender,
        }),
      });
      const data = await response.json();
      console.log("Signup successful:", data);
      CustomToast("Signup successful");
      setisLoading(false);
      navigate("/user/login");
    } catch (error) {
      setisLoading(false);
      console.error("Signup error:", error);
      CustomToast(error.toString());
    }
  }
  return (
    <div className="min-h-screen bg-[var(--custom-orange-50)] flex items-center justify-center p-4">
      <ToastContainer />
      <div className="max-w-md w-full space-y-2 bg-[var(--custom-white)] p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="p-3 bg-[var(--custom-orange-100)] rounded-full">
              <UserPlus className="h-8 w-8 text-[var(--custom-orange-500)]" />
            </div>
          </div>
          <h2 className="mt-4 text-3xl font-bold text-[var(--custom-orange-900)]">
            Sign Up
          </h2>
          {error && (
            <p className="mt-2 text-[var(--custom-red-600)] text-sm">{error}</p>
          )}
        </div>

        {/* If OTP has not been sent, show the signup form */}
        {!otpSent && (
          <form>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-[var(--custom-orange-900)]"
                >
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Username"
                  id="username"
                  className="mt-1 w-full px-4 py-2 border border-[var(--custom-orange-200)] rounded-lg focus:ring-2 focus:ring-[var(--custom-orange-500)] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-[var(--custom-orange-900)]"
                >
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Email (Institute email only)"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  id="email"
                  className="mt-1 w-full px-4 py-2 border border-[var(--custom-orange-200)] rounded-lg focus:ring-2 focus:ring-[var(--custom-orange-500)] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="department"
                  className="block text-sm font-medium text-[var(--custom-orange-900)]"
                >
                  Department
                </label>
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 border border-[var(--custom-orange-200)] rounded-lg focus:ring-2 focus:ring-[var(--custom-orange-500)] focus:border-transparent bg-[var(--custom-white)]"
                  required
                >
                  <option value="">Select a department</option>
                  <option value="Astronomy, Astrophysics and Space">
                    Astronomy, Astrophysics and Space
                  </option>
                  <option value="Biosciences and Biomedical">
                    Biosciences and Biomedical
                  </option>
                  <option value="Chemical">Chemical</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Civil">Civil</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Humanities and Social Sciences">
                    Humanities and Social Sciences
                  </option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Metallurgical and Materials Science">
                    Metallurgical and Materials Science
                  </option>
                  <option value="Physics">Physics</option>
                  <option value="School of Innovation">
                    School of Innovation
                  </option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="mobile"
                  className="block text-sm font-medium text-[var(--custom-orange-900)]"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  placeholder="Phone Number"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 border border-[var(--custom-orange-200)] rounded-lg focus:ring-2 focus:ring-[var(--custom-orange-500)] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="altNo"
                  className="block text-sm font-medium text-[var(--custom-orange-900)]"
                >
                  Emergency Contact Number
                </label>
                <input
                  id="altNo"
                  type="tel"
                  name="altNo"
                  value={formData.altNo}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 border border-[var(--custom-orange-200)] rounded-lg focus:ring-2 focus:ring-[var(--custom-orange-500)] focus:border-transparent"
                  placeholder="Emergency Contact Number"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-[var(--custom-orange-900)]"
                >
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 border border-[var(--custom-orange-200)] rounded-lg focus:ring-2 focus:ring-[var(--custom-orange-500)] focus:border-transparent bg-[var(--custom-white)]"
                  required
                >
                  <option value="">Select gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Others</option>
                </select>
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
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    id="password"
                    className="mt-1 w-full px-4 py-2 border border-[var(--custom-orange-200)] rounded-lg focus:ring-2 focus:ring-[var(--custom-orange-500)] focus:border-transparent"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--custom-gray-500)] hover:text-[var(--custom-blue-900)]"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              {/* <PasswordStrengthBar
                onChangeScore={(score) => {
                  setpasswordScore(score);
                }}
                password={formData.password}
              /> */}

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-[var(--custom-orange-900)]"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="mt-1 w-full px-4 py-2 border border-[var(--custom-orange-200)] rounded-lg focus:ring-2 focus:ring-[var(--custom-orange-500)] focus:border-transparent"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--custom-gray-500)] hover:text-[var(--custom-orange-900)]"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={handleInitialSignup}
              disabled={isLoading}
              className="w-full flex justify-center items-center mt-6 py-3 px-4 bg-[var(--custom-orange-400)] text-[var(--custom-white)] rounded-lg hover:bg-[var(--custom-orange-500)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--custom-orange-500)] focus:ring-offset-2"
            >
              {isLoading ? <Loader /> : <>Signup</>}
            </button>
          </form>
        )}

        {otpSent && (
          <div className="space-y-4">
            <p className="text-center">
              Enter the OTP sent to your registered email.
            </p>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-[var(--custom-orange-200)] rounded-lg focus:ring-2 focus:ring-[var(--custom-orange-500)] focus:border-transparent"
            />
            <button
              onClick={handleOTPVerification}
              disabled={isLoading}
              type="button"
              className="w-full flex items-center justify-center mt-6 py-3 px-4 bg-[var(--custom-orange-400)] text-[var(--custom-white)] rounded-lg hover:bg-[var(--custom-orange-500)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--custom-orange-500)] focus:ring-offset-2"
            >
              {isLoading ? <Loader /> : <>Verify OTP &amp; Complete Signup</>}
            </button>
          </div>
        )}

        <p className="mt-4 text-sm text-center text-cus">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/user/login")}
            className="underline font-bold text-[var(--custom-orange-500)]"
          >
            Login here
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
