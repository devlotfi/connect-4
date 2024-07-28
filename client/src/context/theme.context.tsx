import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { Themes } from "../types/themes.type";
import { Constants } from "../constants";

interface ThemeContext {
  theme: Themes;
  setTheme: (theme: Themes) => void;
}

const initialValue: ThemeContext = {
  theme: Themes.LIGHT,
  setTheme() {},
};

export const ThemeContext = createContext(initialValue);

export function ThemeProvider({ children }: PropsWithChildren) {
  const initTheme = () => {
    const theme = localStorage.getItem(Constants.THEME_STORAGE_KEY);
    if (theme) {
      return theme;
    }
    return Themes.LIGHT;
  };

  const [theme, setTheme] = useState<Themes>(initTheme() as Themes);

  useEffect(() => {
    if (theme === Themes.LIGHT || theme === Themes.DARK) {
      const element = document.getElementById("theme-provider") as HTMLElement;
      element.dataset.theme = theme;
      localStorage.setItem(Constants.THEME_STORAGE_KEY, theme);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
