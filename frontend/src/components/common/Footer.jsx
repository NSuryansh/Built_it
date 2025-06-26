import { Instagram, Phone, Mail, MapPin } from "lucide-react";

const Footer = ({ color }) => {
  return (
    <footer className="bg-[var(--custom-white)] border-t border-[var(--custom-gray-200)]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col py-4 md:py-0 md:flex-row justify-between">
          <div className="w-full md:w-1/3">
            <h2
              className={`text-xl font-bold ${
                color === "orange"
                  ? "text-[var(--custom-orange-500)]"
                  : color === "green"
                  ? "text-[var(--custom-green-500)]"
                  : "text-[var(--custom-blue-500)]"
              }`}
            >
              IITI CalmConnect
            </h2>
            <p className="mt-2 text-sm text-[var(--custom-gray-500)]">
              A sanctuary for students at IIT Indore, promoting mental wellness,
              balance, and growth.
            </p>
          </div>

          <div className="space-y-4 w-full md:w-1/3 py-4 md:py-0">
            <h3 className="text-lg font-semibold text-[var(--custom-gray-900)]">
              Connect With Us
            </h3>
            <div className="space-y-2">
              <a
                href="https://www.instagram.com/manan_jiwnani_23/"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center space-x-2 text-sm text-[var(--custom-gray-500)] hover:${
                  color === "orange"
                    ? "text-[var(--custom-orange-500)]"
                    : color === "green"
                    ? "text-[var(--custom-green-500)]"
                    : "text-[var(--custom-blue-500)]"
                }`}
              >
                <Instagram size={18} />
                <span>@iiti.counselling</span>
              </a>
              <a
                href="https://www.instagram.com/suryansh.nagar.96/"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center space-x-2 text-sm text-[var(--custom-gray-500)] hover:${
                  color === "orange"
                    ? "text-[var(--custom-orange-500)]"
                    : color === "green"
                    ? "text-[var(--custom-green-500)]"
                    : "text-[var(--custom-blue-500)]"
                }`}
              >
                <Instagram size={18} />
                <span>@iiti.wellness</span>
              </a>
            </div>
          </div>

          <div className="space-y-4 py-4 md:py-0">
            <h3 className="text-lg font-semibold text-[var(--custom-gray-900)]">
              Contact Info
            </h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-[var(--custom-gray-500)]">
                <Phone size={18} />
                <span>+91 731-660-3555</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-[var(--custom-gray-500)]">
                <Mail size={18} />
                <a
                  href="mailto:counsellingcell@iiti.ac.in"
                  className={`hover:${
                    color === "orange"
                      ? "text-[var(--custom-orange-500)]"
                      : color === "green"
                      ? "text-[var(--custom-green-500)]"
                      : "text-[var(--custom-blue-500)]"
                  }`}
                >
                  counsellingcell@iiti.ac.in
                </a>
              </div>
              <div className="flex items-center space-x-2 text-sm text-[var(--custom-gray-500)]">
                <MapPin size={18} />
                <span>IIT Indore, Khandwa Road</span>
              </div>
            </div>
          </div>
        </div>

        <div className="md:mt-4 pt-2 border-t border-[var(--custom-gray-200)]">
          <p className="text-sm text-[var(--custom-gray-500)] text-center">
            © {new Date().getFullYear()} IIT Indore. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
