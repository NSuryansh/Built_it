import React from "react";

const Footer = ({ color }) => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h2
              className={`text-xl font-bold ${
                color === "orange"
                  ? "text-[var(--custom-primary-orange)]"
                  : color === "green"
                  ? "text-[var(--custom-primary-green)]"
                  : "text-[var(--custom-primary-blue)]"
              }`}
            >
              Vitality
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Your safe space at IIT Indore, where mental wellness comes first.
              Find balance, seek support, and grow stronger. Connect, unwind,
              and nurture your mind. Because a healthy mind builds a brighter
              future.
            </p>
          </div>
          <div className="md:col-span-2 flex items-end justify-end">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} IIT Indore. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
