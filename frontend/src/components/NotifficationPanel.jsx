import React, { useEffect, useRef } from "react";
import { Check } from "lucide-react";

const NotificationPanel = () => {
  return (
    <div className="absolute top-12 right-5 w-80 bg-white shadow-xl border rounded-lg p-4 z-50">
      <h2 className="text-sm font-semibold text-gray-800 mb-2">Notifications</h2>
      <div className="space-y-3 max-h-80 overflow-auto">
          <div
            className="flex justify-between items-center p-3 bg-gray-50 rounded-lg shadow-sm"
          >
            <div>
              <p className="text-sm text-gray-600">Do you want to text with</p>
              <p className="font-semibold text-gray-900">Username?</p>
            </div>
            <div className="flex gap-2">
              <button
                // onClick={() => onAccept(notif.id)}
                className="text-green-600 hover:bg-green-100 p-2 rounded-full transition"
              >
                <Check size={20} />
              </button>
            </div>
          </div>
          <div
            className="flex justify-between items-center p-3 bg-gray-50 rounded-lg shadow-sm"
          >
            <div>
              <p className="text-sm text-gray-600">Do you want to text with</p>
              <p className="font-semibold text-gray-900">Username?</p>
            </div>
            <div className="flex gap-2">
              <button
                // onClick={() => onAccept(notif.id)}
                className="text-green-600 hover:bg-green-100 p-2 rounded-full transition"
              >
                <Check size={20} />
              </button>
            </div>
          </div>
      </div>
    </div>
  );
};

export default NotificationPanel;
