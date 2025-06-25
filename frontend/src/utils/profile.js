export const checkAuth = async (userType) => {
  function isTokenExpired(token) {
    if (token === null) return true;
    console.log(token);
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch (error) {
      console.log("Error in validating the JWST Token: ", error);
      return false;
    }
  }

  const token = localStorage.getItem("token");
  // console.log(token)
  if (isTokenExpired(token)) {
    return false;
  }
  try {
    const response = await fetch(
      `/api/${userType}/profile`,
      {
        method: "GET",
        headers: { Authorization: "Bearer " + token },
      }
    );

    if (!response.ok) {
      return false;
    }

    const res2 = await response.json();
    console.log(res2);

    if (userType === "user") {
      localStorage.setItem("userid", res2["user"]["id"]);
      localStorage.setItem("username", res2["user"]["username"]);
      localStorage.setItem("user_mobile", res2["user"]["mobile"]);
      localStorage.setItem("user_email", res2["user"]["email"]);
      localStorage.setItem("user_alt_mobile", res2["user"]["alt_mobile"]);
      localStorage.setItem("user_rollNo", res2["user"]["rollNo"]);
      localStorage.setItem("user_type", userType);
    } else if (userType === "doc") {
      localStorage.setItem("userid", res2["doctor"]["id"]);
      localStorage.setItem("username", res2["doctor"]["name"]);
      localStorage.setItem("user_mobile", res2["doctor"]["mobile"]);
      localStorage.setItem("user_email", res2["doctor"]["email"]);
      localStorage.setItem("reg_id", res2["doctor"]["reg_id"]);
      localStorage.setItem("desc", res2["doctor"]["desc"]);
      localStorage.setItem("address", res2["doctor"]["address"]);
      localStorage.setItem("isProfileDone", res2["doctor"]["isProfileDone"]);
      localStorage.setItem("office_address", res2["doctor"]["office_address"]);
      localStorage.setItem("experience", res2["doctor"]["experience"]);
      localStorage.setItem("user_type", userType);
    } else {
      localStorage.setItem("userid", res2["admin"]["id"]);
      localStorage.setItem("username", res2["admin"]["name"]);
      localStorage.setItem("user_email", res2["admin"]["email"]);
      localStorage.setItem("user_mobile", res2["admin"]["mobile"]);
      localStorage.setItem("user_type", userType);
    }
  } catch (error) {
    console.log(error);
    return false;
  }

  return true;
};
