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
import DoctorNavbar from "../../components/doctor/Navbar";
import Footer from "../../components/common/Footer";
import { format } from "date-fns";
import { checkAuth } from "../../utils/profile";
import { useNavigate, Link } from "react-router-dom";
import SessionExpired from "../../components/common/SessionExpired";
import { TimeChange } from "../../components/common/TimeChange";
import CustomToast from "../../components/common/CustomToast";
import { ToastContainer } from "react-toastify";
import CustomLoader from "../../components/common/CustomLoader";
import { HashLoader } from "react-spinners";

const DoctorProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "<Please Change>",
    email: "<Please Change>",
    phone: "<Please Change>",
    address: "<Please Change>",
    office_address: "<Please Change>",
    specialization: "<Please Change>",
    experience: "<Please Change>",
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
  const token = localStorage.getItem("token");

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
          `https://built-it.onrender.com/common/getDoc?docId=${doctorId}`,
          { headers: { Authorization: "Bearer " + token } }
        );
        const response2 = await fetch(
          `https://built-it.onrender.com/doc/general-slots?docId=${doctorId}`,
          { headers: { Authorization: "Bearer " + token } }
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
        if (typeof data.certifications === "string") {
          try {
            certifications = JSON.parse(data.certifications);
          } catch (e) {
            certifications = data.certifications
              .split("|")
              .filter((cert) => cert !== "");
          }
        } else if (Array.isArray(data.certifications)) {
          certifications = data.certifications
            .map((cert) =>
              typeof cert === "object" ? cert.certification : cert
            )
            .filter((cert) => cert !== "");
        }
        if (certifications.length === 0) {
          certifications = ["<Add>"];
        }

        let educations = [];
        if (typeof data.education === "string") {
          try {
            educations = JSON.parse(data.education);
          } catch (e) {
            educations = data.education.split("|").filter((edu) => edu !== "");
          }
        } else if (Array.isArray(data.education)) {
          educations = data.education
            .map((edu) => (typeof edu === "object" ? edu.education : edu))
            .filter((edu) => edu !== "");
        }
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
          office_address: data.doctor.office_address,
          certifications: certifications,
          education: educations,
          availability: slots.length === 0 ? ["<Add>"] : slots,
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
          office_address: data.doctor.office_address,
          certifications: certifications,
          education: educations,
          availability: slots.length === 0 ? ["<Add>"] : slots,
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
    navigate("https://hms-sso.vercel.app/");
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const doctorId = localStorage.getItem("userid");
      // Filter out empty or "<Add>" entries from education and certifications
      const filteredEducation = editedProfile.education.filter(
        (edu) => edu.trim() !== "" && edu !== "<Add>"
      );
      const filteredCertifications = editedProfile.certifications.filter(
        (cert) => cert.trim() !== "" && cert !== "<Add>"
      );

      const formData = new FormData();
      formData.append("id", doctorId);
      formData.append("address", editedProfile.address);
      formData.append("office_address", editedProfile.office_address);
      formData.append("experience", editedProfile.experience);
      formData.append(
        "educ",
        filteredEducation.length > 0 ? filteredEducation : ["<Add>"]
      );
      formData.append(
        "certifi",
        filteredCertifications.length > 0 ? filteredCertifications : ["<Add>"]
      );
      formData.append("image", file);

      if (
        editedProfile.address !== "<Please Change>" &&
        editedProfile.office_address !== "<Please Change>" &&
        editedProfile.experience !== null &&
        filteredEducation.length > 0 &&
        filteredEducation != ["<Add>"] &&
        filteredCertifications.length > 0 &&
        filteredCertifications != ["<Add>"]
      ) {
        formData.append("isProfileDone", true);
      } else {
        formData.append("isProfileDone", false);
      }

      const response = await fetch(
        `https://built-it.onrender.com/doc/modifyDoc`,
        {
          method: "PUT",
          headers: { Authorization: "Bearer " + token },
          body: formData,
        }
      );

      const filteredAvailability = editedProfile.availability.filter(
        (slot) => slot.trim() !== "" && slot !== "<Add>"
      );
      let dates = [];
      for (let i = 0; i < filteredAvailability.length; i++) {
        const date = new Date(
          "1970-01-01T" + filteredAvailability[i] + ":00.000Z"
        );
        const newDate = TimeChange(date.getTime());
        dates.push(newDate);
      }
      if (dates.length !== 0) {
        const response2 = await fetch(
          `https://built-it.onrender.com/doc/modifySlots?slotsArray=${dates}&doctorId=${doctorId}`,
          {
            method: "PUT",
            headers: { Authorization: "Bearer " + token },
          }
        );
        const data2 = await response2.json();
      }

      const data = await response.json();

      // Update profile with filtered data
      setProfile({
        ...editedProfile,
        education: filteredEducation.length > 0 ? filteredEducation : ["<Add>"],
        certifications:
          filteredCertifications.length > 0
            ? filteredCertifications
            : ["<Add>"],
        availability:
          filteredAvailability.length > 0 ? filteredAvailability : ["<Add>"],
      });

      setIsLoading(false);
      CustomToast("Profile updated successfully", "blue");
    } catch (e) {
      console.log(e);
      setIsLoading(false);
      CustomToast("Error updating profile", "blue");
    }
    setIsEditing(false);
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

  if (isAuthenticated === null || fetched === null) {
    return <CustomLoader color="blue" text="Loading your dashboard..." />;
  }

  if (!isAuthenticated) {
    return <SessionExpired handleClosePopup={handleClosePopup} theme="blue" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--custom-blue-50)] via-[var(--custom-white)] to-[var(--custom-blue-50)] overflow-hidden">
      <DoctorNavbar />
      <ToastContainer />
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-6 lg:py-10 space-y-12 relative">
        {/* Floating Decorative Elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-[var(--custom-blue-200)] rounded-full filter blur-3xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[var(--custom-blue-200)] rounded-full filter blur-3xl opacity-20 animate-pulse-slow"></div>

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center animate-fade-in-down">
          <div>
            <h1 className="text-center text-3xl lg:text-4xl xl:text-5xl sm:text-start font-extrabold bg-[var(--custom-blue-950)] bg-clip-text text-[var(--custom-blue-800)]">
              Doctor Profile
            </h1>
            <p className="mt-3 text-sm sm:text-md lg:text-lg text-[var(--custom-gray-600)] font-medium">
              Curate your professional identity effortlessly
            </p>
          </div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="group relative mt-4 sm:mt-0 flex items-center px-3 py-1.5 sm:px-6 sm:py-3 bg-[var(--custom-blue-600)] text-[var(--custom-white)] text-sm font-semibold rounded-full shadow-xl hover:shadow-custom-blue-500/30 transform hover:scale-105 transition-all duration-500 overflow-hidden"
            >
              <span className="absolute inset-0 bg-[var(--custom-blue-600)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <Edit2 className="h-5 w-5 mr-2 relative  group-hover:animate-spin-slow" />
              <span className="relative">Edit Profile</span>
            </button>
          ) : (
            <div className="flex space-x-4 mt-4 sm:mt-0">
              <button
                onClick={handleSave}
                className="group relative flex items-center px-6 py-3 bg-[var(--custom-green-600)] text-[var(--custom-white)] text-sm font-semibold rounded-full shadow-md hover:shadow-[var(--custom-green-500)]/30 transform hover:scale-105 transition-all duration-500 overflow-hidden"
              >
                <span className="absolute inset-0 bg-[var(--custom-blue-800)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <Save className="h-5 w-5 mr-2 relative" />
                <span className="relative ">Save Changes</span>
              </button>
              <button
                onClick={handleCancel}
                className="group relative flex items-center px-6 py-3 bg-[var(--custom-white)] text-[var(--custom-gray-700)] text-sm font-medium rounded-full shadow-md border border-[var(--custom-gray-200)] hover:shadow-[var(--custom-gray-300)]/30 transform hover:scale-105 transition-all duration-500"
              >
                <X className="h-5 w-5 mr-2 group-hover:animate-spin-fast" />
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Profile Card */}
        <div className="bg-[var(--custom-white)]/90 backdrop-blur-xl rounded-3xl shadow-2xl p-3 md:p-8 border border-[var(--custom-blue-100)]/30 transition-all duration-500 hover:shadow-[var(--custom-blue-200)]/20 animate-fade-in-up">
          <div className="w-full flex justify-between flex-col md:flex-row gap-4 md:gap-8">
            <div className="flex flex-col md:flex-row items-center md:space-x-8">
              <div
                onClick={triggerImageUpload}
                className={`relative w-24 h-24 lg:h-32 lg:w-32 rounded-full bg-gradient-to-br from-[var(--custom-blue-100)] to-[var(--custom-blue-100)] flex items-center justify-center shadow-xl overflow-hidden group ${
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
                  <User className="h-16 w-16 text-[var(--custom-blue-600)] transform transition-all duration-300 group-hover:scale-110" />
                )}
                <div className="absolute inset-0 bg-gradient-to-tr from-[var(--custom-blue-500)]/10 to-[var(--custom-blue-500)]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-0 border-2 border-[var(--custom-blue-300)]/50 rounded-full animate-spin-slow"></div>
                {isEditing && (
                  <div className="absolute inset-0 bg-[var(--custom-black)]/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-[var(--custom-white)] text-sm font-medium">
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
                <h2 className="text-2xl text-center md:text-start md:text-3xl lg:text-4xl font-extrabold bg-[var(--custom-blue-600)] bg-clip-text text-transparent">
                  {profile.name}
                </h2>
                <p className="text-xl text-[var(--custom-blue-600)] font-semibold mt-2 tracking-wide">
                  {profile.specialization}
                </p>
              </div>
            </div>
            <Link
              to="/doctor/leave"
              className="group relative flex self-end md:self-center items-center h-fit w-fit px-3 py-1.5 sm:px-6 sm:py-3 bg-[var(--custom-blue-600)] text-[var(--custom-white)] text-sm font-semibold rounded-full shadow-xl hover:shadow-[var(--custom-blue-500)]/30 transform hover:scale-105 transition-all duration-500 overflow-hidden"
            >
              <span className="absolute inset-0 bg-[var(--custom-blue-600)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <BriefcaseBusiness className="h-5 w-5 mr-2 relative  group-hover:animate-pulse" />
              <span className="relative ">Take Leave</span>
            </Link>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mt-6 md:mt-12">
            {/* Contact Info */}
            <div className="bg-[var(--custom-white)]/70 backdrop-blur-lg p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-in-left">
              <div className="flex items-center text-[var(--custom-blue-600)] font-semibold text-lg md:text-2xl mb-5">
                Contact Information
              </div>
              <div className="space-y-3">
                <div className="flex items-center group">
                  <Mail className="h-5 w-5 text-[var(--custom-blue-600)] mr-3 transition-transform group-hover:scale-125" />
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
                      className="w-4/5 sm:w-full bg-[var(--custom-gray-100)] border border-[var(--custom-gray-300)] rounded-xl px-4 py-2 cursor-not-allowed focus:ring-4 focus:ring-[var(--custom-blue-300)] transition-all duration-300"
                    />
                  ) : (
                    <span className="text-[var(--custom-gray-700)] group-hover:text-[var(--custom-blue-600)] transition-colors">
                      {profile.email}
                    </span>
                  )}
                </div>
                <div className="flex items-center group">
                  <Phone className="h-5 w-5 text-[var(--custom-blue-600)] mr-3 transition-transform group-hover:scale-125" />
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
                      className="w-4/5 sm:w-full bg-[var(--custom-gray-100)] border border-[var(--custom-gray-300)] rounded-xl px-4 py-2 cursor-not-allowed focus:ring-4 focus:ring-[var(--custom-blue-300)] transition-all duration-300"
                    />
                  ) : (
                    <span className="text-[var(--custom-gray-700)] group-hover:text-[var(--custom-blue-600)] transition-colors">
                      {profile.phone}
                    </span>
                  )}
                </div>
                <div className="flex items-start group">
                  <MapPin className="h-5 w-5 text-[var(--custom-blue-600)] mr-3 mt-1 transition-transform group-hover:scale-125" />
                  {isEditing ? (
                    <div className="w-4/5 sm:w-full space-y-4">
                      <input
                        type="text"
                        value={editedProfile.address}
                        onChange={(e) =>
                          setEditedProfile({
                            ...editedProfile,
                            address: e.target.value,
                          })
                        }
                        className="w-full bg-[var(--custom-white)] border border-[var(--custom-blue-200)] rounded-xl px-4 py-2 focus:ring-4 focus:ring-[var(--custom-blue-300)] transition-all duration-300 placeholder-[var(--custom-gray-400)]"
                        placeholder="Address"
                      />
                      <input
                        type="text"
                        value={editedProfile.office_address}
                        onChange={(e) =>
                          setEditedProfile({
                            ...editedProfile,
                            office_address: e.target.value,
                          })
                        }
                        className="w-full bg-[var(--custom-white)] border border-[var(--custom-blue-200)] rounded-xl px-4 py-2 focus:ring-4 focus:ring-[var(--custom-blue-300)] transition-all duration-300 placeholder-[var(--custom-gray-400)]"
                        placeholder="Office Address"
                      />
                    </div>
                  ) : (
                    <div>
                      <p className="text-[var(--custom-gray-700)] group-hover:text-[var(--custom-blue-600)] transition-colors">
                        {profile.address}
                      </p>
                      <p className="text-[var(--custom-gray-700)] group-hover:text-[var(--custom-blue-600)] transition-colors">
                        {profile.office_address}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Professional Info */}
            <div className="bg-[var(--custom-white)]/70 backdrop-blur-lg p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-in-right">
              <div className="space-y-8">
                <div>
                  <div className="flex items-center text-[var(--custom-blue-600)] font-semibold text-lg md:text-2xl mb-5">
                    Professional Information
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center group">
                      <Building className="h-5 w-5 text-[var(--custom-blue-600)] mr-3 transition-transform group-hover:scale-125" />
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
                          className="w-4/5 sm:w-full bg-[var(--custom-gray-100)] border border-[var(--custom-gray-300)] rounded-xl px-4 py-2 cursor-not-allowed focus:ring-4 focus:ring-[var(--custom-blue-300)] transition-all duration-300"
                        />
                      ) : (
                        <span className="text-[var(--custom-gray-700)] group-hover:text-[var(--custom-blue-600)] transition-colors">
                          {profile.specialization}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center group">
                      <Clock className="h-5 w-5 text-[var(--custom-blue-600)] mr-3 transition-transform group-hover:scale-125" />
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
                          className="w-4/5 sm:w-full bg-[var(--custom-white)] border border-[var(--custom-blue-200)] rounded-xl px-4 py-2 focus:ring-4 focus:ring-[var(--custom-blue-300)] transition-all duration-300"
                        />
                      ) : (
                        <span className="text-[var(--custom-gray-700)] group-hover:text-[var(--custom-blue-600)] transition-colors">
                          {profile.experience} of Experience
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <div className="flex items-center text-[var(--custom-blue-600)] font-semibold text-lg md:text-2xl mb-5">
                    General Slots
                  </div>
                  <div className="space-y-4">
                    {isEditing ? (
                      <div className="space-y-4">
                        {editedProfile.availability.map((slot, index) => (
                          <div key={index} className="flex flex-col space-y-4">
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
                              className="bg-[var(--custom-white)] border border-[var(--custom-blue-200)] rounded-xl px-4 py-2 text-sm w-40 focus:ring-4 focus:ring-[var(--custom-blue-300)] transition-all duration-300"
                            />
                            {index ===
                              editedProfile.availability.length - 1 && (
                              <button
                                onClick={handleAddSlot}
                                className="group flex items-center text-[var(--custom-blue-600)] hover:text-[var(--custom-blue-600)] text-sm font-semibold transition-colors"
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
                            className="inline-flex items-center px-4 py-2 bg-[var(--custom-blue-100)] text-[var(--custom-blue-600)] rounded-full text-sm font-medium shadow-md border border-[var(--custom-blue-200)] transform hover:scale-110 hover:shadow-custom-blue-300/30 transition-all duration-300"
                          >
                            <Clock className="h-4 w-4 mr-2 animate-pulse" />
                            {slot}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="text-[var(--custom-gray-400)] italic animate-fade-in">
                        No slots added
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Education */}
            <div className="bg-[var(--custom-white)]/70 backdrop-blur-lg p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-in-left">
              <div className="flex items-center text-[var(--custom-blue-600)] font-semibold text-lg md:text-2xl mb-5">
                Education
              </div>
              <div className="space-y-5">
                {isEditing ? (
                  <div className="space-y-4">
                    {editedProfile.education.map((edu, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <GraduationCap className="h-5 w-5 text-[var(--custom-blue-600)] mr-3 mt-2 transition-transform hover:scale-125" />
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
                            className="w-full bg-[var(--custom-white)] border border-[var(--custom-blue-200)] rounded-xl px-4 py-2 focus:ring-4 focus:ring-[var(--custom-blue-300)] transition-all duration-300"
                          />
                          {index === editedProfile.education.length - 1 && (
                            <button
                              onClick={handleAddEducation}
                              className="group flex items-center text-[var(--custom-blue-600)] hover:text-[var(--custom-blue-600)]  text-sm font-semibold mt-3 transition-colors"
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
                  <div className="space-y-3">
                    {profile.education.map((edu, index) => (
                      <div key={index} className="flex items-center group">
                        <GraduationCap className="h-5 w-5 text-[var(--custom-blue-600)] mr-3 transition-transform group-hover:scale-125" />
                        <span className="text-[var(--custom-gray-700)] group-hover:text-[var(--custom-blue-600)] transition-colors">
                          {edu}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Certifications */}
            <div className="bg-[var(--custom-white)]/70 backdrop-blur-lg p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-in-right">
              <div className="flex items-center text-[var(--custom-blue-600)] font-semibold text-lg md:text-2xl mb-5">
                Certifications
              </div>
              <div className="space-y-5">
                {isEditing ? (
                  <div className="space-y-4">
                    {editedProfile.certifications.map((cert, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <Award className="h-5 w-5 text-[var(--custom-blue-600)] mr-3 mt-2 transition-transform hover:scale-125" />
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
                            className="w-full bg-[var(--custom-white)] border border-[var(--custom-blue-200)] rounded-xl px-4 py-2 focus:ring-4 focus:ring-[var(--custom-blue-300)] transition-all duration-300"
                          />
                          {index ===
                            editedProfile.certifications.length - 1 && (
                            <button
                              onClick={handleAddCertification}
                              className="group flex items-center text-[var(--custom-blue-600)] hover:text-[var(--custom-blue-600)] text-sm font-semibold mt-3 transition-colors"
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
                  <div className="space-y-3">
                    {profile.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center group">
                        <Award className="h-5 w-5 text-[var(--custom-blue-600)] mr-3 transition-transform group-hover:scale-125" />
                        <span className="text-[var(--custom-gray-700)] group-hover:text-[var(--custom-blue-600)] transition-colors">
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
        <div className="fixed inset-0 bg-[var(--custom-black)]/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[var(--custom-white)] flex flex-col items-center justify-center rounded-3xl shadow-2xl w-full max-w-md mx-4 p-6 sm:p-8 transform scale-95 animate-modal-in border border-[var(--custom-blue-100)]">
            <HashLoader color="#004ba8" radius={6} height={20} width={5} />
            <p className="mt-4 text-[var(--custom-gray-600)]">
              Updating your profile...
            </p>
          </div>
        </div>
      )}
      <Footer color="blue" />
    </div>
  );
};

export default DoctorProfile;
