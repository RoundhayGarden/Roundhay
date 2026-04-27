import { useEffect } from "react";
import useTheme from "../../zustand/useTheme";

const { theme } = useTheme();

useEffect(() => {
  const root = document.documentElement;
  theme === "dark" ? root.classList.add("dark") : root.classList.remove("dark");
}, [theme]);
