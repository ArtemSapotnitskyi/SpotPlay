// src/context/SettingsContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type Theme = "light" | "dark" | "system";

interface SettingsContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  accentColor: string;
  setAccentColor: (color: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

export function SettingsProvider({ children }: { children: ReactNode }) {
  // Зчитуємо збережені налаштування або ставимо дефолтні
  const [theme, setTheme] = useState<Theme>(
    (localStorage.getItem("app-theme") as Theme) || "system",
  );

  const [accentColor, setAccentColor] = useState(
    localStorage.getItem("app-accent-color") || "#1ab854",
  );

  useEffect(() => {
    localStorage.setItem("app-theme", theme);
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("app-accent-color", accentColor);
    document.documentElement.style.setProperty("--color-accent", accentColor);
  }, [accentColor]);

  return (
    <SettingsContext.Provider
      value={{ theme, setTheme, accentColor, setAccentColor }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
