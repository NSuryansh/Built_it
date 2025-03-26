export const checkAuth = async (userType) => {
    function isTokenExpired(token) {
        if (!token) return false; 
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
    if (isTokenExpired(token)) {
        return false;  
    }
    try {
        let user = "";
        if(userType === "user"){
            user = "profile";
        }else if(userType === "doc"){
            user = "docprofile";
        }else{
            user = "adminprofile";
        }
        const response = await fetch(`http://localhost:3000/${user}`, {
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
            localStorage.setItem("user_type", userType);
        } else if(userType === "doc") {
            localStorage.setItem("userid", res2['doctor']["id"]);
            localStorage.setItem("username", res2['doctor']["name"]);
            localStorage.setItem("user_mobile", res2['doctor']["mobile"]);
            localStorage.setItem("user_email", res2['doctor']["email"]);
            localStorage.setItem("reg_id", res2['doctor']["reg_id"]);
            localStorage.setItem("desc", res2['doctor']["desc"] || "");
            localStorage.setItem("user_type", userType);
        } else {
            localStorage.setItem("userid", res2["admin"]["id"]);
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
