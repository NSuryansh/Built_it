import CustomToast from "@/components/common/CustomToast";

export const fetchDoctors = async (setDoctors) => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(
      "http://localhost:3000/user_admin/getdoctors?user_type=user",
      {
        headers: { Authorization: "Bearer " + token },
      }
    );
    const data = await res.json();
    setDoctors(data);
  } catch (err) {
    console.error("Error fetching doctors:", err);
    CustomToast("Error while fetching data");
  }
};

export const handleSubmit = async (
  e,
  setisLoading,
  formData,
  setStep,
  setFormData,
  setSelectedDoctor,
  selectedDoctor
) => {
  e.preventDefault();
  setisLoading(true);

  const lowerCaseEmail = formData.email.toLowerCase();
  const [address, domain] = lowerCaseEmail.split("@");

  if (domain != "iiti.ac.in") {
    CustomToast("Please book with your institute email id");
    return;
  }

  let numfound = false;
  for (let i = 0; i < address.length; i++) {
    if (address[i] >= "0" && address[i] <= "9") {
      numfound = true;
    } else if (numfound === true) {
      CustomToast("Please enter a valid email address");
      return;
    }
  }

  const payload = {
    doctorId: selectedDoctor.id,
    doctorName: selectedDoctor.name,
    ...formData,
  };
  const user_id = localStorage.getItem("userid");
  const token = localStorage.getItem("token");
  try {
    const res = await fetch("http://localhost:3000/user_doc/requests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        userId: user_id,
        doctorId: selectedDoctor.id,
        dateTime: formData.date,
        reason: formData.note,
      }),
    });
    const respData = await res.json();
    // alert("Booking Confirmed!");
    CustomToast("Appointment Requested");
    setStep(1);
    setSelectedDoctor(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      note: "",
      date: "",
    });
    setisLoading(false);
  } catch (err) {
    setisLoading(false);
    console.error("Error submitting booking request:", err);
    CustomToast("Error while booking appointment");
  }
};
