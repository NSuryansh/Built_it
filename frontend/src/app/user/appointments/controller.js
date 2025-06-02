const { default: CustomToast } = require("@/components/common/CustomToast");

export const getPrevApp = async (setpreviousAppointments) => {
  const token = localStorage.getItem("token");
  const user_id = localStorage.getItem("userid");
  try {
    const res = await fetch(
      `http://localhost:3000/user/pastuserappt?userId=${user_id}`,
      { headers: { Authorization: "Bearer " + token } }
    );
    const resp = await res.json();
    setpreviousAppointments(resp);
  } catch (error) {
    console.error(error);
    CustomToast("Error fetching past appointments");
  }
};

export const getCurrApp = async (setupcomingAppointments) => {
  const token = localStorage.getItem("token");
  const user_id = localStorage.getItem("userid");
  try {
    const res = await fetch(
      `http://localhost:3000/user/currentuserappt?userId=${user_id}`,
      {
        headers: { Authorization: "Bearer " + token },
      }
    );
    const resp = await res.json();
    setupcomingAppointments(resp);
  } catch (error) {
    console.error(error);
    CustomToast("Error fetching current appointments");
  }
};
