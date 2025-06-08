import { motion } from "framer-motion";
import { HashLoader } from "react-spinners";

const CustomLoader = ({ color, text }) => {
  const loaderColor =
    color === "green" ? "#047857" : color === "blue" ? "#004ba8" : "#ff4800";
  const loaderText = text || "Loading your wellness journey...";
  const backColorProps =
    color === "green"
      ? "from-[var(--custom-green-50)] to-[var(--custom-teal-50)]"
      : color === "blue"
      ? "from-[var(--custom-gray-50)] to-[var(--custom-blue-50)]"
      : "from-[var(--custom-orange-50)] to-[var(--custom-red-50)]";

  return (
    <div
      className={`flex flex-col items-center justify-center h-screen bg-gradient-to-br ${backColorProps}`}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <HashLoader color={loaderColor} radius={6} height={20} width={5} />
      </motion.div>
      <p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-4 text-[var(--custom-gray-600)] font-medium"
      >
        {loaderText}
      </p>
    </div>
  );
};

export default CustomLoader;
