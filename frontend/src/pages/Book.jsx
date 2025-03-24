import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { ChevronDown } from "lucide-react";
import "react-calendar/dist/Calendar.css";
import { useNavigate } from "react-router-dom";
import { checkAuth } from "../utils/profile";
import Navbar from "../components/Navbar";
import SessionExpired from "../components/SessionExpired";

const Book = () => {
  const [date, setDate] = useState(new Date());
  const [openCategory, setOpenCategory] = useState(null);

  const contactCategories = [
    {
      title: "Faculty adviser",
      contacts: [
        {
          name: "Dr. Sarah Wilson",
          role: "Academic Advisor",
          phone: "(555) 123-4567",
        },
        {
          name: "Prof. James Miller",
          role: "Department Head",
          phone: "(555) 234-5678",
        },
      ],
    },
    {
      title: "Counsellor",
      contacts: [
        {
          name: "Emma Thompson",
          role: "Student Counselor",
          phone: "(555) 345-6789",
        },
        {
          name: "Dr. Michael Chen",
          role: "Mental Health Specialist",
          phone: "(555) 456-7890",
        },
      ],
    },
    {
      title: "Doctors",
      contacts: [
        {
          name: "Dr. Lisa Anderson",
          role: "General Physician",
          phone: "(555) 567-8901",
        },
        {
          name: "Dr. Robert Kim",
          role: "Psychiatrist",
          phone: "(555) 678-9012",
        },
      ],
    },
  ];

  const toggleCategory = (title) => {
    setOpenCategory(openCategory === title ? null : title);
  };

  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      const authStatus = await checkAuth();
      setIsAuthenticated(authStatus);
    };
    verifyAuth();
  }, []);

  const handleClosePopup = () => {
    navigate("/login");
  };

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <SessionExpired handleClosePopup={handleClosePopup} />;
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-evenly">
          <div className="bg-[var(--custom-white)]/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
            <Calendar
              onChange={setDate}
              value={date}
              className="w-full max-w-[60vw] !border-none !rounded-lg !bg-transparent"
              tileClassName="!rounded-lg transition-colors"
              navigationLabel={({ date }) =>
                `${date.toLocaleString("default", {
                  month: "long",
                })} ${date.getFullYear()}`
              }
            />
            <div className="flex justify-end mt-6">
              <button className="cursor-pointer bg-[var(--calendar-custom-primary-orange)] text-[var(--custom-white)] px-6 py-2 rounded-full hover:bg-[var(--calendar-custom-button-bg-orange)] transition-colors">
                Next
              </button>
            </div>
          </div>

          <div className="w-80">
            <div className="bg-[var(--custom-white)]/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl">
              <h3 className="text-lg font-semibold mb-4 text-[var(--calendar-custom-gray-800)]">
                List of Contacts
              </h3>

              <div className="space-y-3">
                {contactCategories.map((category) => (
                  <div key={category.title} className="space-y-2">
                    <button
                      onClick={() => toggleCategory(category.title)}
                      className="w-full transition-all bg-[var(--calendar-custom-orange-50)] text-[var(--calendar-custom-primary-orange)] p-3 rounded-xl flex items-center justify-between hover:bg-[var(--calendar-custom-orange-100)] "
                    >
                      <span>{category.title}</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          openCategory === category.title ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {openCategory === category.title && (
                      <div className="bg-[var(--custom-white)]/90 rounded-xl p-4 space-y-3 ml-2">
                        {category.contacts.map((contact, index) => (
                          <div key={index} className="space-y-1">
                            <h4 className="font-medium text-[var(--calendar-custom-gray-800)]">
                              {contact.name}
                            </h4>
                            <p className="text-sm text-[var(--calendar-custom-gray-600)]">
                              {contact.role}
                            </p>
                            <p className="text-sm text-[var(--calendar-custom-gray-600)]">
                              {contact.phone}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Book;
