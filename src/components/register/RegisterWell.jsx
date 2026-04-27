import background from "../../assets/registerBackground.png";
import backgroundTablet from "../../assets/backgroundImageTablet.png";
import backgroundMobile from "../../assets/backgroundImagePhone.png";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import { useAppStore } from "../../store/useAppStore";

const RegisterWell = () => {
  const location = useLocation();
  const isSignUp = location.pathname === "/signup";
  const [showForm, setShowForm] = useState(false);
  const theme = useAppStore((s) => s.theme);
  const toggleTheme = useAppStore((s) => s.toggleTheme);

  const [vw, setVw] = useState(window.innerWidth);
  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const isMobile = vw < 640;
  const isTablet = vw >= 640 && vw < 1024;
  const isTV = vw >= 1920;
  const isNarrow = isMobile || isTablet;

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

  const diagonalStyle = {
    width: "200%",
    height: "150%",
    top: "50%",
    left: "-50%",
    backgroundColor: "var(--background)",
    position: "absolute",
    transform: isSignUp ? "rotate(-45deg)" : "rotate(45deg)",
    transition: "transform 1.0s ease-in-out",
    zIndex: 1,
  };

  const desktopPanelStyle = {
    width: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: isSignUp ? "50%" : "0%",
    transition: "margin-left 1.0s ease-in-out",
    padding: isTV ? "0 120px" : "0 40px",
  };

  const narrowPanelStyle = {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: isMobile ? "0 16px" : "0 48px",
  };

  const togglePos = isNarrow
    ? { top: "16px", right: "16px" }
    : isSignUp
      ? { top: "16px", right: "5%" }
      : { top: "16px", left: "5%" };

  return (
    <div
      style={{
        backgroundImage: `url(${isMobile ? backgroundMobile : isTablet ? backgroundTablet : background})`,
        height: "100dvh",
        width: "100vw",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {!isNarrow && <div style={diagonalStyle} />}

      {isNarrow && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "var(--background)",
            opacity: 0.5,
            zIndex: 1,
          }}
        />
      )}

      <button
        onClick={toggleTheme}
        aria-label="Toggle theme"
        style={{
          position: "fixed",
          zIndex: 50,
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
          color: "var(--foreground)",
          padding: "8px",
          borderRadius: "50%",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ...togglePos,
          opacity: showForm ? 1 : 0,
          pointerEvents: showForm ? "auto" : "none",
        }}
      >
        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      <div
        style={{
          position: "absolute",
          zIndex: 2,
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: isNarrow ? "center" : "flex-start",
          overflowY: isMobile ? "auto" : "hidden",
          paddingTop: isMobile ? "72px" : 0,
          paddingBottom: isMobile ? "32px" : 0,
          opacity: showForm ? 1 : 0,
          pointerEvents: showForm ? "auto" : "none",
        }}
      >
        <div style={isNarrow ? narrowPanelStyle : desktopPanelStyle}>
          {isSignUp ? <SignUp /> : <SignIn />}
        </div>
      </div>
    </div>
  );
};

export default RegisterWell;
