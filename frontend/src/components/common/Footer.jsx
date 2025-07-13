import { Instagram, Phone, Mail, MapPin } from "lucide-react";

const Footer = ({ color }) => {
  return (
    <footer className="bg-[var(--custom-white)] border-t border-[var(--custom-gray-200)]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 py-4 md:py-0 md:grid-cols-2">
          <div className="w-full flex flex-col items-center">
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

          <div className="space-y-4 flex flex-col items-center py-4 md:py-0">
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
