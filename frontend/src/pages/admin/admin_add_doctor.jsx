import React from 'react';
import { useNavigate } from 'react-router-dom';

const AddDoctor = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted');
    navigate('/admin/doctor_list');
  };

  return (
    <div className="space-y-6 w-full bg-[var(--custom-primary-green-50)] mx-auto flex flex-col justify-center items-center h-screen">
      <h1 className="text-3xl font-bold text-[var(--custom-primary-green-900)]">Add New Doctor</h1>

      <div className="bg-white p-6 min-w-2xl rounded-xl shadow-lg max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-[var(--custom-primary-green-900)]">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full px-4 py-2 border border-[var(--custom-primary-green-200)] rounded-lg focus:ring-2 focus:ring-[var(--custom-primary-green-500)] focus:border-transparent"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="specialty" className="block text-sm font-medium text-[var(--custom-primary-green-900)]">
              Specialty
            </label>
            <input
              type="text"
              id="specialty"
              className="w-full px-4 py-2 border border-[var(--custom-primary-green-200)] rounded-lg focus:ring-2 focus:ring-[var(--custom-primary-green-500)] focus:border-transparent"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-[var(--custom-primary-green-900)]">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border border-[var(--custom-primary-green-200)] rounded-lg focus:ring-2 focus:ring-[var(--custom-primary-green-500)] focus:border-transparent"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm font-medium text-[var(--custom-primary-green-900)]">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              className="w-full px-4 py-2 border border-[var(--custom-primary-green-200)] rounded-lg focus:ring-2 focus:ring-[var(--custom-primary-green-500)] focus:border-transparent"
              required
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="px-6 py-2 bg-[var(--custom-primary-green-600)] text-white rounded-lg hover:bg-[var(--custom-primary-green-700)] transition-colors"
            >
              Add Doctor
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/doctor_list')}
              className="px-6 py-2 bg-[var(--custom-primary-green-100)] text-[var(--custom-primary-green-900)] rounded-lg hover:bg-[var(--custom-primary-green-200)] transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDoctor;