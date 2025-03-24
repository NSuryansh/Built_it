export const checkAuth = async (userType) => {
    const token = localStorage.getItem("token");
    if (!token) {
        return false;
    }

    try {
        const response = await fetch(`http://localhost:3000/${userType === "user" ? "profile" : "docprofile"}`, {
            method: "GET",
            headers: { Authorization: "Bearer " + token },
        });

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
        } else {
            localStorage.setItem("userid", res2['doctor']["id"]);
            localStorage.setItem("username", res2['doctor']["name"]);
            localStorage.setItem("user_mobile", res2['doctor']["mobile"]);
            localStorage.setItem("user_email", res2['doctor']["email"]);
            localStorage.setItem("reg_id", res2['doctor']["reg_id"]);
            localStorage.setItem("desc", res2['doctor']["desc"] || "");
        }
    } catch (error) {
        console.log(error);
        return false;
    }

    return true;
};
