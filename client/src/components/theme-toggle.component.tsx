import { useContext } from "react";
import { ThemeContext } from "../context/theme.context";
import { Themes } from "../types/themes.type";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { cn } from "../utils/cn";

export default function ThemeToggle() {
  const { theme, setTheme } = useContext(ThemeContext);

  const toggleTheme = () => {
    if (theme === Themes.LIGHT) {
      setTheme(Themes.DARK);
    } else {
      setTheme(Themes.LIGHT);
    }
  };

  return (
    <div
      onClick={toggleTheme}
      className="flex cursor-pointer w-[3rem] rounded-full bg-base-200"
    >
      <div
        className={cn(
          "flex justify-center items-center bg-base-content rounded-full h-[1.5rem] w-[1.5rem] text-base-200 duration-300",
          theme === Themes.DARK && "translate-x-[100%]"
        )}
      >
        {theme === Themes.LIGHT ? (
          <FontAwesomeIcon icon={faSun}></FontAwesomeIcon>
        ) : (
          <FontAwesomeIcon icon={faMoon}></FontAwesomeIcon>
        )}
      </div>
    </div>
  );
}
