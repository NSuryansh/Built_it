import React from "react";

const SessionExpired = ({ handleClosePopup }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-xl font-semibold text-red-600">Session Timeout</h2>
        <p className="mt-2">Your session has expired. Please log in again.</p>
        <button
          onClick={handleClosePopup}
          className="mt-4 cursor-pointer bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default SessionExpired;
