import React, { useState, useEffect, useRef } from "react";
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
  BriefcaseBusiness,
} from "lucide-react";
import DoctorNavbar from "../../components/doctor/Navbar_doctor";
import Footer from "../../components/Footer";
import { format } from "date-fns";
import PacmanLoader from "react-spinners/PacmanLoader";
import { checkAuth } from "../../utils/profile";
import { useNavigate, Link } from "react-router-dom";
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
  const [fetched, setfetched] = useState(null);
  const fileInputRef = useRef(null);
  const [profileImage, setProfileImage] = useState(null);
  const [file, setfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      const authStatus = await checkAuth("doc");
      setIsAuthenticated(authStatus);
    };
    verifyAuth();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const doctorId = localStorage.getItem("userid");
        const response = await fetch(
          `http://localhost:3000/getDoc?docId=${doctorId}`
        );
        const response2 = await fetch(
          `http://localhost:3000/general-slots?docId=${doctorId}`
        );
        const data = await response.json();
        const data2 = await response2.json();
        const slots = [];
        data2.generalSlots.map((slot) => {
          slots.push(
            format(TimeChange(new Date(slot.starting_time).getTime()), "H:mm")
          );
        });
        let certifications = [];
        data.certifications.map((certification) => {
          certifications.push(certification.certification);
        });
        if (slots.length === 0) {
          slots.push("<Add>");
        }
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
        setProfileImage(data.doctor.img);
        localStorage.setItem("docImage", data.doctor.img);
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
        setfetched(true);
      } catch (error) {
        console.error("Error fetching data:", error);
        CustomToast("Error fetching data", "blue");
        setfetched(false);
      }
    };
    fetchData();
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

  if (isAuthenticated === null || fetched === null) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <PacmanLoader color="#004ba8" radius={6} height={20} width={5} />
        <p className="mt-4 text-gray-600">Loading your dashboard...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <SessionExpired handleClosePopup={handleClosePopup} theme="blue" />;
  }

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const doctorId = localStorage.getItem("userid");
      const formData = new FormData();
      formData.append("id", doctorId);
      formData.append("address", editedProfile.address);
      formData.append("city", editedProfile.city);
      formData.append("experience", editedProfile.experience);
      formData.append("educ", editedProfile.education);
      formData.append("certifi", editedProfile.certifications);
      formData.append("image", file);
      const response = await fetch(`http://localhost:3000/modifyDoc`, {
        method: "PUT",
        body: formData,
      });
      let dates = [];
      for (let i = 0; i < editedProfile.availability.length; i++) {
        const date = new Date(
          "1970-01-01T" + editedProfile.availability[i] + ":00.000Z"
        );
        const newDate = TimeChange(date.getTime());
        console.log(newDate);
        dates.push(newDate);
      }
      const response2 = await fetch(
        `http://localhost:3000/modifySlots?slotsArray=${dates}&doctorId=${doctorId}`,
        {
          method: "PUT",
        }
      );
      const data = await response.json();
      const data2 = await response2.json();
      setIsLoading(false);
      CustomToast("Profile updated successfully", "blue");
    } catch (e) {
      console.log(e);
      setIsLoading(false);
      CustomToast("Error updating profile", "blue");
    }
    setProfile(editedProfile);
    setIsEditing(false);
    console.log(editedProfile);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleImageUpload = (event) => {
    const filee = event.target.files?.[0];
    if (filee) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      setfile(filee);
      reader.readAsDataURL(filee);
    }
  };

  const triggerImageUpload = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 overflow-hidden">
      <DoctorNavbar />
      <ToastContainer />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 space-y-12 relative">
        {/* Floating Decorative Elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-indigo-200 rounded-full filter blur-3xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-200 rounded-full filter blur-3xl opacity-20 animate-pulse-slow"></div>

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center animate-fade-in-down">
          <div>
            <h1 className="text-3xl text-center sm:text-5xl sm:text-start font-extrabold bg-cyan-950 bg-clip-text text-blue-800">
              Doctor Profile
            </h1>
            <p className="mt-3 text-lg text-gray-600 font-medium">
              Curate your professional identity effortlessly
            </p>
          </div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="group relative mt-4 sm:mt-0 flex items-center px-6 py-3 bg-blue-600 text-white text-sm font-semibold rounded-full shadow-xl hover:shadow-indigo-500/30 transform hover:scale-105 transition-all duration-500 overflow-hidden"
            >
              <span className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <Edit2 className="h-5 w-5 mr-2 relative  group-hover:animate-spin-slow" />
              <span className="relative">Edit Profile</span>
            </button>
          ) : (
            <div className="flex space-x-4 mt-4 sm:mt-0">
              <button
                onClick={handleSave}
                className="group relative flex items-center px-6 py-3 bg-gradient-to-r from-teal-500 to-green-500 text-white text-sm font-semibold rounded-full shadow-xl hover:shadow-teal-500/30 transform hover:scale-105 transition-all duration-500 overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-teal-600 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <Save className="h-5 w-5 mr-2 relative  group-hover:animate-bounce" />
                <span className="relative ">Save Changes</span>
              </button>
              <button
                onClick={handleCancel}
                className="group relative flex items-center px-6 py-3 bg-white text-gray-700 text-sm font-medium rounded-full shadow-md border border-gray-200 hover:shadow-gray-300/30 transform hover:scale-105 transition-all duration-500"
              >
                <X className="h-5 w-5 mr-2 group-hover:animate-spin-fast" />
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Profile Card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-indigo-100/30 transition-all duration-500 hover:shadow-indigo-200/20 animate-fade-in-up">
          <div className="w-full flex justify-between flex-col md:flex-row gap-8">
            <div className="flex flex-col md:flex-row items-center space-x-8">
              <div
                onClick={triggerImageUpload}
                className={`relative h-32 w-32 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center shadow-xl overflow-hidden group ${
                  isEditing ? "cursor-pointer" : ""
                }`}
              >
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-16 w-16 text-blue-600 transform transition-all duration-300 group-hover:scale-110" />
                )}
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-0 border-2 border-indigo-300/50 rounded-full animate-spin-slow"></div>
                {isEditing && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-sm font-medium">
                      Change Photo
                    </p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              <div className="mt-4 md:md-0">
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
                    className="text-4xl font-extrabold text-gray-900 bg-gray-100 border border-gray-300 rounded-xl px-4 py-2 cursor-not-allowed focus:ring-4 focus:ring-indigo-300 transition-all duration-300"
                  />
                ) : (
                  <h2 className="text-4xl font-extrabold bg-blue-600 bg-clip-text text-transparent">
                    {profile.name}
                  </h2>
                )}
                <p className="text-xl text-blue-600 font-semibold mt-2 tracking-wide">
                  {profile.specialization}
                </p>
              </div>
            </div>
            <Link
              to="/doctor/leave"
              className="group relative flex self-end md:self-center items-center h-fit w-fit px-6 py-3 bg-blue-600 text-white text-sm font-semibold rounded-full shadow-xl hover:shadow-indigo-500/30 transform hover:scale-105 transition-all duration-500 overflow-hidden"
            >
              <span className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <BriefcaseBusiness className="h-5 w-5 mr-2 relative  group-hover:animate-pulse" />
              <span className="relative ">Take Leave</span>
            </Link>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            {/* Contact Info */}
            <div className="bg-white/70 backdrop-blur-lg p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-in-left">
              <div className="flex items-center text-blue-600 font-semibold text-xl mb-5">
                <Mail className="h-6 w-6 mr-3 animate-bounce-slow" />
                Contact Information
              </div>
              <div className="space-y-5">
                <div className="flex items-center group">
                  <Mail className="h-5 w-5 text-blue-600 mr-4 transition-transform group-hover:scale-125" />
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
                      className="flex-1 bg-gray-100 border border-gray-300 rounded-xl px-4 py-2 cursor-not-allowed focus:ring-4 focus:ring-indigo-300 transition-all duration-300"
                    />
                  ) : (
                    <span className="text-gray-700 group-hover:text-blue-600 transition-colors">
                      {profile.email}
                    </span>
                  )}
                </div>
                <div className="flex items-center group">
                  <Phone className="h-5 w-5 text-blue-600 mr-4 transition-transform group-hover:scale-125" />
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
                      className="flex-1 bg-gray-100 border border-gray-300 rounded-xl px-4 py-2 cursor-not-allowed focus:ring-4 focus:ring-indigo-300 transition-all duration-300"
                    />
                  ) : (
                    <span className="text-gray-700 group-hover:text-blue-600 transition-colors">
                      {profile.phone}
                    </span>
                  )}
                </div>
                <div className="flex items-start group">
                  <MapPin className="h-5 w-5 text-blue-600 mr-4 mt-1 transition-transform group-hover:scale-125" />
                  {isEditing ? (
                    <div className="flex-1 space-y-4">
                      <input
                        type="text"
                        value={editedProfile.address}
                        onChange={(e) =>
                          setEditedProfile({
                            ...editedProfile,
                            address: e.target.value,
                          })
                        }
                        className="w-full bg-white border border-indigo-200 rounded-xl px-4 py-2 focus:ring-4 focus:ring-indigo-300 transition-all duration-300 placeholder-gray-400"
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
                        className="w-full bg-white border border-indigo-200 rounded-xl px-4 py-2 focus:ring-4 focus:ring-indigo-300 transition-all duration-300 placeholder-gray-400"
                        placeholder="City, State ZIP"
                      />
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-700 group-hover:text-blue-600 transition-colors">
                        {profile.address}
                      </p>
                      <p className="text-gray-700 group-hover:text-blue-600 transition-colors">
                        {profile.city}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Professional Info */}
            <div className="bg-white/70 backdrop-blur-lg p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-in-right">
              <div className="space-y-8">
                <div>
                  <div className="flex items-center text-blue-600 font-semibold text-xl mb-5">
                    <Building className="h-6 w-6 mr-3 animate-bounce-slow" />
                    Professional Information
                  </div>
                  <div className="space-y-5">
                    <div className="flex items-center group">
                      <Building className="h-5 w-5 text-blue-600 mr-4 transition-transform group-hover:scale-125" />
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
                          className="flex-1 bg-gray-100 border border-gray-300 rounded-xl px-4 py-2 cursor-not-allowed focus:ring-4 focus:ring-indigo-300 transition-all duration-300"
                        />
                      ) : (
                        <span className="text-gray-700 group-hover:text-blue-600 transition-colors">
                          {profile.specialization}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center group">
                      <Clock className="h-5 w-5 text-blue-600 mr-4 transition-transform group-hover:scale-125" />
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
                          className="flex-1 bg-white border border-indigo-200 rounded-xl px-4 py-2 focus:ring-4 focus:ring-indigo-300 transition-all duration-300"
                        />
                      ) : (
                        <span className="text-gray-700 group-hover:text-blue-600 transition-colors">
                          {profile.experience} of Experience
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <div className="flex items-center text-blue-600 font-semibold text-xl mb-5">
                    <Clock className="h-6 w-6 mr-3 animate-bounce-slow" />
                    General Slots
                  </div>
                  <div className="space-y-4">
                    {isEditing ? (
                      <div className="space-y-4">
                        {editedProfile.availability.map((slot, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-4"
                          >
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
                              className="bg-white border border-indigo-200 rounded-xl px-4 py-2 text-sm w-40 focus:ring-4 focus:ring-indigo-300 transition-all duration-300"
                            />
                            {index ===
                              editedProfile.availability.length - 1 && (
                              <button
                                onClick={handleAddSlot}
                                className="group flex items-center text-blue-600 hover:text-blue-600 text-sm font-semibold transition-colors"
                              >
                                <Plus className="h-5 w-5 mr-1 transform group-hover:rotate-180 transition-transform duration-500" />
                                Add Slot
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : profile.availability.length > 0 ? (
                      <div className="flex flex-wrap gap-3">
                        {profile.availability.map((slot, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-4 py-2 bg-indigo-100 text-blue-600 rounded-full text-sm font-medium shadow-md border border-indigo-200 transform hover:scale-110 hover:shadow-indigo-300/30 transition-all duration-300"
                          >
                            <Clock className="h-4 w-4 mr-2 animate-pulse" />
                            {slot}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="text-gray-400 italic animate-fade-in">
                        No slots added
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Education */}
            <div className="bg-white/70 backdrop-blur-lg p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-in-left">
              <div className="flex items-center text-blue-600 font-semibold text-xl mb-5">
                <GraduationCap className="h-6 w-6 mr-3 animate-bounce-slow" />
                Education
              </div>
              <div className="space-y-5">
                {isEditing ? (
                  <div className="space-y-4">
                    {editedProfile.education.map((edu, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <GraduationCap className="h-5 w-5 text-blue-600 mr-3 mt-2 transition-transform hover:scale-125" />
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
                            className="w-full bg-white border border-indigo-200 rounded-xl px-4 py-2 focus:ring-4 focus:ring-indigo-300 transition-all duration-300"
                          />
                          {index === editedProfile.education.length - 1 && (
                            <button
                              onClick={handleAddEducation}
                              className="group flex items-center text-blue-600 hover:text-blue-600  text-sm font-semibold mt-3 transition-colors"
                            >
                              <Plus className="h-5 w-5 mr-1 transform group-hover:rotate-180 transition-transform duration-500" />
                              Add Education
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {profile.education.map((edu, index) => (
                      <div key={index} className="flex items-center group">
                        <GraduationCap className="h-5 w-5 text-blue-600 mr-4 transition-transform group-hover:scale-125" />
                        <span className="text-gray-700 group-hover:text-blue-600 transition-colors">
                          {edu}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Certifications */}
            <div className="bg-white/70 backdrop-blur-lg p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-in-right">
              <div className="flex items-center text-blue-600 font-semibold text-xl mb-5">
                <Award className="h-6 w-6 mr-3 animate-bounce-slow" />
                Certifications
              </div>
              <div className="space-y-5">
                {isEditing ? (
                  <div className="space-y-4">
                    {editedProfile.certifications.map((cert, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <Award className="h-5 w-5 text-blue-600 mr-3 mt-2 transition-transform hover:scale-125" />
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
                            className="w-full bg-white border border-indigo-200 rounded-xl px-4 py-2 focus:ring-4 focus:ring-indigo-300 transition-all duration-300"
                          />
                          {index ===
                            editedProfile.certifications.length - 1 && (
                            <button
                              onClick={handleAddCertification}
                              className="group flex items-center text-blue-600 hover:text-blue-600 text-sm font-semibold mt-3 transition-colors"
                            >
                              <Plus className="h-5 w-5 mr-1 transform group-hover:rotate-180 transition-transform duration-500" />
                              Add Certification
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {profile.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center group">
                        <Award className="h-5 w-5 text-blue-600 mr-4 transition-transform group-hover:scale-125" />
                        <span className="text-gray-700 group-hover:text-blue-600 transition-colors">
                          {cert}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {isLoading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white flex flex-col items-center justify-center rounded-3xl shadow-2xl w-full max-w-md mx-4 p-6 sm:p-8 transform scale-95 animate-modal-in border border-blue-100">
            <PacmanLoader color="#004ba8" radius={6} height={20} width={5} />
            <p className="mt-4 text-gray-600">Updating your profile...</p>
          </div>
        </div>
      )}
      <Footer color="blue" />
    </div>
  );
};

export default DoctorProfile;
