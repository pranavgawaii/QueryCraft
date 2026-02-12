import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "@/stores/themeStore";

export const ThemeToggle = () => {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  console.log("Current theme:", theme); // Debug log

  const handleClick = () => {
    console.log("Button clicked!"); // Debug log
    toggleTheme();
  };

  return (
    <button
      onClick={handleClick}
      className="group relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 bg-white transition-all duration-300 hover:scale-110 hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800"
      aria-label="Toggle theme"
      type="button"
    >
      <div className="relative h-5 w-5">
        {/* Sun icon */}
        <Sun
          className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${
            theme === "light"
              ? "rotate-0 scale-100 opacity-100"
              : "rotate-90 scale-0 opacity-0"
          }`}
        />
        {/* Moon icon */}
        <Moon
          className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${
            theme === "dark"
              ? "rotate-0 scale-100 opacity-100"
              : "-rotate-90 scale-0 opacity-0"
          }`}
        />
      </div>
    </button>
  );
};
