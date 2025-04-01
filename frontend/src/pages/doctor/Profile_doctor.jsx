import React, { useState, useEffect } from "react";
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
  Calendar,
  Plus,
} from "lucide-react";
import DoctorNavbar from "../../components/doctor/Navbar_doctor";
import Footer from "../../components/Footer";

import PacmanLoader from "react-spinners/PacmanLoader";
import { checkAuth } from "../../utils/profile";
import { useNavigate } from "react-router-dom";
import SessionExpired from "../../components/SessionExpired";

const DoctorProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "<Please change>",
    email: "<Please change>",
    phone: "<Please change>",
    address: "<Please change>",
    city: "<Please change>",
    specialization: "<Please change>",
    experience: "<Please change>",
    education: ["<Please change>", "<Please change>", "<Please change>"],
    availability: ["<Please add>"],
    certifications: ["<Please change>", "<Please change>", "<Please change>"],
  });
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [editedProfile, setEditedProfile] = useState(profile);

  useEffect(() => {
    const verifyAuth = async () => {
      const authStatus = await checkAuth("doc");
      setIsAuthenticated(authStatus);
    };
    verifyAuth();
  }, []);

  useEffect(() => {
    const username = localStorage.getItem("username");
    const email = localStorage.getItem("user_email");
    const phone = localStorage.getItem("user_mobile");
    const desc = localStorage.getItem("desc");
    const experience = localStorage.getItem("experience");
    const address = localStorage.getItem("address");
    const city = localStorage.getItem("city");
    const certification = localStorage.getItem("certification").split(",");
    const education = localStorage.getItem("education").split(",");
    const availability = localStorage.getItem("slot").split(",");
    console.log(localStorage.getItem("slot"));
    setProfile({
      ...profile,
      name: username,
      email: email,
      phone: phone,
      specialization: desc,
      experience: experience,
      address: address,
      city: city,
      certifications: certification,
      education: education,
      availability: availability,
    });
    setEditedProfile({
      ...profile,
      name: username,
      email: email,
      phone: phone,
      specialization: desc,
      experience: experience,
      address: address,
      city: city,
      certifications: certification,
      education: education,
      availability: availability,
    });
    console.log(profile);
  }, []);

  const handleAddSlot = () => {
    setEditedProfile({
      ...editedProfile,
      availability: [...editedProfile.availability, ""],
    });
  };

  const handleClosePopup = () => {
    navigate("/doctor/login");
  };

  if (isAuthenticated === null) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <PacmanLoader color="#004ba8" radius={6} height={20} width={5} />
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <SessionExpired handleClosePopup={handleClosePopup} />;
  }

  const handleSave = () => {
    localStorage.setItem("experience", editedProfile.experience);
    localStorage.setItem("address", editedProfile.address);
    localStorage.setItem("city", editedProfile.city);
    localStorage.setItem("certification", editedProfile.certifications);
    localStorage.setItem("education", editedProfile.education);
    localStorage.setItem("slot", editedProfile.availability);
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
                    disabled
                    value={editedProfile.name}
                    onChange={(e) =>
                      setEditedProfile({
                        ...editedProfile,
                        name: e.target.value,
                      })
                    }
                    className="text-2xl cursor-not-allowed font-bold text-gray-900 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2"
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
                          disabled
                          value={editedProfile.email}
                          onChange={(e) =>
                            setEditedProfile({
                              ...editedProfile,
                              email: e.target.value,
                            })
                          }
                          className="flex-1 cursor-not-allowed bg-gray-50 border border-gray-300 rounded-lg px-3 py-2"
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
                          disabled
                          value={editedProfile.phone}
                          onChange={(e) =>
                            setEditedProfile({
                              ...editedProfile,
                              phone: e.target.value,
                            })
                          }
                          className="flex-1 cursor-not-allowed bg-gray-50 border border-gray-300 rounded-lg px-3 py-2"
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
                          disabled
                          value={editedProfile.specialization}
                          onChange={(e) =>
                            setEditedProfile({
                              ...editedProfile,
                              specialization: e.target.value,
                            })
                          }
                          className="flex-1 cursor-not-allowed bg-gray-50 border border-gray-300 rounded-lg px-3 py-2"
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
              <div className="space-y-4">
                {isEditing ? (
                  <div className="space-y-2">
                    {editedProfile.availability.map((slot, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Clock className="h-5 w-5 text-gray-400" />
                        <input
                          type="time"
                          value={slot}
                          onChange={(e) => {
                            const newAvailability = [
                              ...editedProfile.availability,
                            ];
                            newAvailability[index] = e.target.value;
                            setEditedProfile({
                              ...editedProfile,
                              availability: newAvailability,
                            });
                          }}
                          className="bg-gray-50 border border-gray-300 rounded-lg px-2 py-1 text-sm"
                        />
                        {index === editedProfile.availability.length - 1 && (
                          <button
                            onClick={handleAddSlot}
                            className="inline-flex items-center px-2 py-1 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Slot
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : profile.availability.length !== 0 ? (
                  <div className="">
                    <div className="flex flex-wrap gap-2">
                      {profile.availability.map((slot, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 bg-white rounded-full text-sm text-gray-600 border border-blue-100"
                        >
                          <Clock className="h-4 w-4 text-blue-500 mr-2" />
                          {slot}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (<div className="text-gray-400">No slots added</div>)}
              </div>
            </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer color={"blue"} />
    </div>
  );
};

export default DoctorProfile;
