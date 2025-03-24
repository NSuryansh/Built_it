import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  GraduationCap,
  Clock,
  Award,
  Edit2,
  Save,
  X,
} from "lucide-react";
import DoctorNavbar from "../../components/doctor/Navbar_doctor";

const DoctorProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Dr. Sarah Wilson",
    email: "dr.wilson@medcare.com",
    phone: "+1 (555) 123-4567",
    address: "123 Medical Center Drive, Suite 200",
    city: "San Francisco, CA 94105",
    specialization: "General Medicine",
    experience: "15 years",
    education: [
      "MD - Stanford University School of Medicine",
      "Residency - UCSF Medical Center",
      "Board Certified in Internal Medicine",
    ],
    availability: {
      monday: "9:00 AM - 5:00 PM",
      tuesday: "9:00 AM - 5:00 PM",
      wednesday: "9:00 AM - 5:00 PM",
      thursday: "9:00 AM - 5:00 PM",
      friday: "9:00 AM - 3:00 PM",
    },
    certifications: [
      "American Board of Internal Medicine",
      "Advanced Cardiac Life Support",
      "Basic Life Support",
    ],
  });

  const [editedProfile, setEditedProfile] = useState(profile);

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };
  return (
    <div>
      <DoctorNavbar />
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Doctor Profile</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your professional information
            </p>
          </div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Profile
            </button>
          ) : (
            <div className="flex space-x-3">
              <button
                onClick={handleSave}
                className="flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex items-center space-x-6 mb-8">
              <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="h-12 w-12 text-blue-600" />
              </div>
              <div>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.name}
                    onChange={(e) =>
                      setEditedProfile({
                        ...editedProfile,
                        name: e.target.value,
                      })
                    }
                    className="text-2xl font-bold text-gray-900 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2"
                  />
                ) : (
                  <h2 className="text-2xl font-bold text-gray-900">
                    {profile.name}
                  </h2>
                )}
                <p className="text-lg text-gray-600">
                  {profile.specialization}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Contact Information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-gray-400 mr-3" />
                      {isEditing ? (
                        <input
                          type="email"
                          value={editedProfile.email}
                          onChange={(e) =>
                            setEditedProfile({
                              ...editedProfile,
                              email: e.target.value,
                            })
                          }
                          className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2"
                        />
                      ) : (
                        <span className="text-gray-600">{profile.email}</span>
                      )}
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-gray-400 mr-3" />
                      {isEditing ? (
                        <input
                          type="tel"
                          value={editedProfile.phone}
                          onChange={(e) =>
                            setEditedProfile({
                              ...editedProfile,
                              phone: e.target.value,
                            })
                          }
                          className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2"
                        />
                      ) : (
                        <span className="text-gray-600">{profile.phone}</span>
                      )}
                    </div>
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                      {isEditing ? (
                        <div className="flex-1 space-y-2">
                          <input
                            type="text"
                            value={editedProfile.address}
                            onChange={(e) =>
                              setEditedProfile({
                                ...editedProfile,
                                address: e.target.value,
                              })
                            }
                            className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2"
                            placeholder="Street Address"
                          />
                          <input
                            type="text"
                            value={editedProfile.city}
                            onChange={(e) =>
                              setEditedProfile({
                                ...editedProfile,
                                city: e.target.value,
                              })
                            }
                            className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2"
                            placeholder="City, State ZIP"
                          />
                        </div>
                      ) : (
                        <div>
                          <p className="text-gray-600">{profile.address}</p>
                          <p className="text-gray-600">{profile.city}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Education
                  </h3>
                  <div className="space-y-3">
                    {profile.education.map((edu, index) => (
                      <div key={index} className="flex items-start">
                        <GraduationCap className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                        {isEditing ? (
                          <input
                            type="text"
                            value={editedProfile.education[index]}
                            onChange={(e) => {
                              const newEducation = [...editedProfile.education];
                              newEducation[index] = e.target.value;
                              setEditedProfile({
                                ...editedProfile,
                                education: newEducation,
                              });
                            }}
                            className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2"
                          />
                        ) : (
                          <span className="text-gray-600">{edu}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Professional Information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Building className="h-5 w-5 text-gray-400 mr-3" />
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedProfile.specialization}
                          onChange={(e) =>
                            setEditedProfile({
                              ...editedProfile,
                              specialization: e.target.value,
                            })
                          }
                          className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2"
                        />
                      ) : (
                        <span className="text-gray-600">
                          {profile.specialization}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-gray-400 mr-3" />
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedProfile.experience}
                          onChange={(e) =>
                            setEditedProfile({
                              ...editedProfile,
                              experience: e.target.value,
                            })
                          }
                          className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2"
                        />
                      ) : (
                        <span className="text-gray-600">
                          {profile.experience} of Experience
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Certifications
                  </h3>
                  <div className="space-y-3">
                    {profile.certifications.map((cert, index) => (
                      <div key={index} className="flex items-start">
                        <Award className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                        {isEditing ? (
                          <input
                            type="text"
                            value={editedProfile.certifications[index]}
                            onChange={(e) => {
                              const newCertifications = [
                                ...editedProfile.certifications,
                              ];
                              newCertifications[index] = e.target.value;
                              setEditedProfile({
                                ...editedProfile,
                                certifications: newCertifications,
                              });
                            }}
                            className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2"
                          />
                        ) : (
                          <span className="text-gray-600">{cert}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Availability
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(profile.availability).map(
                      ([day, hours]) => (
                        <div
                          key={day}
                          className="flex items-center justify-between"
                        >
                          <span className="text-gray-600 capitalize">
                            {day}
                          </span>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editedProfile.availability[day]}
                              onChange={(e) =>
                                setEditedProfile({
                                  ...editedProfile,
                                  availability: {
                                    ...editedProfile.availability,
                                    [day]: e.target.value,
                                  },
                                })
                              }
                              className="w-48 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2"
                            />
                          ) : (
                            <span className="text-gray-600">{hours}</span>
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
