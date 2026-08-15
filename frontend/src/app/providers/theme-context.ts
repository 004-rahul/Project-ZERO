import { createContext, useContext } from "react";
import { DEFAULT_THEME } from "@/themes/registry";

export interface ThemeCtx {
  theme: string;
  setTheme: (id: string) => void;
}

export const ThemeContext = createContext<ThemeCtx>({
  theme: DEFAULT_THEME,
  setTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);
