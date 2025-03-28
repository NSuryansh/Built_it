import React, { useState } from "react";
import { data, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const ModifyProfile = ({ username, email, mobile, alt_mobile }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username,
    email,
    mobile,
    alt_mobile,
  });

  const dataToSend = {
    id: localStorage.getItem("userid"), // Correctly assigning id
    ...formData, // Spreading formData properties
  };

  const onSave = async (dataToSend) => {
    try {
      console.log(dataToSend);
      const response = await fetch(
        "https://built-it-xjiq.onrender.com/modifyUser",
        {
          method: "PUT", // Use PUT to modify user details
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend),
        }
      );

      const result = await response.json();

      if (response.ok) {
        console.log("User details updated successfully!");
      } else {
        console.log(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(dataToSend);
  };

  const onCancel = (e) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-[var(--custom-orange-50)] to-[var(--custom-white)] py-12">
        <div className="max-w-md mx-auto bg-[var(--custom-white)] rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-[var(--custom-orange-900)]">
                Modify Profile
              </h2>
              <p className="mt-2 text-sm text-[var(--custom-orange-700)]">
                Update your profile information
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-[var(--custom-orange-900)]"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  placeholder={localStorage.getItem("username")}
                  value={formData.username}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      username: e.target.value,
                    }))
                  }
                  className="mt-1 block w-full rounded-md border border-[var(--custom-orange-200)] px-3 py-2 text-[var(--custom-orange-900)] placeholder-[var(--custom-orange-400)] focus:border-[var(--custom-orange-500 )]focus:outline-none focus:ring-1 focus:ring-[var(--custom-orange-500)]"
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
                  id="email"
                  placeholder={localStorage.getItem("user_email")}
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="mt-1 block w-full rounded-md border border-[var(--custom-orange-200)] px-3 py-2 text-[var(--custom-orange-900)] placeholder-[var(--custom-orange-400)] focus:border-[var(--custom-orange-500)] focus:outline-none focus:ring-1 focus:ring-[var(--custom-orange-500)]"
                />
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
                  placeholder={localStorage.getItem("user_mobile")}
                  value={formData.mobile}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      mobile: e.target.value,
                    }))
                  }
                  className="mt-1 block w-full rounded-md border border-[var(--custom-orange-200)] px-3 py-2 text-[var(--custom-orange-900)] placeholder-[var(--custom-orange-400)] focus:border-[var(--custom-orange-500)] focus:outline-none focus:ring-1 focus:ring-[var(--custom-orange-500)]"
                />
              </div>

              <div>
                <label
                  htmlFor="alt_mobile"
                  className="block text-sm font-medium text-[var(--custom-orange-900)]"
                >
                  Alternative Phone Number
                </label>
                <input
                  type="tel"
                  id="alt_mobile"
                  placeholder={localStorage.getItem("user_alt_mobile")}
                  value={formData.alt_mobile}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      alt_mobile: e.target.value,
                    }))
                  }
                  className="mt-1 block w-full rounded-md border border-[var(--custom-orange-200)] px-3 py-2 text-[var(--custom-orange-900)] placeholder-[var(--custom-orange-400)] focus:border-[var(--custom-orange-500)] focus:outline-none focus:ring-1 focus:ring-[var(--custom-orange-500)]"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-[var(--custom-orange-600)] text-[var(--custom-white)] rounded-lg px-4 py-2 text-sm font-medium hover:bg-[var(--custom-orange-500)] transition-colors"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 bg-[var(--custom-white)] text-[var(--custom-orange-700)] rounded-lg px-4 py-2 text-sm font-medium border border-[var(--custom-orange-200)] hover:bg-[var(--custom-orange-50)] transition-colors"
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
