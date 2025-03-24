import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, UserPlus } from 'lucide-react';

const DoctorsList = () => {
  const doctors = [
    { id: 1, name: 'Dr. Sarah Wilson', specialty: 'Cardiologist', email: 'sarah.wilson@example.com' },
    { id: 2, name: 'Dr. Michael Chen', specialty: 'Neurologist', email: 'michael.chen@example.com' },
    { id: 3, name: 'Dr. Emily Brown', specialty: 'Pediatrician', email: 'emily.brown@example.com' },
    { id: 4, name: 'Dr. James Taylor', specialty: 'Orthopedist', email: 'james.taylor@example.com' },
    { id: 5, name: 'Dr. Lisa Anderson', specialty: 'Dermatologist', email: 'lisa.anderson@example.com' },
  ];

  const handleDelete = (id) => {
    // Handle doctor deletion
    console.log('Delete doctor with id:', id);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-orange-900">Doctors List</h1>
        <Link
          to="/doctors/add"
          className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
        >
          <UserPlus size={20} />
          Add New Doctor
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-orange-100">
            <tr>
              <th className="px-6 py-4 text-left text-orange-900">Name</th>
              <th className="px-6 py-4 text-left text-orange-900">Specialty</th>
              <th className="px-6 py-4 text-left text-orange-900">Email</th>
              <th className="px-6 py-4 text-left text-orange-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-orange-100">
            {doctors.map(doctor => (
              <tr key={doctor.id} className="hover:bg-orange-50">
                <td className="px-6 py-4">{doctor.name}</td>
                <td className="px-6 py-4">{doctor.specialty}</td>
                <td className="px-6 py-4">{doctor.email}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDelete(doctor.id)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                  >
                    <Trash2 size={20} />
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

export default DoctorsList;