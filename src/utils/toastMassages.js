import { Slide, toast } from "react-toastify";

const baseOptions = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: false,
  progress: undefined,
  transition: Slide,
};

export const onInvalid = (errors) => {
    Object.values(errors).forEach((error) => {
      if (error?.message) {
        handleToastMessage(error.message, "warning");
      }
    });
}


export const handleToastMessage = (message, type) => {
  const theme = document.documentElement.classList.contains("dark")
    ? "dark"
    : "light";
  const options = { ...baseOptions, theme };

  switch (type) {
    case "success":
      toast.success(message, options);
      break;
    case "warning":
      toast.warning(message, options);
      break;
    case "error":
      toast.error(message, options);
      break;
    default:
      toast(message, options);
  }
};
