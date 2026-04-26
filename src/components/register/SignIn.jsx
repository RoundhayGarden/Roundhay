import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
    const navigate = useNavigate();


  return (
    <>
      <div>SignIn</div>
      <Button variant="outline" onClick={() => navigate("/signup")}>
        Go to Sign Up
      </Button>
    </>
  );
};

export default SignIn;
