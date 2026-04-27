import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";
import { handleToastMessage } from "../utils/toastMassages";

const useWishlistToggle = () => {
  const navigate = useNavigate();
  const toggleWishlist = useAppStore((state) => state.toggleWishlist);

  const handleToggle = (movie, event) => {
    if (event) event.stopPropagation();
    const success = toggleWishlist(movie);
    if (!success) {
      handleToastMessage("You should login first.", "warning");
      setTimeout(() => navigate("/signin"), 1500);
    }
  };

  return handleToggle;
};

export default useWishlistToggle;