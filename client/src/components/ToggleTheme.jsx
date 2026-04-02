import { useTheme } from "./theme-provider";
import { Sun, Moon } from "lucide-react";

export default function ToggleTheme() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-black transition-all duration-300 hover:scale-105"
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
}
