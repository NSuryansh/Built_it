import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ModifyProfile = ({
  username,
  email,
  phoneNumber,
  altPhoneNumber,
  onSave,
}) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username,
    email,
    phoneNumber,
    altPhoneNumber,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const onCancel = (e) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
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
                value={formData.username}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, username: e.target.value }))
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
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                className="mt-1 block w-full rounded-md border border-[var(--custom-orange-200)] px-3 py-2 text-[var(--custom-orange-900)] placeholder-[var(--custom-orange-400)] focus:border-[var(--custom-orange-500)] focus:outline-none focus:ring-1 focus:ring-[var(--custom-orange-500)]"
              />
            </div>

            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-[var(--custom-orange-900)]"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    phoneNumber: e.target.value,
                  }))
                }
                className="mt-1 block w-full rounded-md border border-[var(--custom-orange-200)] px-3 py-2 text-[var(--custom-orange-900)] placeholder-[var(--custom-orange-400)] focus:border-[var(--custom-orange-500)] focus:outline-none focus:ring-1 focus:ring-[var(--custom-orange-500)]"
              />
            </div>

            <div>
              <label
                htmlFor="altPhoneNumber"
                className="block text-sm font-medium text-[var(--custom-orange-900)]"
              >
                Alternative Phone Number
              </label>
              <input
                type="tel"
                id="altPhoneNumber"
                value={formData.altPhoneNumber}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    altPhoneNumber: e.target.value,
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
  );
};

export default ModifyProfile;
