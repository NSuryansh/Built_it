import React, { useState } from "react";
import { Bell, User } from "lucide-react";
import { useLocation } from "react-router-dom";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";

const Navbar = () => {
  const location = useLocation().pathname;
  const [showDetails, setShowDetails] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: "Home", link: "/dashboard" },
    { name: "Mood", link: "/mood" },
    { name: "Peer", link: "/peer" },
    { name: "Book", link: "/book" },
    { name: "Stress", link: "/stress" },
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-transperent">
      <div className="px-8 py-3">
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold">CalmNest</div>
          <div className="hidden md:flex space-x-8 items-center">
            {links.map((item, i) => (
              <a
                key={i}
                href={item.link}
                className={`hover:text-[var(--custom-primary-orange)] focus:text-[var(--custom-primary-orange)] transition-colors ${
                  location == item.link
                    ? "underline underline-offset-4 text-[var(--landing-bg-orange)] decoration-2"
                    : ""
                }`}
              >
                {item.name}
              </a>
            ))}
          </div>
          <div className="md:hidden transition-all flex items-center z-2">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              {isOpen ? (
                <AiOutlineClose size={24} />
              ) : (
                <AiOutlineMenu size={24} />
              )}
            </button>
            {isOpen && (
              <div className="absolute top-16 left-[12%] w-[80%] bg-white rounded-2xl shadow-md p-4">
                <ul>
                  {links.map((item, i) => (
                    <li className="py-2 border-b text-center border-gray-200" key={i}>
                      <a
                        href={item.link}
                        className={`hover:text-[var(--custom-primary-orange)] focus:text-[var(--custom-primary-orange)] transition-colors ${
                          location == item.link
                            ? "underline underline-offset-4 text-[var(--landing-bg-orange)] decoration-2"
                            : ""
                        }`}
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <button className="cursor-pointer">
              <Bell className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                setShowDetails(!showDetails);
              }}
              className="cursor-pointer relative"
            >
              <User className="w-5 h-5" />
            </button>

            <div
              className={`user-details drop-shadow-xs absolute top-12 right-5 list-none bg-orange-200 rounded-md py-1 z-1 ${
                showDetails ? "opacity-100 visible" : "opacity-0 invisible"
              }`}
            >
              <ol>
                <li className="p-3 text-right ">User Name</li>
                <li className="p-3 text-right ">Email ID</li>
                <li className="p-3 text-right ">Phone Number</li>
                <li className="p-3 text-right ">Alt Phone Number</li>
                <a href="/appointments">
                  <li className="p-3 text-right cursor-pointer">
                    Appointments
                  </li>
                </a>
              </ol>
              <button className="p-2 m-3 text-right cursor-pointer bg-orange-300 rounded-md">
                Modify
              </button>

              <button className="p-2 m-3 text-right cursor-pointer bg-orange-300 rounded-md">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
    // <nav className="flex justify-between items-center py-4">
    //   <div className="text-lg font-bold">Logo</div>
    //   <div className="hidden md:flex md:items-center">
    //     <ul className="flex items-center space-x-4">
    //       <li>
    //         <a href="#" className="hover:text-blue-500">
    //           Home
    //         </a>
    //       </li>
    //       <li>
    //         <a href="#" className="hover:text-blue-500">
    //           About
    //         </a>
    //       </li>
    //       <li>
    //         <a href="#" className="hover:text-blue-500">
    //           Contact
    //         </a>
    //       </li>
    //     </ul>
    //   </div>
    //   <div className="md:hidden flex items-center">
    //     <button onClick={toggleMenu} className="p-2 rounded-full hover:bg-gray-100">
    //       {isOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
    //     </button>
    //     {isOpen && (
    //       <div className="absolute top-16 left-0 w-full bg-white shadow-md p-4">
    //         <ul>
    //           <li className="py-2 border-b border-gray-200">
    //             <a href="#" className="hover:text-blue-500">
    //               Home
    //             </a>
    //           </li>
    //           <li className="py-2 border-b border-gray-200">
    //             <a href="#" className="hover:text-blue-500">
    //               About
    //             </a>
    //           </li>
    //           <li className="py-2">
    //             <a href="#" className="hover:text-blue-500">
    //               Contact
    //             </a>
    //           </li>
    //         </ul>
    //       </div>
    //     )}
    //   </div>
    // </nav>
  );
};

export default Navbar;
