export const checkAuth = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        return false;
    }

    try {
        const response = await fetch("http://localhost:3000/profile", {
            method: "GET",
            headers: { Authorization: "Bearer " + token },
        });

        if (!response.ok) {
            return false;
        }

        const res2 = await response.json();
        console.log(res2)
        localStorage.setItem("userid", res2["user"]["id"])
        localStorage.setItem("useranme", res2["user"]["username"])
        localStorage.setItem("user_mobile", res2["user"]["mobile"])
        localStorage.setItem("user_email", res2["user"]["email"])
        localStorage.setItem("user_alt_mobile", res2["user"]["alt_mobile"])
    } catch (error) {
        console.log(error);
        return false;
    }

    return true;
};
