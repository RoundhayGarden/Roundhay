import background from "../../assets/registerBackground.png";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import useTheme from "../../zustand/useTheme";

const RegisterWell = () => {
  const location = useLocation();
  const isSignUp = location.pathname === "/signup";
  const [showForm, setShowForm] = useState(false);
  const { theme, toggleTheme } = useTheme();
  useEffect(() => {
    const root = document.documentElement;
    theme === "dark"
      ? root.classList.add("dark")
      : root.classList.remove("dark");
  }, [theme]);

  useEffect(() => {
    setShowForm(false);
    const timer = setTimeout(() => setShowForm(true), 700);
    return () => clearTimeout(timer);
  }, [isSignUp]);

  return (
    <div
      style={{
        backgroundImage: `url(${background})`,
        height: "100dvh",
        width: "100vw",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: "200%",
          height: "150%",
          top: "50%",
          left: "-50%",
          backgroundColor: "var(--background)",
          position: "absolute",
          transform: isSignUp ? "rotate(-45deg)" : "rotate(45deg)",
          transition: "transform 1.0s ease-in-out",
          zIndex: 1,
        }}
      />

      <div
        style={{
          position: "absolute",
          zIndex: 2,
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: showForm ? 1 : 0,
          pointerEvents: showForm ? "auto" : "none",
        }}
      >
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          style={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
            color: "var(--foreground)",
            right: isSignUp ? "5%" : "95%",
          }}
          className="fixed top-4 z-50 p-2 rounded-full shadow-sm transition-colors duration-200"
        >
          {theme === "dark" ? <Sun /> : <Moon />}
        </button>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            padding: "0 16px",
          }}
          className="sm:block"
        >
          <div
            style={{
              marginLeft:
                window.innerWidth >= 640 ? (isSignUp ? "50%" : "0%") : "0",
              transition: "margin-left 1.0s ease-in-out",
              display: "flex",
              justifyContent: "center",
              width: window.innerWidth >= 640 ? "50%" : "100%",
            }}
          >
            {isSignUp ? <SignUp /> : <SignIn />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterWell;
