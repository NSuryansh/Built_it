import { toast } from "react-toastify";

export default toast("Error while fetching data", {
  position: "bottom-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  className: "custom-toast",
});