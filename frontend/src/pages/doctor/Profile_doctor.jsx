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
  Plus,
} from "lucide-react";
import DoctorNavbar from "../../components/doctor/Navbar_doctor";
import Footer from "../../components/Footer";
import { format } from "date-fns";
import PacmanLoader from "react-spinners/PacmanLoader";
import { checkAuth } from "../../utils/profile";
import { useNavigate } from "react-router-dom";
import SessionExpired from "../../components/SessionExpired";
import { TimeChange } from "../../components/Time_Change";
import CustomToast from "../../components/CustomToast";
import { ToastContainer } from "react-toastify";

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
    education: ["<Add>"],
    availability: ["<Add>"],
    certifications: ["<Add>"],
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
    const date = format(new Date(), "yyyy-MM-dd");
    const fetchData = async (date) => {
      try {
        const doctorId = localStorage.getItem("userid");
        const response = await fetch(
          `http://localhost:3000/getDoc?docId=${doctorId}`
        );
        const response2 = await fetch(
          `http://localhost:3000/available-slots?date=${date}&docId=${doctorId}`
        );
        const data = await response.json();
        const data2 = await response2.json();
        const slots = [];
        data2.availableSlots.map((slot) => {
          slots.push(
            format(TimeChange(new Date(slot.starting_time).getTime()), "H:mm")
          );
        });
        let certifications = [];
        data.certifications.map((certification) => {
          certifications.push(certification.certification);
        });
        if (certifications.length === 0) {
          certifications = ["<Add>"];
        }
        let educations = [];
        data.education.map((education) => {
          educations.push(education.education);
        });
        if (educations.length === 0) {
          educations = ["<Add>"];
        }
        setProfile({
          name: data.doctor.name,
          email: data.doctor.email,
          phone: data.doctor.mobile,
          specialization: data.doctor.desc,
          experience: data.doctor.experience,
          address: data.doctor.address,
          city: data.doctor.city,
          certifications: certifications,
          education: educations,
          availability: slots,
        });
        setEditedProfile({
          name: data.doctor.name,
          email: data.doctor.email,
          phone: data.doctor.mobile,
          specialization: data.doctor.desc,
          experience: data.doctor.experience,
          address: data.doctor.address,
          city: data.doctor.city,
          certifications: certifications,
          education: educations,
          availability: slots,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        CustomToast("Error fetching data");
      }
    };
    fetchData(date);
  }, []);

  const handleAddSlot = () => {
    setEditedProfile({
      ...editedProfile,
      availability: [...editedProfile.availability, ""],
    });
  };

  const handleAddEducation = () => {
    setEditedProfile({
      ...editedProfile,
      education: [...editedProfile.education, ""],
    });
  };

  const handleAddCertification = () => {
    setEditedProfile({
      ...editedProfile,
      certifications: [...editedProfile.certifications, ""],
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

  const handleSave = async () => {
    try {
      const doctorId = localStorage.getItem("userid");
      console.log(doctorId);
      const response = await fetch(
        `http://localhost:3000/modifyDoc?id=${doctorId}&address=${editedProfile.address}&city=${editedProfile.city}&experience=${editedProfile.experience}&educ=${editedProfile.education}&certifi=${editedProfile.certifications}`,
        {
          method: "PUT",
        }
      );
      const data = response.json();
      console.log(data);
      CustomToast("Profile updated successfully");
    } catch (e) {
      console.log(e);
      CustomToast("Error updating profile");
    }
    setProfile(editedProfile);
    setIsEditing(false);
    console.log(editedProfile);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  return (
    <div>
      <DoctorNavbar />
      <ToastContainer />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              Doctor Profile
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your professional information
            </p>
          </div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow transition"
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Profile
            </button>
          ) : (
            <div className="flex space-x-3">
              <button
                onClick={handleSave}
                className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl shadow transition"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-xl shadow transition"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Profile Card */}
        <div
          className={`bg-white rounded-2xl shadow-lg p-6 transition-all ${
            isEditing ? "border-2 border-blue-100" : ""
          }`}
        >
          <div className="flex items-center space-x-6 mb-8">
            <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center shadow-inner">
              <User className="h-12 w-12 text-blue-600" />
            </div>
            <div>
              {isEditing ? (
                <input
                  type="text"
                  disabled
                  value={editedProfile.name}
                  onChange={(e) =>
                    setEditedProfile({ ...editedProfile, name: e.target.value })
                  }
                  className="text-2xl font-bold text-gray-900 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 cursor-not-allowed"
                />
              ) : (
                <h2 className="text-2xl font-bold text-gray-900">
                  {profile.name}
                </h2>
              )}
              <p className="text-lg text-gray-500">{profile.specialization}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm space-y-4">
              <div className="flex items-center text-blue-600 font-semibold text-lg">
                <Mail className="h-5 w-5 mr-2" />
                Contact Information
              </div>
              <div className="space-y-3">
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
                      className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 cursor-not-allowed"
                    />
                  ) : (
                    <span className="text-gray-700">{profile.email}</span>
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
                      className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 cursor-not-allowed"
                    />
                  ) : (
                    <span className="text-gray-700">{profile.phone}</span>
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
                        className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2"
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
                        className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2"
                        placeholder="City, State ZIP"
                      />
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-700">{profile.address}</p>
                      <p className="text-gray-700">{profile.city}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Professional Info */}
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm space-y-6">
              <div>
                <div className="flex items-center text-blue-600 font-semibold text-lg mb-2">
                  <Building className="h-5 w-5 mr-2" />
                  Professional Information
                </div>
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
                        className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 cursor-not-allowed"
                      />
                    ) : (
                      <span className="text-gray-700">
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
                        className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2"
                      />
                    ) : (
                      <span className="text-gray-700">
                        {profile.experience} of Experience
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Availability */}
              <div>
                <div className="flex items-center text-blue-600 font-semibold text-lg mb-2">
                  <Clock className="h-5 w-5 mr-2" />
                  Availability
                </div>
                <div className="space-y-3">
                  {isEditing ? (
                    <div className="space-y-2">
                      {editedProfile.availability.map((slot, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="time"
                            value={slot}
                            onChange={(e) => {
                              const newAvailability = [
                                ...editedProfile.availability,
                              ];
                              newAvailability[index] = e.target.value;
                              console.log(typeof newAvailability[index]);
                              setEditedProfile({
                                ...editedProfile,
                                availability: newAvailability,
                              });
                            }}
                            className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm w-40"
                          />
                          {index === editedProfile.availability.length - 1 && (
                            <button
                              onClick={handleAddSlot}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              <Plus className="h-4 w-4 mr-1 inline" /> Add Slot
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : profile.availability.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {profile.availability.map((slot, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 bg-white rounded-full text-sm text-gray-700 border border-blue-100 shadow-sm"
                        >
                          <Clock className="h-4 w-4 text-blue-500 mr-2" />
                          {slot}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-400">No slots added</div>
                  )}
                </div>
              </div>
            </div>

            {/* Education */}
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm space-y-4">
              <div className="flex items-center text-blue-600 font-semibold text-lg">
                <GraduationCap className="h-5 w-5 mr-2" />
                Education
              </div>
              <div className="space-y-3">
                {isEditing ? (
                  <div className="space-y-2">
                    {editedProfile.education.map((edu, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <GraduationCap className="h-5 w-5 text-gray-400 mr-3 mt-2" />
                        <div className="flex-1">
                          <input
                            type="text"
                            value={edu}
                            onChange={(e) => {
                              const newEducation = [...editedProfile.education];
                              newEducation[index] = e.target.value;
                              setEditedProfile({
                                ...editedProfile,
                                education: newEducation,
                              });
                            }}
                            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2"
                          />
                          {index === editedProfile.education.length - 1 && (
                            <button
                              onClick={handleAddEducation}
                              className="text-blue-600 hover:text-blue-800 text-sm mt-2"
                            >
                              <Plus className="h-4 w-4 mr-1 inline" /> Add
                              Education
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {profile.education.map((edu, index) => (
                      <div key={index} className="flex items-center">
                        <GraduationCap className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-gray-700">{edu}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Certifications */}
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm space-y-4">
              <div className="flex items-center text-blue-600 font-semibold text-lg">
                <Award className="h-5 w-5 mr-2" />
                Certifications
              </div>
              <div className="space-y-3">
                {isEditing ? (
                  <div className="space-y-2">
                    {editedProfile.certifications.map((cert, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <Award className="h-5 w-5 text-gray-400 mr-3 mt-2" />
                        <div className="flex-1">
                          <input
                            type="text"
                            value={cert}
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
                            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2"
                          />
                          {index ===
                            editedProfile.certifications.length - 1 && (
                            <button
                              onClick={handleAddCertification}
                              className="text-blue-600 hover:text-blue-800 text-sm mt-2"
                            >
                              <Plus className="h-4 w-4 mr-1 inline" /> Add
                              Certification
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {profile.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center">
                        <Award className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-gray-700">{cert}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer color="blue" />
    </div>
  );
};

export default DoctorProfile;
