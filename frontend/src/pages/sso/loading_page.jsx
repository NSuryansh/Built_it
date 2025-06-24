import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Shield,
  Sparkles,
  User,
  Stethoscope,
  Crown,
  ArrowRight,
  Mail,
  Lock,
} from "lucide-react";
import CustomToast from "../../components/common/CustomToast";
import { useNavigate, useSearchParams } from "react-router-dom";

const LoadingPage = () => {
  const [loadingText, setLoadingText] = useState("Connecting...");
  const [dots, setDots] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showRegister, setShowRegister] = useState(false);
  const [userFound, setUserFound] = useState(null);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const token = searchParams.get("token");
        if (!token) {
          CustomToast("No token to verify");
          setTimeout(() => {
            navigate("/user/login");
          }, 2000);
        } else {
          const response = await fetch(
            `https://built-it.onrender.com/api/sso?token=${token}`,
            {
              method: "POST",
            }
          );
          const data = await response.json();
          console.log(response.data);
          console.log(data);
          if (data.success) {
            if (data.role === "user") {
              const response = await fetch(
                "https://built-it.onrender.com/api/user/login",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    username: data.username,
                  }),
                }
              );
              const res = await response.json();
              if (res.success) {
                localStorage.setItem("userid", res.user.id);

                subscribeToPush(res.user.id);
              }

              if (res["message"] === "Login successful") {
                localStorage.setItem("token", res["token"]);
                setUserFound(true);
                navigate("/user/dashboard");
              } else {
                CustomToast(res["message"]);
              }
            } else if (data.role === "doc") {
              const response = await fetch(
                "https://built-it.onrender.com/api/doc/login",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    email: data.email,
                  }),
                }
              );
              const res = await response.json();
              if (res["message"] === "Login successful") {
                localStorage.setItem("token", res["token"]);
                setUserFound(true);
                navigate("/doctor/dashboard");
              } else {
                CustomToast(res["message"], "blue");
              }
            } else if (data.role === "admin") {
              const response = await fetch(
                "https://built-it.onrender.com/api/admin/login",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    email: data.email,
                  }),
                }
              );
              const res = await response.json();
              if (res["message"] === "Login successful") {
                localStorage.setItem("token", res["token"]);
                setUserFound(true);
                navigate("/admin/dashboard");
              } else {
                CustomToast(res["message"], "green");
              }
            } else {
              setUserFound(false);
            }
          } else {
            CustomToast("Not logged in");
            setTimeout(() => {
              navigate("/user/login");
            }, 2000);
          }
        }
      } catch (error) {
        CustomToast("Some error occured");
        setTimeout(() => {
          navigate("/user/login");
        }, 2000);
      }
    };
    checkLogin();
  }, []);

  useEffect(() => {
    if (userFound === null) {
      // Still loading
      const texts = [
        "Connecting...",
        "Authenticating...",
        "Checking credentials...",
        "Verifying account...",
      ];

      let textIndex = 0;
      const textInterval = setInterval(() => {
        textIndex = (textIndex + 1) % texts.length;
        setLoadingText(texts[textIndex]);
      }, 2000);

      const dotsInterval = setInterval(() => {
        setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
      }, 500);

      return () => {
        clearInterval(textInterval);
        clearInterval(dotsInterval);
      };
    } else if (userFound === false) {
      // User not found, show registration after a brief delay
      const timer = setTimeout(() => {
        setShowRegister(true);
      }, 1500);

      setLoadingText("Account not found");
      setDots("");

      return () => clearTimeout(timer);
    }
  }, [userFound]);

  const floatingParticles = Array.from({ length: 6 }, (_, i) => (
    <motion.div
      key={i}
      className="absolute w-2 h-2 bg-orange-300 rounded-full opacity-40"
      initial={{
        x:
          Math.random() *
          (typeof window !== "undefined" ? window.innerWidth : 800),
        y:
          Math.random() *
          (typeof window !== "undefined" ? window.innerHeight : 600),
      }}
      animate={{
        x:
          Math.random() *
          (typeof window !== "undefined" ? window.innerWidth : 800),
        y:
          Math.random() *
          (typeof window !== "undefined" ? window.innerHeight : 600),
        scale: [1, 1.5, 1],
        opacity: [0.2, 0.6, 0.2],
      }}
      transition={{
        duration: 8 + Math.random() * 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  ));

  const registrationOptions = [
    {
      type: "user",
      title: "Join as User",
      description:
        "Access wellness resources, connect with community, and track your mental health journey",
      icon: User,
      color: "from-orange-400 to-orange-500",
      hoverColor: "hover:from-orange-500 hover:to-orange-600",
      buttonText: "Get Started",
      buttonIcon: ArrowRight,
      isRestricted: false,
      restrictionText: "",
    },
    {
      type: "doctor",
      title: "Join as Doctor",
      description:
        "Provide professional support, manage patient care, and contribute to mental wellness",
      icon: Stethoscope,
      color: "from-blue-400 to-blue-500",
      hoverColor: "hover:from-blue-500 hover:to-blue-600",
      buttonText: "Contact Admin",
      buttonIcon: Mail,
      isRestricted: true,
      restrictionText: "Doctor registration requires admin approval",
    },
    {
      type: "admin",
      title: "Join as Admin",
      description:
        "Manage platform operations, oversee community safety, and maintain system integrity",
      icon: Crown,
      color: "from-green-400 to-green-500",
      hoverColor: "hover:from-green-500 hover:to-green-600",
      buttonText: "Contact Curator",
      buttonIcon: Lock,
      isRestricted: true,
      restrictionText: "Admin access requires curator approval",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 flex items-center justify-center relative overflow-hidden">
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {floatingParticles}
      </div>

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-orange-200 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-amber-200 rounded-full blur-lg"></div>
        <div className="absolute bottom-32 left-32 w-40 h-40 bg-orange-100 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-amber-100 rounded-full blur-xl"></div>
      </div>

      <AnimatePresence mode="wait">
        {!showRegister ? (
          // Loading/Authentication Screen
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center z-10 px-8"
          >
            {/* Logo and branding */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="mb-8"
            >
              <div className="flex items-center justify-center mb-4">
                <div
                  // animate={{
                  //   rotate: [0, 5, -5, 0],
                  //   scale: [1, 1.05, 1],
                  // }}
                  // transition={{
                  //   duration: 4,
                  //   repeat: Infinity,
                  //   ease: "easeInOut",
                  // }}
                  className="relative"
                >
                  <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-lg">
                    <img
                      src="/assets/logo.svg"
                      className="w-8 h-8 text-white"
                    />
                  </div>

                  <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                    className="absolute inset-0 border-2 border-orange-400 rounded-xl"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0, 0.4] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeOut",
                      delay: 0.5,
                    }}
                    className="absolute inset-0 border-2 border-orange-300 rounded-xl"
                  />
                </div>
              </div>

              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="text-3xl font-bold text-gray-800 mb-2"
              >
                IITI CalmConnect
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="text-gray-600 text-lg"
              >
                Your wellness journey awaits
              </motion.p>
            </motion.div>

            {/* Loading animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="mb-8"
            >
              {userFound === null && (
                <div className="flex justify-center space-x-2 mb-6">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{
                        scale: [1, 1.2, 1],
                        backgroundColor: ["#FB923C", "#F97316", "#FB923C"],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.2,
                        ease: "easeInOut",
                      }}
                      className="w-3 h-3 rounded-full bg-orange-400"
                    />
                  ))}
                </div>
              )}

              <motion.div
                animate={{
                  opacity: userFound === false ? [1, 0.7, 1] : [1, 0.5, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className={`text-lg font-medium ${
                  userFound === false ? "text-orange-600" : "text-gray-700"
                }`}
              >
                {loadingText}
                {userFound === null && (
                  <span className="inline-block w-8 text-left">{dots}</span>
                )}
              </motion.div>
            </motion.div>

            {/* Feature icons - only show during loading */}
            {userFound === null && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="flex justify-center space-x-8"
              >
                {[
                  { icon: Heart, delay: 0 },
                  { icon: Shield, delay: 0.3 },
                  { icon: Sparkles, delay: 0.6 },
                ].map(({ icon: Icon, delay }, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 1.2 + delay }}
                    whileHover={{ scale: 1.1 }}
                    className="w-12 h-12 bg-white bg-opacity-50 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg"
                  >
                    <motion.div
                      animate={{
                        y: [0, -2, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: delay,
                        ease: "easeInOut",
                      }}
                    >
                      <Icon className="w-5 h-5 text-orange-600" />
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Progress bar - only show during loading */}
            {userFound === null && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.5 }}
                className="mt-12 w-64 mx-auto"
              >
                <div className="h-1 bg-orange-200 rounded-full overflow-hidden">
                  <motion.div
                    animate={{
                      x: ["-100%", "100%"],
                      scaleX: [0.3, 1, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"
                    style={{ width: "40%" }}
                  />
                </div>
              </motion.div>
            )}

            {/* Message */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 2 }}
              className="mt-8 text-gray-500 text-sm"
            >
              {userFound === false
                ? "Let's get you set up with a new account"
                : "Creating a safe space for your mental wellness journey"}
            </motion.p>
          </motion.div>
        ) : (
          // Registration Options Screen
          <motion.div
            key="registration"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center z-10 px-8 max-w-4xl mx-auto"
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-12"
            >
              <div className="flex items-center justify-center mb-6">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-lg">
                  <img src="/assets/logo.svg" className="w-6 h-6 text-white" />
                </div>
              </div>

              <h1 className="text-3xl font-bold text-gray-800 mb-3">
                Welcome to IITI CalmConnect
              </h1>

              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Choose how you'd like to join our mental wellness community.
                Each role offers unique features tailored to your needs.
              </p>
            </motion.div>

            {/* Registration Options */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {registrationOptions.map((option, index) => (
                <motion.div
                  key={option.type}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() =>
                    !option.isRestricted ? navigate("/user/signup") : null
                  }
                  className={`bg-white bg-opacity-80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group border border-white border-opacity-50 ${
                    option.isRestricted ? "relative" : ""
                  }`}
                >
                  {/* Restricted badge */}
                  {option.isRestricted && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center shadow-lg">
                      <Lock className="w-3 h-3 text-white" />
                    </div>
                  )}

                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${option.color} rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300`}
                  >
                    <option.icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {option.title}
                  </h3>

                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {option.description}
                  </p>

                  {/* Restriction notice */}
                  {option.isRestricted && (
                    <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-amber-700 text-xs font-medium">
                        {option.restrictionText}
                      </p>
                    </div>
                  )}

                  <motion.button
                    className={`inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r ${option.color} ${option.hoverColor} text-white rounded-lg font-medium transition-all duration-300 group-hover:shadow-lg`}
                    whileHover={{ x: 5 }}
                    disabled={option.isRestricted}
                    onClick={() => {
                      navigate("/user/signup");
                    }}
                  >
                    <span>{option.buttonText}</span>
                    <option.buttonIcon className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              ))}
            </div>

            {/* Footer message */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-gray-500 text-sm"
            >
              Need help? Contact our support team for assistance with account
              setup
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoadingPage;
