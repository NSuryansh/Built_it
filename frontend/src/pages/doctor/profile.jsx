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
  Calendar,
  UserX,
  Link2,
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
    additionalExperience: "<Please Change>",
    education: ["<Add>"],
    weekOff: [],
    availability: {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: [],
    },
    certifications: ["<Add>"],
  });
  const [googleDriveLinked, setGoogleDriveLinked] = useState(false);
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [editedProfile, setEditedProfile] = useState(profile);
  const [fetched, setFetched] = useState(null);
  const fileInputRef = useRef(null);
  const [profileImage, setProfileImage] = useState(null);
  const [file, setfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem("token");
  let DAYS_OF_WEEK = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const [leaves, setLeaves] = useState(null);

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
          `http://localhost:3000/api/common/getDoc?docId=${doctorId}`,
          {
            headers: { Authorization: "Bearer " + token },
          },
        );
        const response2 = await fetch(
          `http://localhost:3000/api/doc/general-slots?docId=${doctorId}`,
          { headers: { Authorization: "Bearer " + token } },
        );

        const data = await response.json();
        const data2 = await response2.json();
        let avail = {
          Sunday: [],
          Monday: [],
          Tuesday: [],
          Wednesday: [],
          Thursday: [],
          Friday: [],
          Saturday: [],
        };
        data2.generalSlots.map((slot) => {
          avail[DAYS_OF_WEEK[slot.day_of_week]].push(
            format(new Date(slot.starting_time).getTime(), "HH:mm"),
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
              typeof cert === "object" ? cert.certification : cert,
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

        setGoogleDriveLinked(data.doctor.googleDriveLinked);

        setProfile({
          name: data.doctor.name,
          email: data.doctor.email,
          phone: data.doctor.mobile,
          specialization: data.doctor.desc,
          experience: data.doctor.experience,
          additionalExperience: data.doctor.additionalExperience,
          address: data.doctor.address,
          office_address: data.doctor.office_address,
          certifications: certifications,
          education: educations,
          availability: avail,
          weekOff: data.doctor.weekOff,
        });
        setProfileImage(data.doctor.img);
        localStorage.setItem("docImage", data.doctor.img);
        setEditedProfile({
          name: data.doctor.name,
          email: data.doctor.email,
          phone: data.doctor.mobile,
          specialization: data.doctor.desc,
          experience: data.doctor.experience,
          additionalExperience: data.doctor.additionalExperience,
          address: data.doctor.address,
          office_address: data.doctor.office_address,
          certifications: certifications,
          education: educations,
          availability: avail,
          weekOff: data.doctor.weekOff,
        });
        setFetched(true);
      } catch (error) {
        console.error("Error fetching data:", error);
        CustomToast("Error fetching data", "blue");
        setFetched(false);
      }
    };
    fetchData();
  }, []);

  const fetchLeaves = async () => {
    const docId = localStorage.getItem("userid");
    if (!docId) return;
    try {
      const response = await fetch(
        `http://localhost:3000/api/doc_admin/leaves?doc_id=${docId}`,
        {
          headers: { Authorization: "Bearer " + token },
        },
      );
      const data = await response.json();
      setLeaves(data);
    } catch (error) {
      console.error(error);
      CustomToast("Error in fetching leaves", "blue");
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const linkGoogleDrive = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/google/connect", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      window.location.href = data.url;
    } catch (error) {
      console.error(error);
      CustomToast("Internal Server Error", "blue");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateLeaveDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleAddSlot = (day) => {
    const newAvailability = { ...editedProfile.availability };
    if (!newAvailability[day]) {
      newAvailability[day] = [];
    }
    newAvailability[day].push("09:00");
    setEditedProfile({
      ...editedProfile,
      availability: newAvailability,
    });
  };

  const handleRemoveSlot = (day, slotIndex) => {
    const newAvailability = { ...editedProfile.availability };
    newAvailability[day].splice(slotIndex, 1);
    setEditedProfile({
      ...editedProfile,
      availability: newAvailability,
    });
  };

  const handleSlotTimeChange = (day, slotIndex, newTime) => {
    const newAvailability = { ...editedProfile.availability };
    newAvailability[day][slotIndex] = newTime;
    setEditedProfile({
      ...editedProfile,
      availability: newAvailability,
    });
  };

  const getTotalSlots = (availability) => {
    return Object.values(availability).reduce(
      (total, daySlots) => total + daySlots.length,
      0,
    );
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

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const doctorId = localStorage.getItem("userid");
      const filteredEducation = editedProfile.education.filter(
        (edu) => edu.trim() !== "" && edu !== "<Add>",
      );
      const filteredCertifications = editedProfile.certifications.filter(
        (cert) => cert.trim() !== "" && cert !== "<Add>",
      );

      const formData = new FormData();
      formData.append("id", doctorId);
      formData.append("address", editedProfile.address);
      formData.append("office_address", editedProfile.office_address);
      formData.append("experience", editedProfile.experience);
      formData.append(
        "additionalExperience",
        editedProfile.additionalExperience || "",
      );
      formData.append("desc", editedProfile.specialization);
      formData.append(
        "educ",
        filteredEducation.length > 0 ? filteredEducation : ["<Add>"],
      );
      formData.append(
        "certifi",
        filteredCertifications.length > 0 ? filteredCertifications : ["<Add>"],
      );
      formData.append("image", file);

      if (
        editedProfile.address !== "<Please Change>" &&
        editedProfile.office_address !== "<Please Change>" &&
        editedProfile.experience !== null &&
        editedProfile.additionalExperience !== null &&
        filteredEducation.length > 0 &&
        filteredEducation != ["<Add>"] &&
        filteredCertifications.length > 0 &&
        filteredCertifications != ["<Add>"]
      ) {
        formData.append("isProfileDone", true);
      } else {
        formData.append("isProfileDone", false);
      }

      await fetch(`http://localhost:3000/api/doc/modifyDoc`, {
        method: "PUT",
        headers: { Authorization: "Bearer " + token },
        body: formData,
      });

      let dates = [];
      for (let i = 0; i < DAYS_OF_WEEK.length; i++) {
        for (
          let j = 0;
          j < editedProfile.availability[DAYS_OF_WEEK[i]].length;
          j++
        ) {
          const date = new Date(
            "1970-01-01T" +
              editedProfile.availability[DAYS_OF_WEEK[i]][j] +
              ":00.000Z",
          );
          const newDate = TimeChange(date.getTime());
          dates.push({ time: newDate, day_of_week: i });
        }
      }
      if (dates.length !== 0) {
        await fetch(
          `http://localhost:3000/api/doc/modifySlots?slotsArray=${JSON.stringify(
            dates,
          )}&doctorId=${doctorId}`,
          {
            method: "PUT",
            headers: { Authorization: "Bearer " + token },
          },
        );
      }

      setProfile({
        ...editedProfile,
        education: filteredEducation.length > 0 ? filteredEducation : ["<Add>"],
        certifications:
          filteredCertifications.length > 0
            ? filteredCertifications
            : ["<Add>"],
      });

      setIsLoading(false);
      CustomToast("Profile updated successfully", "blue");
    } catch (e) {
      console.error("Error updating profile:", e);
      setIsLoading(false);
      CustomToast(`Error updating profile: ${e.message}`, "blue");
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
        <div className="absolute top-0 left-0 w-72 h-72 bg-[var(--custom-blue-200)] rounded-full filter blur-3xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[var(--custom-blue-200)] rounded-full filter blur-3xl opacity-20 animate-pulse-slow"></div>

        <div className="flex flex-col sm:flex-row justify-between items-center animate-fade-in-down">
          <div>
            <h1 className="text-center text-3xl lg:text-4xl xl:text-5xl sm:text-start font-extrabold bg-[var(--custom-blue-950)] bg-clip-text text-[var(--custom-blue-800)]">
              Therapist Profile
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
              <Edit2 className="h-5 w-5 mr-2 relative group-hover:animate-spin-slow" />
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
                <span className="relative">Save Changes</span>
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
              <BriefcaseBusiness className="h-5 w-5 mr-2 relative group-hover:animate-pulse" />
              <span className="relative">Take Leave</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mt-6 md:mt-12">
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
                <div className="flex items-center group">
                  <Link2 className="h-5 w-5 text-[var(--custom-blue-600)] mr-3 transition-transform group-hover:scale-125" />

                  <button
                    disabled={googleDriveLinked}
                    onClick={linkGoogleDrive}
                    className="text-[var(--custom-gray-700)] group-hover:text-[var(--custom-blue-600)] transition-colors"
                  >
                    {googleDriveLinked
                      ? "Drive Linked"
                      : "Link Google Drive Folder"}
                  </button>
                </div>
              </div>
            </div>

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
                          value={editedProfile.specialization}
                          onChange={(e) =>
                            setEditedProfile({
                              ...editedProfile,
                              specialization: e.target.value,
                            })
                          }
                          className="w-4/5 sm:w-full bg-[var(--custom-white)] border border-[var(--custom-blue-200)] rounded-xl px-4 py-2 focus:ring-4 focus:ring-[var(--custom-blue-300)] transition-all duration-300"
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
                          {profile.experience}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center group">
                      <Clock className="h-5 w-5 text-[var(--custom-blue-600)] mr-3 transition-transform group-hover:scale-125" />
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedProfile.additionalExperience}
                          onChange={(e) =>
                            setEditedProfile({
                              ...editedProfile,
                              additionalExperience: e.target.value,
                            })
                          }
                          className="w-4/5 sm:w-full bg-[var(--custom-white)] border border-[var(--custom-blue-200)] rounded-xl px-4 py-2 focus:ring-4 focus:ring-[var(--custom-blue-300)] transition-all duration-300"
                        />
                      ) : (
                        <span className="text-[var(--custom-gray-700)] group-hover:text-[var(--custom-blue-600)] transition-colors">
                          {profile.additionalExperience} of Additional
                          Experience
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

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
                              className="group flex items-center text-[var(--custom-blue-600)] hover:text-[var(--custom-blue-600)] text-sm font-semibold mt-3 transition-colors"
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
        <div className="bg-white rounded-2xl shadow-xl border border-[var(--custom-blue-100)] p-4 md:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center text-[var(--custom-blue-600)] font-bold text-2xl md:text-3xl">
              <Calendar className="h-8 w-8 mr-3" />
              Weekly Availability
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gradient-to-r from-[var(--custom-blue-50)] to-indigo-50 rounded-xl p-4 mb-8 border border-[var(--custom-blue-200)]">
            <div className="text-[var(--custom-blue-800)] font-semibold">
              Total Availability:{" "}
              {getTotalSlots(
                isEditing ? editedProfile.availability : profile.availability,
              )}{" "}
              time slots across the week
            </div>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DAYS_OF_WEEK.map((day) => {
              const currentAvailability = isEditing
                ? editedProfile.availability
                : profile.availability;
              const daySlots = currentAvailability[day] || [];
              let found = false;
              for (var i = 0; i < profile.weekOff.length; i++) {
                if (day == profile.weekOff[i]) {
                  found = true;
                  break;
                }
              }
              return (
                <div
                  key={day}
                  className="bg-gradient-to-br from-gray-50 to-[var(--custom-blue-50)] rounded-xl p-6 border border-gray-200 hover:border-[var(--custom-blue-300)] transition-all duration-300 hover:shadow-lg"
                >
                  {/* Day Header */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-[var(--custom-blue-600)]" />
                      {day}
                    </h3>
                    <span className="bg-[var(--custom-blue-100)] text-[var(--custom-blue-700)] px-3 py-1 rounded-full text-sm font-semibold">
                      {daySlots.length} slots
                    </span>
                  </div>

                  {/* Slots Display/Edit */}
                  <div className="space-y-3">
                    {found ? (
                      <div className="text-center py-8 text-gray-400">
                        <UserX className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <div className="text-sm italic">WeekOff</div>
                      </div>
                    ) : (
                      <>
                        {isEditing ? (
                          <>
                            {daySlots.map((slot, slotIndex) => (
                              <div
                                key={slotIndex}
                                className="flex items-center space-x-2"
                              >
                                <input
                                  type="time"
                                  value={slot}
                                  onChange={(e) =>
                                    handleSlotTimeChange(
                                      day,
                                      slotIndex,
                                      e.target.value,
                                    )
                                  }
                                  className="flex-1 bg-white border border-[var(--custom-blue-200)] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--custom-blue-300)] focus:border-[var(--custom-blue-400)] transition-all duration-300"
                                />
                                <button
                                  onClick={() =>
                                    handleRemoveSlot(day, slotIndex)
                                  }
                                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-300"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                            <button
                              onClick={() => handleAddSlot(day)}
                              className="group flex items-center justify-center w-full py-3 border-2 border-dashed border-[var(--custom-blue-300)] hover:border-[var(--custom-blue-500)] text-[var(--custom-blue-600)] hover:text-[var(--custom-blue-700)] rounded-lg font-semibold transition-all duration-300 hover:bg-[var(--custom-blue-50)]"
                            >
                              <Plus className="h-5 w-5 mr-2 transform group-hover:rotate-90 transition-transform duration-300" />
                              Add Time Slot
                            </button>
                          </>
                        ) : (
                          <>
                            {daySlots.length > 0 ? (
                              <div className="space-y-2">
                                {daySlots.map((slot, slotIndex) => (
                                  <div
                                    key={slotIndex}
                                    className="flex items-center justify-between bg-white px-4 py-3 rounded-lg border border-[var(--custom-blue-200)] shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-102"
                                  >
                                    <div className="flex items-center">
                                      <Clock className="h-4 w-4 mr-2 text-[var(--custom-blue-500)]" />
                                      <span className="font-medium text-gray-800">
                                        {slot}
                                      </span>
                                    </div>
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-8 text-gray-400">
                                <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                <div className="text-sm italic">
                                  No slots available
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Weekly Overview */}
          {!isEditing && (
            <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
              <h3 className="text-lg font-bold text-indigo-800 mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Weekly Overview
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {DAYS_OF_WEEK.map((day) => {
                  const daySlots = profile.availability[day] || [];
                  const hasSlots = daySlots.length > 0;
                  let found = false;
                  for (var i = 0; i < profile.weekOff.length; i++) {
                    if (day == profile.weekOff[i]) {
                      found = true;
                      break;
                    }
                  }
                  return (
                    <div
                      key={day}
                      className={`text-center p-3 rounded-lg border-2 transition-all duration-300 ${
                        found
                          ? "bg-red-50 border-red-200 text-red-800"
                          : hasSlots
                            ? "bg-green-50 border-green-200 text-green-800"
                            : "bg-gray-50 border-gray-200 text-gray-500"
                      }`}
                    >
                      <div className="font-semibold text-sm">
                        {day.slice(0, 3)}
                      </div>
                      <div className="text-xs mt-1">
                        {found
                          ? "WeekOff"
                          : hasSlots
                            ? `${daySlots.length} slots`
                            : "Unavailable"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-4 md:p-8 border border-[var(--custom-blue-100)]/30 transition-all duration-500 hover:shadow-[var(--custom-blue-200)]/20 animate-fade-in-up">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center text-[var(--custom-blue-600)] font-bold text-2xl md:text-3xl">
              <Calendar className="h-8 w-8 mr-3" />
              Leave History
            </div>
            <span className="bg-[var(--custom-blue-100)] text-[var(--custom-blue-700)] px-4 py-2 rounded-full text-sm font-semibold">
              {leaves.length} {leaves.length === 1 ? "Leave" : "Leaves"}
            </span>
          </div>

          {leaves.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {leaves.map((leave) => (
                <div
                  key={leave.id}
                  className="group bg-gradient-to-br from-[var(--custom-blue-50)] to-white rounded-2xl p-6 border border-[var(--custom-blue-200)] hover:shadow-xl hover:border-[var(--custom-blue-400)] transition-all duration-300 transform hover:-translate-y-1"
                >
                  {/* Header with Date Range */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center flex-1">
                      <div className="bg-gradient-to-br from-[var(--custom-blue-100)] to-[var(--custom-blue-200)] p-3 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-300">
                        <Calendar className="h-6 w-6 text-[var(--custom-blue-600)]" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-[var(--custom-gray-500)] font-semibold uppercase tracking-wider mb-1">
                          Leave Period
                        </div>
                        <div className="text-base lg:text-lg font-bold text-[var(--custom-blue-800)]">
                          {formatDate(leave.date_start)}
                        </div>
                        <div className="text-sm text-[var(--custom-gray-600)] font-medium">
                          to
                        </div>
                        <div className="text-base lg:text-lg font-bold text-[var(--custom-blue-800)]">
                          {formatDate(leave.date_end)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Reason Box */}
                  <div className="bg-white rounded-xl p-4 border border-[var(--custom-blue-100)] shadow-sm mb-4">
                    <div className="text-xs text-[var(--custom-gray-500)] font-semibold uppercase tracking-wider mb-2">
                      Reason
                    </div>
                    <div className="text-[var(--custom-gray-800)] leading-relaxed">
                      {leave.reason || "No reason provided"}
                    </div>
                  </div>

                  {/* Duration Badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-[var(--custom-gray-600)] bg-[var(--custom-blue-50)] px-3 py-2 rounded-lg">
                      <Clock className="h-4 w-4 mr-2 text-[var(--custom-blue-600)]" />
                      <span className="font-semibold">
                        {calculateLeaveDuration(
                          leave.date_start,
                          leave.date_end,
                        )}{" "}
                        {calculateLeaveDuration(
                          leave.date_start,
                          leave.date_end,
                        ) === 1
                          ? "day"
                          : "days"}
                      </span>
                    </div>

                    {/* Status indicator (you can customize this based on your needs) */}
                    <div className="flex items-center text-xs text-[var(--custom-green-600)] bg-[var(--custom-green-50)] px-3 py-2 rounded-lg font-semibold">
                      <div className="w-2 h-2 bg-[var(--custom-green-500)] rounded-full mr-2 animate-pulse"></div>
                      Approved
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gradient-to-br from-[var(--custom-blue-50)] to-white rounded-2xl border-2 border-dashed border-[var(--custom-blue-200)]">
              <div className="bg-[var(--custom-blue-100)] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-10 w-10 text-[var(--custom-blue-400)]" />
              </div>
              <p className="text-[var(--custom-gray-700)] text-xl font-semibold mb-2">
                No Leave History
              </p>
              <p className="text-[var(--custom-gray-500)] text-sm max-w-md mx-auto">
                You haven't taken any leaves yet. Your leave requests will
                appear here once approved.
              </p>
            </div>
          )}
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
