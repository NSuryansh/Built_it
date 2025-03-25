/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import "react-calendar/dist/Calendar.css";
import { useNavigate } from "react-router-dom";
import { checkAuth } from "../utils/profile";
import Navbar from "../components/Navbar";
import SessionExpired from "../components/SessionExpired";

const Book = () => {
  // const [date, setDate] = useState(new Date());
  // const [openCategory, setOpenCategory] = useState(null);

  // const contactCategories = [
  //   {
  //     title: "Faculty adviser",
  //     contacts: [
  //       {
  //         name: "Dr. Sarah Wilson",
  //         role: "Academic Advisor",
  //         phone: "(555) 123-4567",
  //       },
  //       {
  //         name: "Prof. James Miller",
  //         role: "Department Head",
  //         phone: "(555) 234-5678",
  //       },
  //     ],
  //   },
  //   {
  //     title: "Counsellor",
  //     contacts: [
  //       {
  //         name: "Emma Thompson",
  //         role: "Student Counselor",
  //         phone: "(555) 345-6789",
  //       },
  //       {
  //         name: "Dr. Michael Chen",
  //         role: "Mental Health Specialist",
  //         phone: "(555) 456-7890",
  //       },
  //     ],
  //   },
  //   {
  //     title: "Doctors",
  //     contacts: [
  //       {
  //         name: "Dr. Lisa Anderson",
  //         role: "General Physician",
  //         phone: "(555) 567-8901",
  //       },
  //       {
  //         name: "Dr. Robert Kim",
  //         role: "Psychiatrist",
  //         phone: "(555) 678-9012",
  //       },
  //     ],
  //   },
  // ];

  // const toggleCategory = (title) => {
  //   setOpenCategory(openCategory === title ? null : title);
  // };

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    date: "",
    contactType: "Doctors",
    selectedContact: null,
    timeSlot: "",
    name: "",
    email: "",
    phone: "",
    note: "",
  });

  // Mock availability data for contacts based on the selected date
  const availabilityData = {
    "2025-01-01": {
      Doctors: [
        {
          name: "Dr. John Smith",
          details: "Specialist in Mental Health",
          timing: "Available",
          timeSlots: ["10:00-10:30", "11:00-11:30", "14:00-14:30"],
        },
        {
          name: "Dr. Emily Johnson",
          details: "General Practitioner",
          timing: "Available",
          timeSlots: ["09:00-09:30", "13:00-13:30"],
        },
      ],
      Counselor: [
        {
          name: "Counselor Anna Lee",
          details: "Therapist",
          timing: "Available",
          timeSlots: ["10:30-11:00", "15:00-15:30"],
        },
      ],
      "Faculty advisor": [
        {
          name: "Prof. Robert Wilson",
          details: "Academic Advisor",
          timing: "Available",
          timeSlots: ["11:30-12:00", "16:00-16:30"],
        },
      ],
    },
    "2025-01-04": {
      Doctors: [
        {
          name: "Dr. Michael Brown",
          details: "Psychiatrist",
          timing: "Available",
          timeSlots: ["12:00-12:30", "15:30-16:00"],
        },
      ],
      Counselor: [
        {
          name: "Counselor David Kim",
          details: "Career Counselor",
          timing: "Available",
          timeSlots: ["09:30-10:00", "14:30-15:00"],
        },
        {
          name: "Counselor Sarah Davis",
          details: "Student Counselor",
          timing: "Available",
          timeSlots: ["11:00-11:30"],
        },
      ],
      "Faculty advisor": [],
    },
    // Add more dates as needed
  };

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleContactSelect = (contact, timeSlot) => {
    setFormData({ ...formData, selectedContact: contact, timeSlot });
    setStep(3); // Skip to Step 4 (renumbered as Step 3)
  };

  const handleDateSelect = (date) => {
    setFormData({ ...formData, date });
    handleNext();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Booking Confirmed!");
    console.log(formData);
    setStep(1);
  };

  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      const authStatus = await checkAuth("user");
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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {/*<div className="container mx-auto px-4 py-8">
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
      </div>*/}
      <div className="h-full flex justify-center items-center">
        <main className="main">
          {step === 1 && (
            <CalendarStep
              onNext={handleDateSelect}
              availabilityData={availabilityData}
            />
          )}
          {step === 2 && (
            <ContactSelectionStep
              onSelect={handleContactSelect}
              onBack={handleBack}
              selectedDate={formData.date}
              contactType={formData.contactType}
              setContactType={(type) =>
                setFormData({ ...formData, contactType: type })
              }
              availabilityData={availabilityData}
            />
          )}
          {step === 3 && (
            <BookingFormStep
              formData={formData}
              handleChange={handleChange}
              onSubmit={handleSubmit}
              onBack={handleBack}
            />
          )}
        </main>
      </div>
      );
    </div>
  );
};

