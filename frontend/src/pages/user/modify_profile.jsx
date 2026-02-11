import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/user/Navbar";
import CustomToast from "../../components/common/CustomToast";
import { ToastContainer } from "react-toastify";
import SessionExpired from "../../components/common/SessionExpired";
import { checkAuth } from "../../utils/profile";
import { Fingerprint } from "lucide-react";
import CustomLoader from "../../components/common/CustomLoader";

const ModifyProfile = ({ username, email, mobile, alt_mobile }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    username,
    email,
    mobile,
    alt_mobile,
  });

  // --- helpers (fixed) ---
  function bufferToBase64Url(buffer) {
    const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
    return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }

  function base64UrlToUint8Array(input) {
    // already a Uint8Array / ArrayBuffer -> return Uint8Array
    if (input instanceof Uint8Array) return input;
    if (input instanceof ArrayBuffer) return new Uint8Array(input);

    // non-string -> encode as UTF-8
    if (typeof input !== "string") {
      return new TextEncoder().encode(String(input));
    }

    const base64url = input;

    // quick check: valid base64url chars (plus optional padding)
    const base64urlPattern = /^[A-Za-z0-9\-_]+={0,2}$/;
    if (!base64urlPattern.test(base64url)) {
      // Not base64url — fallback to UTF-8 bytes (handles UUIDs or plain strings)
      console.warn(
        "base64UrlToUint8Array: input doesn't look like base64url, encoding as UTF-8:",
        base64url,
      );
      return new TextEncoder().encode(base64url);
    }

    // Restore base64 padding and replace url-safe characters
    let base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
    base64 += "=".repeat((4 - (base64.length % 4)) % 4);

    try {
      const binary = atob(base64);
      return Uint8Array.from(binary, (c) => c.charCodeAt(0));
    } catch (err) {
      console.warn(
        "base64UrlToUint8Array: atob failed, falling back to UTF-8. input:",
        base64url,
        err,
      );
      return new TextEncoder().encode(base64url);
    }
  }
  // --- end helpers ---

  useEffect(() => {
    const verifyAuth = async () => {
      const authStatus = await checkAuth("user");
      setIsAuthenticated(authStatus);
    };
    verifyAuth();
  }, []);

  const handleClosePopup = () => {
    navigate("/user/login");
  };

  // --- fixed biometric handler (only corrected part) ---
  const handleBiometricSetup = async (e) => {
    // prevent a form submit if the button is inside a form
    if (e && e.preventDefault) e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/api/user/generateOptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: {
            id: localStorage.getItem("userid"),
            email: localStorage.getItem("user_email"),
          },
        }),
      });

      const data = await res.json();

      if (!data || !data.options) {
        console.error("No options returned from server:", data);
        alert("Server did not return WebAuthn options. See console for details.");
        return;
      }

      const options = data.options;

      // Debug: inspect what server returned
      console.log("WEBAUTHN options from server:", options);

      // Defensive conversion using helper
      if (options.challenge) {
        options.challenge = base64UrlToUint8Array(options.challenge);
      } else {
        console.warn("No options.challenge present");
      }

      if (options.user && options.user.id != null) {
        options.user.id = base64UrlToUint8Array(options.user.id);
      } else {
        console.warn("No options.user.id present");
      }

      options.excludeCredentials = (options.excludeCredentials || []).map((cred) => ({
        ...cred,
        id: base64UrlToUint8Array(cred.id),
      }));

      const credential = await navigator.credentials.create({
        publicKey: options,
      });

      if (!credential) {
        alert("Credential creation returned no result.");
        return;
      }

      const credentialID = bufferToBase64Url(credential.rawId);

      const credentialResponse = {
        id: credentialID,
        rawId: credentialID,
        type: credential.type,
        response: {
          attestationObject: bufferToBase64Url(
            credential.response.attestationObject,
          ),
          clientDataJSON: bufferToBase64Url(credential.response.clientDataJSON),
        },
        emailId: localStorage.getItem("user_email"),
        transports: credential.response.getTransports?.() || [],
      };

      const verifyRes = await fetch(
        "http://localhost:3000/api/user/verifyBioRegistration",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentialResponse),
        },
      );

      const result = await verifyRes.json();
      if (result.success) {
        alert("Biometric registration successful!");
      } else {
        alert("Registration failed: " + (result.error || JSON.stringify(result)));
        console.error("verifyBioRegistration result:", result);
      }
    } catch (err) {
      console.error("Error during biometric registration:", err);
      alert("Error during biometric registration. See console for details.");
    }
  };
  // --- end biometric handler ---

  if (isAuthenticated === null) {
    return <CustomLoader text="Loading your wellness journey..." />;
  }

  if (!isAuthenticated) {
    return (
      <SessionExpired handleClosePopup={handleClosePopup} theme="orange" />
    );
  }

  const dataToSend = {
    id: localStorage.getItem("userid"), // Correctly assigning id
    ...formData, // Spreading formData properties
  };

  const onSave = async (dataToSend) => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/user/modifyUser",
        {
          method: "PUT", // Use PUT to modify user details
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify(dataToSend),
        },
      );

      const result = await response.json();

      if (response.ok) {
        CustomToast("User details updated successfully!");
      } else {
        CustomToast("Error while updating details");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      CustomToast("Error while updating details");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(dataToSend);
  };

  const onCancel = (e) => {
    e.preventDefault();
    navigate("/user/dashboard");
  };

  return (
    <div className="bg-[var(--custom-orange-50)]">
      <Navbar className="bg-[var(--custom-orange-50)]" />
      <ToastContainer />
      <div className="min-h-screen py-16 flex items-center justify-center">
        <div className="max-w-2xl w-full mx-auto bg-[var(--custom-orange-50)] md:bg-[var(--custom-white)] bg-opacity-90 backdrop-blur-md rounded-2xl shadow-none md:shadow-xl md:border border-[var(--custom-orange-100)] overflow-hidden">
          <div className="px-10 py-12">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-extrabold text-[var(--custom-orange-900)] tracking-tight">
                Modify Profile
              </h2>
              <p className="mt-3 text-[var(--custom-orange-600)]">
                Update your profile information
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Username Field */}
              <div className="relative">
                <input
                  type="text"
                  id="username"
                  className="peer w-full rounded-lg border border-[var(--custom-orange-300)] px-5 py-4 text-[var(--custom-orange-900)] bg-transparent focus:border-[var(--custom-orange-600)] focus:ring-2 focus:ring-[var(--custom-orange-200)] focus:outline-none transition-all duration-300 shadow-sm hover:shadow-md"
                  placeholder={
                    localStorage.getItem("username") || "Your username"
                  }
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      username: e.target.value,
                    }))
                  }
                />
                <label
                  htmlFor="username"
                  className="absolute left-5 top-4 text-[var(--custom-orange-500)] text-sm transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-lg peer-focus:top-[-1rem] peer-focus:text-sm peer-focus:text-[var(--custom-orange-700)] peer-valid:top-[-1rem] peer-valid:text-sm peer-valid:text-[var(--custom-orange-700)] bg-[var(--custom-orange-50)] md:bg-[var(--custom-white)] bg-opacity-90 px-2"
                >
                  Username
                </label>
              </div>

              {/* Email Field */}
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={localStorage.getItem("user_email") || "Your email"}
                  className="peer w-full cursor-not-allowed rounded-lg border border-[var(--custom-orange-300)] px-5 py-4 text-[var(--custom-orange-900)] bg-transparent focus:border-[var(--custom-orange-600)] focus:ring-2 focus:ring-[var(--custom-orange-200)] focus:outline-none transition-all duration-300 shadow-sm hover:shadow-md"
                  placeholder={
                    localStorage.getItem("user_email") || "Your email"
                  }
                  onChange={() => {}}
                />
                <label
                  htmlFor="email"
                  className="absolute left-5 top-4 text-[var(--custom-orange-500)] text-sm transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-lg peer-focus:top-[-1rem] peer-focus:text-sm peer-focus:text-[var(--custom-orange-700)] peer-valid:top-[-1rem] peer-valid:text-sm peer-valid:text-[var(--custom-orange-700)] bg-[var(--custom-orange-50)] md:bg-[var(--custom-white)] bg-opacity-90 px-2"
                >
                  Email
                </label>
              </div>

              {/* Phone Number Field */}
              <div className="relative">
                <input
                  type="tel"
                  id="mobile"
                  className="peer w-full rounded-lg border border-[var(--custom-orange-300)] px-5 py-4 text-[var(--custom-orange-900)] bg-transparent focus:border-[var(--custom-orange-600)] focus:ring-2 focus:ring-[var(--custom-orange-200)] focus:outline-none transition-all duration-300 shadow-sm hover:shadow-md"
                  placeholder={
                    localStorage.getItem("user_mobile") || "Your phone number"
                  }
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, mobile: e.target.value }))
                  }
                />
                <label
                  htmlFor="mobile"
                  className="absolute left-5 top-4 text-[var(--custom-orange-500)] text-sm transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-lg peer-focus:top-[-1rem] peer-focus:text-sm peer-focus:text-[var(--custom-orange-700)] peer-valid:top-[-1rem] peer-valid:text-sm peer-valid:text-[var(--custom-orange-700)] bg-[var(--custom-orange-50)] md:bg-[var(--custom-white)] bg-opacity-90 px-2"
                >
                  Phone Number
                </label>
              </div>

              {/* Emergency Contact Number Field */}
              <div className="relative">
                <input
                  type="tel"
                  id="alt_mobile"
                  className="peer w-full rounded-lg border border-[var(--custom-orange-300)] px-5 py-4 text-[var(--custom-orange-900)] bg-transparent focus:border-[var(--custom-orange-600)] focus:ring-2 focus:ring-[var(--custom-orange-200)] focus:outline-none transition-all duration-300 shadow-sm hover:shadow-md"
                  placeholder={
                    localStorage.getItem("user_alt_mobile") ||
                    "Your emergency contact"
                  }
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      alt_mobile: e.target.value,
                    }))
                  }
                />
                <label
                  htmlFor="alt_mobile"
                  className="absolute left-5 top-4 text-[var(--custom-orange-500)] text-sm transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-lg peer-focus:top-[-1rem] peer-focus:text-sm peer-focus:text-[var(--custom-orange-700)] peer-valid:top-[-1rem] peer-valid:text-sm peer-valid:text-[var(--custom-orange-700)] bg-[var(--custom-orange-50)] md:bg-[var(--custom-white)] bg-opacity-90 px-2"
                >
                  Emergency Contact Number
                </label>
              </div>

              <div className="realtive flex items-center">
                <Fingerprint className="h-5 w-5 mr-2" />{" "}
                {/* make this a non-submitting button */}
                <button type="button" onClick={(e) => handleBiometricSetup(e)}>
                  Input for biometric
                </button>
              </div>

              {/* Buttons */}
              <div className="flex gap-6 pt-6">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-[var(--custom-orange-500)] to-[var(--custom-orange-600)] text-[var(--custom-white)] rounded-xl px-8 py-4  font-semibold hover:from-[var(--custom-orange-600)] hover:to-[var(--custom-orange-700)] hover:shadow-lg transition-all duration-300 shadow-md"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 bg-[var(--custom-white)] text-[var(--custom-orange-700)] rounded-xl px-8 py-4 font-semibold border border-[var(--custom-orange-300)] hover:bg-[var(--custom-orange-50)] hover:shadow-md transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModifyProfile;