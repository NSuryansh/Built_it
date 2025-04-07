import React, { useState, useMemo } from 'react';
import { Users, Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import AdminNavbar from "../../components/admin/admin_navbar";

// Mock data for demonstration
const usersData = [
  {
    id: 1,
    username: "Sarah Johnson",
    degree: "Bachelor of Psychology",
    appointmentsCount: 12,
    doctors: ["Dr. Michael Chen", "Dr. Emily Williams", "Dr. James Wilson"],
    lastAppointment: "2024-03-15"
  },
  {
    id: 2,
    username: "David Miller",
    degree: "Master of Arts",
    appointmentsCount: 8,
    doctors: ["Dr. Emily Williams", "Dr. James Wilson"],
    lastAppointment: "2024-03-10"
  },
  {
    id: 3,
    username: "Emma Thompson",
    degree: "Bachelor of Science",
    appointmentsCount: 15,
    doctors: ["Dr. Michael Chen", "Dr. James Wilson", "Dr. Lisa Brown"],
    lastAppointment: "2024-03-18"
  },
  {
    id: 4,
    username: "Michael Davis",
    degree: "PhD in Psychology",
    appointmentsCount: 6,
    doctors: ["Dr. Emily Williams"],
    lastAppointment: "2024-03-05"
  },
  {
    id: 5,
    username: "Sophie Wilson",
    degree: "Master of Psychology",
    appointmentsCount: 10,
    doctors: ["Dr. Michael Chen", "Dr. Lisa Brown"],
    lastAppointment: "2024-03-12"
  }
];

function User() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDegree, setFilterDegree] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'appointmentsCount', direction: 'desc' });

  // Get unique degrees for filter dropdown
  const degrees = useMemo(() => {
    return ['all', ...new Set(usersData.map(user => user.degree))];
  }, []);

  // Filter and sort users
  const filteredAndSortedUsers = useMemo(() => {
    return usersData
      .filter(user => {
        const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.doctors.some(doctor => doctor.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesDegree = filterDegree === 'all' || user.degree === filterDegree;
        return matchesSearch && matchesDegree;
      })
      .sort((a, b) => {
        if (sortConfig.key === 'appointmentsCount') {
          return sortConfig.direction === 'desc' 
            ? b.appointmentsCount - a.appointmentsCount
            : a.appointmentsCount - b.appointmentsCount;
        }
        return 0;
      });
  }, [searchTerm, filterDegree, sortConfig]);

  const handleSort = () => {
    setSortConfig(current => ({
      key: 'appointmentsCount',
      direction: current.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 font-poppins">
      < AdminNavbar />
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-indigo-600 px-6 py-8">
            <div className="flex items-center">
              <Users className="h-12 w-12 text-white" />
              <div className="ml-4">
                <h1 className="text-2xl font-semibold text-white">Users Overview</h1>
                <p className="text-indigo-100">Administrative Dashboard</p>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or doctor..."
                  className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-5 w-5 text-gray-500" />
                  <select
                    className="rounded-lg border border-gray-300 py-2 px-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={filterDegree}
                    onChange={(e) => setFilterDegree(e.target.value)}
                  >
                    {degrees.map((degree) => (
                      <option key={degree} value={degree}>
                        {degree === 'all' ? 'All Degrees' : degree}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Degree
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doctors
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={handleSort}
                  >
                    <div className="flex items-center gap-2">
                      Appointments
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Appointment
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.username}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.degree}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">
                        {user.doctors.join(", ")}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-indigo-600">
                        {user.appointmentsCount}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(user.lastAppointment).toLocaleDateString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default User;