export default Book;

const CalendarStep = ({ onNext, availabilityData }) => {
  const [selectedDate, setSelectedDate] = useState(null); // State to track selected date
  const [month, setMonth] = useState(0); // January (0-based index for Date object)
  const [year, setYear] = useState(2025); // Current year
  const [selectedPerson, setSelectedPerson] = useState(null); // State to track selected person
  const [selectedContactType, setSelectedContactType] = useState(null); // State to track selected contact type

  const doctors = ["Dr. John Smith", "Dr. Emily Johnson", "Dr. Michael Brown"];
  const counselors = [
    "Counselor Anna Lee",
    "Counselor David Kim",
    "Counselor Sarah Davis",
  ];
  const facultyAdvisors = [
    "Prof. Robert Wilson",
    "Prof. Linda Taylor",
    "Prof. James Clark",
  ];

  // Array of months for dropdown
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Array of years for dropdown (e.g., 2020 to 2030)
  const years = Array.from({ length: 11 }, (_, i) => 2020 + i);

  // Calculate the number of days in the selected month
  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get the first day of the month (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  // Generate the days for the calendar
  const daysInMonth = getDaysInMonth(month, year);
  const firstDay = getFirstDayOfMonth(month, year);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i); // Empty slots before the first day

  // Determine available dates for the selected person
  const getAvailableDates = () => {
    if (!selectedPerson || !selectedContactType) return [];
    const availableDates = [];
    Object.keys(availabilityData).forEach((date) => {
      const contacts = availabilityData[date][selectedContactType] || [];
      if (contacts.some((contact) => contact.name === selectedPerson)) {
        availableDates.push(date);
      }
    });
    return availableDates;
  };

  const availableDates = getAvailableDates();

  const handleDateClick = (day) => {
    const paddedDay = day < 10 ? `0${day}` : day;
    const paddedMonth = month + 1 < 10 ? `0${month + 1}` : month + 1;
    const date = `${year}-${paddedMonth}-${paddedDay}`;
    setSelectedDate(date);
    console.log("Selected Date:", date); // Debugging to confirm date selection
  };

  const handleNextClick = () => {
    if (selectedDate) {
      onNext(selectedDate);
    }
  };

  const handleMonthChange = (e) => {
    setMonth(months.indexOf(e.target.value));
    setSelectedDate(null); // Reset selected date when month changes
  };

  const handleYearChange = (e) => {
    setYear(parseInt(e.target.value));
    setSelectedDate(null); // Reset selected date when year changes
  };

  const handlePrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
    setSelectedDate(null); // Reset selected date
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
    setSelectedDate(null); // Reset selected date
  };

  const handlePersonSelect = (contactType, person) => {
    setSelectedContactType(contactType);
    setSelectedPerson(person || null);
  };

  return (
    <div className="bg-[var(--custom-orange-100)] w-full max-w-[1200px] p-[30px] rounded-[10px] border-[var(--custom-orange-200)] border-2">
      <div className="flex justify-between gap-[50px] mb-5">
        {/* Calendar Container */}
        <div className="flex-[4] bg-[var(--custom-white)] border-2 border-[var(--custom-orange-200)] p-5 rounded-[5px]">
          <div className="">
            <div className="flex justify-between items-center mb-[30px]">
              <select
                className="bg-[var(--custom-primary-orange)] text-[var(--custom-white)] font-bold p-[5px] rounded-[5px] border-2 border-solid border-[var(--custom-orange-900)]"
                value={months[month]}
                onChange={handleMonthChange}
              >
                {months.map((m, index) => (
                  <option key={index} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <select
                className="bg-[var(--custom-primary-orange)] text-[var(--custom-white)] font-bold p-[5px] rounded-[5px] border-2 border-solid border-[var(--custom-orange-900)]"
                value={year}
                onChange={handleYearChange}
              >
                {years.map((y, index) => (
                  <option key={index} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              <div>
                <button
                  className="text-lg cursor-pointer text-[var(--custom-orange-800)] border-none"
                  onClick={handlePrevMonth}
                >
                  {"<"}
                </button>
                <button
                  className="text-lg cursor-pointer text-[var(--custom-orange-800)] border-none"
                  onClick={handleNextMonth}
                >
                  {">"}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-[repeat(7,1fr)] gap-[5px] mb-2.5">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="text-center font-bold text-[var(--custom-orange-700)] text-[15px]"
                >
                  {day}
                </div>
              ))}
              {emptyDays.map((_, index) => (
                <div
                  key={`empty-${index}`}
                  className="bg-transparent p-2.5"
                ></div>
              ))}
              {days.map((day) => {
                const paddedDay = day < 10 ? `0${day}` : day;
                const paddedMonth =
                  month + 1 < 10 ? `0${month + 1}` : month + 1;
                const date = `${year}-${paddedMonth}-${paddedDay}`;
                const isAvailable = availableDates.includes(date);
                return (
                  <button
                    key={day}
                    className={`bg-[var(--custom-orange-100)] cursor-pointer text-sm text-[var(--custom-orange-800)] p-2.5 rounded-[5px] border-none ${
                      selectedDate === date
                        ? "bg-[var(--custom-orange-500)] text-[var(--custom-white)]"
                        : "hover:bg-[var(--custom-orange-300)]"
                    } ${isAvailable ? "bg-[#0c8227] text-[#155724]" : ""}`}
                    onClick={() => handleDateClick(day)}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Contact List Container with Dropdowns */}
        <div className="flex-1 bg-[var(--custom-white)] border-2 border-[var(--custom-orange-200)] p-5 rounded-[5px]">
          <div className="">
            <div className="bg-[var(--custom-orange-100)] flex justify-between items-center gap-5 mb-2.5 p-[15px] rounded-[5px]">
              <div className="text-[var(--custom-orange-800)] font-bold  flex-1">
                Doctors
              </div>
              <select
                className="border text-[var(--custom-white)] bg-[var(--custom-orange-500)] text-sm flex-[3] p-[5px] rounded-[5px] border-solid"
                onChange={(e) => handlePersonSelect("Doctors", e.target.value)}
              >
                <option value="">Select a Doctor</option>
                {doctors.map((doctor, index) => (
                  <option key={index} value={doctor}>
                    {doctor}
                  </option>
                ))}
              </select>
            </div>
            <div className="bg-[var(--custom-orange-100)] flex justify-between items-center gap-5 mb-2.5 p-[15px] rounded-[5px]">
              <div className="text-[var(--custom-orange-800)] font-bold flex-1">
                Counselor
              </div>
              <select
                className="border text-[var(--custom-white)] bg-[var(--custom-orange-500)] text-sm flex-[3] p-[5px] rounded-[5px] border-solid"
                onChange={(e) =>
                  handlePersonSelect("Counselor", e.target.value)
                }
              >
                <option value="">Select a Counselor</option>
                {counselors.map((counselor, index) => (
                  <option key={index} value={counselor}>
                    {counselor}
                  </option>
                ))}
              </select>
            </div>
            <div className="bg-[var(--custom-orange-100)] flex justify-between items-center gap-5 mb-2.5 p-[15px] rounded-[5px]">
              <div className="text-[var(--custom-orange-800)] font-bold flex-1">
                Faculty advisor
              </div>
              <select
                className="border text-[var(--custom-white)] bg-[var(--custom-orange-500)] text-sm flex-[3] p-[5px] rounded-[5px] border-solid"
                onChange={(e) =>
                  handlePersonSelect("Faculty advisor", e.target.value)
                }
              >
                <option value="">Select a Faculty Advisor</option>
                {facultyAdvisors.map((advisor, index) => (
                  <option key={index} value={advisor}>
                    {advisor}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <button
        className="bg-[var(--custom-orange-500)] font-bold disabled:bg-[#ccc] disabled:cursor-not-allowed text-[var(--custom-white)] cursor-pointer block text-lg mx-auto my-0 px-5 py-2.5 rounded-[20px] border-none"
        onClick={handleNextClick}
        disabled={!selectedDate}
      >
        Next
      </button>
    </div>
  );
};

// Step 2: Contact Selection with Availability and Time Slots
const ContactSelectionStep = ({
  onSelect,
  onBack,
  selectedDate,
  contactType,
  setContactType,
  availabilityData,
}) => {
  // Get available contacts for the selected date and contact type
  const availableContacts = availabilityData[selectedDate] || {
    Doctors: [],
    Counselor: [],
    "Faculty advisor": [],
  };
  const contacts = availableContacts[contactType] || [];

  // State to track selected time slots for each contact
  const [selectedTimeSlots, setSelectedTimeSlots] = useState({});

  const handleTimeSlotChange = (contactName, timeSlot) => {
    setSelectedTimeSlots({ ...selectedTimeSlots, [contactName]: timeSlot });
  };

  const handleBook = (contact) => {
    const timeSlot = selectedTimeSlots[contact.name];
    if (!timeSlot) {
      alert("Please select a time slot before booking.");
      return;
    }
    onSelect(contact, timeSlot);
  };

  return (
    <div className="bg-[var(--custom-orange-100)] w-full max-w-[1200px] p-[30px] rounded-[10px] border-[var(--custom-orange-200)] border-2">
      <h2 className="text-center font-bold text-[40px] text-[var(--custom-orange-500)] uppercase mb-[30px]">
        Available Contacts on {selectedDate}
      </h2>
      <div className="flex items-center gap-5 mb-5">
        <label className="text-xl font-bold text-[var(--custom-orange-800)]">
          List of Contacts:{" "}
        </label>
        <select
          value={contactType}
          onChange={(e) => setContactType(e.target.value)}
          className="bg-[var(--custom-white)] text-[var(--custom-orange-900)] p-[5px] rounded-[5px] border-2 border-solid border-[var(--custom-orange-900)]"
        >
          <option value="Doctors">Doctors</option>
          <option value="Counselor">Counselor</option>
          <option value="Faculty advisor">Faculty advisor</option>
        </select>
      </div>
      {contacts.length > 0 ? (
        contacts.map((contact, index) => (
          <div
            key={index}
            className="bg-[var(--custom-white)] border-2 border-[var(--custom-orange-200)] flex justify-between items-center gap-5 mb-2.5 p-[15px] rounded-[5px]"
          >
            <div className="text-[var(--custom-orange-800)] font-bold  flex-1">
              {contactType}
            </div>
            <div className="flex-[3] flex flex-col gap-2">
              <div className="text-sm text-[var(--custom-orange-900)]">
                {contact.name}
              </div>
              <div className="text-sm text-[var(--custom-orange-900)]">
                {contact.details}
              </div>
              <div className="text-sm text-[var(--custom-orange-900)]">
                {contact.timing}
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-2.5 items-end">
              <select
                className="time-slot"
                value={selectedTimeSlots[contact.name] || ""}
                onChange={(e) =>
                  handleTimeSlotChange(contact.name, e.target.value)
                }
              >
                <option value="">Select a time slot</option>
                {contact.timeSlots.map((slot, slotIndex) => (
                  <option key={slotIndex} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
              <button
                className="bg-[var(--custom-orange-500)] font-bold text-[var(--custom-white)] cursor-pointer w-20 px-[15px] py-[5px] rounded-[15px] border-none"
                onClick={() => handleBook(contact)}
              >
                Book
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-3xl font-semibold text-[var(--custom-orange-700)] mx-0 my-5">
          No {contactType} available on this date.
        </p>
      )}
      <button
        className="bg-[var(--custom-orange-900)] text-[var(--custom-white)] cursor-pointer block font-bold mt-5 mb-0 mx-auto px-5 py-2.5 rounded-[20px] border-none"
        onClick={onBack}
      >
        Back
      </button>
    </div>
  );
};

// Step 3 (previously Step 4): Booking Form
const BookingFormStep = ({ formData, handleChange, onSubmit, onBack }) => {
  return (
    <div className="bg-[var(--custom-orange-100)] border-2 border-[var(--custom-orange-200)] w-full max-w-[1200px] p-[30px] rounded-[10px]">
      <h2 className="text-center text-[40px] font-bold text-[var(--custom-orange-500)] uppercase mb-[30px]">
        ENTER THE DETAILS
      </h2>
      <div className="flex justify-between gap-[150px]">
        <form onSubmit={onSubmit} className="contents">
          <div className="flex-1 flex flex-col gap-[13px]">
            <label className="font-bold text-xl text-[var(--custom-orange-800)]">
              NAME
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className=" w-full box-border p-2.5 rounded-[5px] border-2 border-solid border-[var(--custom-orange-800)]"
              required
            />
            <label className="font-bold text-xl text-[var(--custom-orange-800)]">
              EMAIL
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className=" w-full box-border p-2.5 rounded-[5px] border-2 border-solid border-[var(--custom-orange-800)]"
              required
            />
            <label className="font-bold text-xl text-[var(--custom-orange-800)]">
              PHONE NO.
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full box-border p-2.5 rounded-[5px] border-2 border-solid border-[var(--custom-orange-800)]"
              required
            />
          </div>
          <div className="flex-1 flex flex-col gap-[15px]">
            <label className="font-bold text-xl text-[var(--custom-orange-800)]">
              In a brief note about your problem here
            </label>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              className="min-h-[150px] w-full box-border resize-none p-2.5 rounded-[5px] border-2 border-solid border-[var(--custom-orange-800)]"
            />
          </div>
        </form>
      </div>
      <button
        type="submit"
        className="bg-[var(--custom-orange-500)] text-[var(--custom-white)] cursor-pointer font-bold block mt-5 mb-0 mx-auto px-5 py-2.5 rounded-[20px] border-none"
        onClick={onSubmit}
      >
        Confirm booking
      </button>
      <button
        className="bg-[var(--custom-orange-900)] text-[var(--custom-white)] cursor-pointer block font-bold mt-5 mb-0 mx-auto px-5 py-2.5 rounded-[20px] border-none"
        onClick={onBack}
      >
        Back
      </button>
    </div>
  );
};
