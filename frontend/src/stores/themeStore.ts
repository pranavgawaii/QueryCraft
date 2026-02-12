import { create } from "zustand";

interface ThemeState {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: typeof window !== "undefined" && localStorage.getItem("theme") === "dark" ? "dark" : "light",
  toggleTheme: () => {
    console.log("Toggle clicked!"); // Debug log
    set((state) => {
      const newTheme = state.theme === "light" ? "dark" : "light";
      console.log("Switching to:", newTheme); // Debug log
      
      // Save to localStorage
      localStorage.setItem("theme", newTheme);
      
      // Apply to document
      const root = document.documentElement;
      
      if (newTheme === "dark") {
        root.classList.add("dark");
        console.log("Added dark class"); // Debug log
      } else {
        root.classList.remove("dark");
        console.log("Removed dark class"); // Debug log
      }
      
      return { theme: newTheme };
    });
  },
}));

// Initialize theme on load
if (typeof window !== "undefined") {
  const savedTheme = localStorage.getItem("theme");
  console.log("Initial theme:", savedTheme); // Debug log
  if (savedTheme === "dark") {
    document.documentElement.classList.add("dark");
  }
}
