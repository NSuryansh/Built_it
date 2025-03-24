import React from 'react';
import { useNavigate } from 'react-router-dom';

const AddEvent = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted');
    navigate('/events');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-orange-900">Add New Event</h1>

      <div className="bg-white p-6 rounded-xl shadow-lg max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium text-orange-900">
              Event Title
            </label>
            <input
              type="text"
              id="title"
              className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="date" className="block text-sm font-medium text-orange-900">
              Date
            </label>
            <input
              type="date"
              id="date"
              className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="location" className="block text-sm font-medium text-orange-900">
              Location
            </label>
            <input
              type="text"
              id="location"
              className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="attendees" className="block text-sm font-medium text-orange-900">
              Expected Attendees
            </label>
            <input
              type="number"
              id="attendees"
              className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-orange-900">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            ></textarea>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Add Event
            </button>
            <button
              type="button"
              onClick={() => navigate('/events')}
              className="px-6 py-2 bg-orange-100 text-orange-900 rounded-lg hover:bg-orange-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEvent;