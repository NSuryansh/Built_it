import { toast } from "react-toastify";

const CustomToast = (text, color = "orange") => {
  toast.dismiss();
  return toast(text, {
    position: "bottom-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    className: `custom-toast ${color}`,
  });
};

export default CustomToast;
