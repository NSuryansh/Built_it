import React, { useEffect, useState } from "react";
import {
  Stethoscope,
  Calendar,
  ArrowLeft,
  Clock,
  Search,
  UserCircle,
} from "lucide-react";

const DoctorBook = ({ onBookAppointment }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("http://localhost:3000", {
        headers: { Authorization: "Bearer " + token },
      });
    };

    fetchUsers();
  }, []);

  const MOCK_USERS = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      phone: "+1 234-567-8900",
      lastVisit: "2024-02-15",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+1 234-567-8901",
      lastVisit: "2024-03-01",
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike@example.com",
      phone: "+1 234-567-8902",
      lastVisit: "2024-03-10",
    },
    {
      id: 4,
      name: "Sarah Williams",
      email: "sarah@example.com",
      phone: "+1 234-567-8903",
      lastVisit: "2024-03-18",
    },
  ];
  const filteredUsers = MOCK_USERS.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm)
  );

  return (
    <div className="bg-[var(--custom-white)] rounded-lg shadow-lg p-6 w-screen h-screen">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <UserCircle className="w-6 h-6 text-[var(--custom-blue-600)]" />
          <h2 className="text-2xl font-semibold text-[var(--custom-gray-800)]">
            Patients
          </h2>
        </div>
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--custom-gray-400)]" />
          <input
            type="text"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-[var(--custom-gray-300)] rounded-lg focus:ring-2 focus:ring-[var(--custom-blue-500)] focus:border-[var(--custom-blue-500)]"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[var(--custom-gray-200)]">
          <thead className="bg-[var(--custom-gray-50)]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--custom-gray-500)] uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--custom-gray-500)] uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--custom-gray-500)] uppercase tracking-wider">
                Last Visit
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-[var(--custom-gray-500)] uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-[var(--custom-white)] divide-y divide-[var(--custom-gray-200)]">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-[var(--custom-gray-50)]">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-[var(--custom-gray-900)]">
                    {user.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-[var(--custom-gray-900)]">
                    {user.email}
                  </div>
                  <div className="text-sm text-[var(--custom-gray-500)]">
                    {user.phone}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-[var(--custom-gray-900)]">
                    {user.lastVisit}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    onClick={() => onBookAppointment(user)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-[var(--custom-white)] bg-[var(--custom-blue-600)] hover:bg-[var(--custom-blue-700)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--custom-blue-500)]"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Appointment
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

function AppointmentForm({ user, onBack }) {
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    reason: "",
    duration: "30",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", { ...formData, user });
    onBack();
  };

  return (
    <div className="bg-[var(--custom-white)] rounded-lg shadow-lg p-6 w-full max-w-2xl">
      <button
        onClick={onBack}
        className="mb-4 text-[var(--custom-blue-600)] hover:text-[var(--custom-blue-700)] flex items-center gap-2"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Patients
      </button>

      <div className="flex items-center gap-2 mb-6">
        <Stethoscope className="w-6 h-6 text-[var(--custom-blue-600)]" />
        <h2 className="text-2xl font-semibold text-[var(--custom-gray-800)]">
          New Appointment
        </h2>
      </div>

      <div className="mb-6 p-4 bg-[var(--custom-blue-50)] rounded-lg">
        <h3 className="font-medium text-[var(--custom-gray-900)]">
          Patient Information
        </h3>
        <p className="text-sm text-[var(--custom-gray-600)]">{user.name}</p>
        <p className="text-sm text-[var(--custom-gray-600)]">{user.email}</p>
        <p className="text-sm text-[var(--custom-gray-600)]">{user.phone}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--custom-gray-700)]">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-[var(--custom-gray-300)] shadow-sm focus:border-[var(--custom-blue-500)] focus:ring-[var(--custom-blue-500)]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--custom-gray-700)]">
              Time
            </label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) =>
                setFormData({ ...formData, time: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-[var(--custom-gray-300)] shadow-sm focus:border-[var(--custom-blue-500)] focus:ring-[var(--custom-blue-500)]"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--custom-gray-700)]">
            Duration
          </label>
          <select
            value={formData.duration}
            onChange={(e) =>
              setFormData({ ...formData, duration: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-[var(--custom-gray-300)] shadow-sm focus:border-[var(--custom-blue-500)] focus:ring-[var(--custom-blue-500)]"
          >
            <option value="30">30 minutes</option>
            <option value="45">45 minutes</option>
            <option value="60">1 hour</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--custom-gray-700)]">
            Reason for Visit
          </label>
          <textarea
            value={formData.reason}
            onChange={(e) =>
              setFormData({ ...formData, reason: e.target.value })
            }
            rows={3}
            className="mt-1 block w-full rounded-md border-[var(--custom-gray-300)] shadow-sm focus:border-[var(--custom-blue-500)] focus:ring-[var(--custom-blue-500)]"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[var(--custom-blue-600)] text-[var(--custom-white)] py-2 px-4 rounded-lg hover:bg-[var(--custom-blue-700)] transition-colors flex items-center justify-center gap-2"
        >
          <Clock className="w-5 h-5" />
          Schedule Appointment
        </button>
      </form>
    </div>
  );
}

function App() {
  const [selectedUser, setSelectedUser] = useState(null);

  const handleBookAppointment = (user) => {
    setSelectedUser(user);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--custom-blue-50)] to-[var(--custom-blue-100)] flex items-center justify-center p-4">
      {!selectedUser ? (
        <UserTable onBookAppointment={handleBookAppointment} />
      ) : (
        <AppointmentForm
          user={selectedUser}
          onBack={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
}

export default DoctorBook;
